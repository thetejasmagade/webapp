<template>
  <div class="h-full">
    <CourseDoneModal
      ref="projectDoneModal"
      :go-to-beginning-callback="goToBeginning"
    />
    <FeedbackModal
      v-if="$route.params.stepUUID"
      ref="feedbackModal"
      :uuid="$route.params.stepUUID"
      unit-type="step"
    />

    <div
      v-if="project"
      class="
        h-full
        hidden
        sm:flex
        flex-col
        bg-white
      "
    >
      <ExerciseNav
        class="
          p-3
          w-full
          box-border
          shadow
          z-10
        "
        :dropdown-one-items="project.Steps.map((step, i) => {
          return {
            name: `${i+1}/${project.Steps.length}`,
            link: {
              name: 'Step',
              params: {
                projectUUID: $route.params.projectUUID,
                stepUUID: step.UUID
              }
            }
          }
        })"
        :dropdown-one-index="stepIndex"
        :go-back="goBack"
        :go-forward="() => {goForward(false)}"
        :can-go-back="!isFirstStep"
        :can-go-forward="!isLastStep || projectDone"
        :is-complete="isComplete"
        :locked="false"
        :click-comment="() => showFeedbackModal()"
      />
      <div
        class="
        overflow-y-auto
        w-full
        flex
        flex-col
        items-center
      "
      >
        <div
          class="
          max-w-4xl
        "
        >
          <div class="mt-4 w-full flex flex-row justify-end">
            <BlockButton
              class="btn mr-3"
              :click="() => goForward(true)"
            >
              I'm done with this step
            </BlockButton>

            <BlockButton
              v-if="type === 'type_manual'"
              :click="linkClick"
              color="gray"
            >
              <FontAwesomeIcon
                icon="eye"
              />
              Cheat
            </BlockButton>
          </div>

          <MarkdownViewer
            ref="viewer"
          
            :source="markdownSource"
          />
        </div>
      </div>
    </div>
    <div
      class="
        block
        sm:hidden
        p-4
      "
    >
      <Section title="Come back on a computer">
        <p class="p-4">
          Coding is hard to do on a phone. I want you to have a great
          experience, so please hurry back on a larger device.
        </p>
      </Section>
    </div>
  </div>
</template>

<script>
import CourseDoneModal from '@/components/CourseDoneModal.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import BlockButton from '@/components/BlockButton.vue';
import ExerciseNav from '@/components/ExerciseNav.vue';
import Section from '@/components/Section.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { loadBalance, loadUser } from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import {
  eventEarnGems,
  eventUnlockAchievement,
  eventFinishCourse,
  eventClickExerciseNavigation
} from '@/lib/analytics.js';

import {
  getCurrentStep,
  getPreviousStep,
  getNextStep,
  submitInformationalStep,
  submitManualStep,
  getFirstStep,
  getProjects,
  getStepByID
} from '@/lib/cloudClient.js';

export default {
  components: {
    CourseDoneModal,
    Section,
    MarkdownViewer,
    BlockButton,
    ExerciseNav,
    FeedbackModal,
    FontAwesomeIcon
  },
  data() {
    return {
      markdownSource: '',
      type: '',
      projectDone: false,
      isFirstStep: false,
      isLastStep: false,
      isCurrentStep: false,
      complete: '',
      projects: null,
      isComplete: null,
      isCheating: false,
      stepSlug: null
    };
  },
  computed: {
    stepIndex() {
      if (!this.project?.Steps) {
        return null;
      }
      let count = 0;
      for (const step of this.project.Steps) {
        if (step.UUID === this.$route.params.stepUUID) {
          return count;
        }
        count++;
      }
      return null;
    },
    project() {
      const project = this.projects?.find(project => project.UUID === this.$route.params.projectUUID);
      return project;
    }
  },
  async mounted() {
    this.projects = await getProjects();

    if (this.$route.params.stepUUID) {
      const step = await getStepByID(
        this.$route.params.projectUUID,
        this.$route.params.stepUUID
      );
      this.moveToStep(step);
      return;
    }

    if (!this.$store.getters.getUser) {
      await loadUser(this);
    }

    await this.navToCurrentStep();
  },
  methods: {
    showFeedbackModal() {
      this.$refs.feedbackModal.show();
    },
    async submitTypeInfo() {
      const rewardsResponse = await submitInformationalStep(this.$route.params.stepUUID);
      this.isComplete = true;
      this.handleRewards(rewardsResponse);
    },
    async submitTypeManual() {
      const rewardsResponse = await submitManualStep(this.$route.params.stepUUID);
      this.isComplete = true;
      this.handleRewards(rewardsResponse);
    },
    async handleRewards(rewardsResponse) {
      if (rewardsResponse.ProjectDone) {
        if (!this.projectDone) {
          eventFinishCourse(this.project.Title, false);
        }
        this.projectDone = true;
      }
      if (
        (rewardsResponse.GemCredit && rewardsResponse.Message) ||
        (rewardsResponse.Achievements &&
          rewardsResponse.Achievements.length > 0)
      ) {
        loadBalance(this);
      }

      if (rewardsResponse.GemCredit) {
        eventEarnGems(rewardsResponse.GemCredit);
      }

      let notificationShown = false;
      if (rewardsResponse.GemCredit && rewardsResponse.Message) {
        notify({
          type: 'success',
          text: `${rewardsResponse.Message} 💎x${rewardsResponse.GemCredit}`
        });
        notificationShown = true;
      }
      if (rewardsResponse.Achievements) {
        for (const achievement of rewardsResponse.Achievements) {
          if (achievement.GemReward) {
            eventEarnGems(achievement.GemReward);
          }
          if (achievement.UUID) {
            eventUnlockAchievement(achievement.UUID);
          }
          notify({
            type: 'success',
            text: `${achievement.Title} achievement unlocked! 💎x${achievement.GemReward}`
          });
          notificationShown = true;
        }
      }
      if (!notificationShown) {
        notify({
          type: 'success',
          text: 'Great Job!'
        });
      }
    },
    scrollMarkdownToTop() {
      requestAnimationFrame(() => {
        if (this.$refs.viewer && this.$refs.viewer.$el) {
          this.$refs.viewer.$el.scrollTop = 0;
        }
      });
    },
    navToStep(step) {
      this.$router.push({
        name: 'Step',
        params: {
          projectUUID: step.Step.ProjectUUID,
          stepUUID: step.Step.UUID
        }
      });
    },
    async moveToStep(step) {
      if (step.ProjectDone) {
        this.projectDone = true;
      }

      this.isFirstStep = step.Step.IsFirst;
      this.isLastStep = step.Step.IsLast;
      this.isCurrentStep = step.IsCurrent;
      this.isComplete = step.IsComplete;
      this.stepSlug = step.Step.Slug;

      if (step.Step.Readme !== this.markdownSource) {
        this.scrollMarkdownToTop();
      }

      this.markdownSource = step.Step.Readme;
      this.type = step.Step.Type;
    },
    async navToCurrentStep() {
      try {
        const step = await getCurrentStep(
          this.$route.params.projectUUID
        );
        this.navToStep(step);
      } catch (err) {
        // this probably happens because course is complete
        const step = await getFirstStep(this.$route.params.projectUUID);
        this.navToStep(step);
      }
    },
    async goBack() {
      eventClickExerciseNavigation(this.$route.params.stepUUID, this.project.Title);
      try {
        const step = await getPreviousStep(
          this.$route.params.projectUUID,
          this.$route.params.stepUUID
        );
        this.navToStep(step);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async goForward(done) {
      eventClickExerciseNavigation(this.$route.params.stepUUID, this.project.Title);
      if (this.type === 'type_info' && !this.isComplete && done) {
        await this.submitTypeInfo();
      }
      if (this.type === 'type_manual' && !this.isComplete && done) {
        console.log('here');
        await this.submitTypeManual();
      }
      if (this.projectDone && this.isLastStep) {
        this.$refs.projectDoneModal.show();
        return;
      }
      try {
        const step = await getNextStep(
          this.$route.params.projectUUID,
          this.$route.params.stepUUID
        );
        this.navToStep(step);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async goToBeginning() {
      try {
        const step = await getFirstStep(this.$route.params.projectUUID);
        this.navToStep(step);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    linkClick() {
      window.open(`https://github.com/qvault/projects/tree/main/projects/${this.project.Slug}/${this.stepSlug}/src`, '_blank');
    }
  }
};
</script>

<style scoped>
</style>
