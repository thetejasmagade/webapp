<template>
  <div class="exercise-root">
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
      class="exercise-container desktop"
    >
      <Multipane
        layout="horizontal"
      >
        <div
          class="
            side 
            left
            bg-white
            border-r
            border-gray-300
          "
        >
          <ExerciseNav
            class="nav"
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

          <MarkdownViewer
            ref="viewer"
            class="markdown-viewer"
            :source="markdownSource"
          />
        </div>
        <MultipaneResizer layout="horizontal" />
        <div
          v-if="type === 'type_info' || type === 'type_manual'"
          id="info-container"
          class="
          side
          right
          bg-white
          "
        >
          <BlockButton
            class="btn mb-4"
            :click="() => goForward(type === 'type_manual')"
          >
            I'm done with this step
          </BlockButton>
          <BlockButton
            v-if="type === 'type_manual'"
            class="mr-3"
            :click="linkClick"
            color="gray"
          >
            <FontAwesomeIcon
              icon="eye"
            />
            Cheat
          </BlockButton>
        </div>
      </Multipane>
    </div>
    <div class="mobile">
      <Section title="Come back on a computer">
        <p>
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
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';
import Section from '@/components/Section.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { loadBalance, loadUser } from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import {
  gtmEventEarnGems,
  gtmEventUnlockAchievement,
  gtmEventFinishCourse,
  gtmEventClickExerciseNavigation
} from '@/lib/gtm.js';

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
    Multipane,
    MultipaneResizer,
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
      const rewardsResponse =await submitManualStep(this.$route.params.stepUUID);
      this.isComplete = true;
      this.handleRewards(rewardsResponse);
    },
    async handleRewards(rewardsResponse) {
      if (rewardsResponse.ProjectDone) {
        if (!this.projectDone) {
          gtmEventFinishCourse(this.project.Title, false);
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
        gtmEventEarnGems(rewardsResponse.GemCredit);
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
            gtmEventEarnGems(achievement.GemReward);
          }
          if (achievement.UUID) {
            gtmEventUnlockAchievement(achievement.UUID);
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
      console.log(step.Step);
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
      gtmEventClickExerciseNavigation(this.$route.params.stepUUID, this.project.Title);
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
    async goForward(submitManual) {
      gtmEventClickExerciseNavigation(this.$route.params.stepUUID, this.project.Title);
      if (this.type === 'type_info' && !this.isComplete) {
        await this.submitTypeInfo();
      }
      if (this.type === 'type_manual' && submitManual) {
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

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import "@/styles/consts.scss";

.mobile {
  display: none !important;
  @media screen and (max-width: $mobile-size) {
    display: block !important;
  }

  padding: 1em;

  p {
    padding: 1em;
  }
}

.desktop {
  @media screen and (max-width: $mobile-size) {
    display: none !important;
  }
}

.exercise-root {
  height: 100%;
}

.exercise-container {
  display: flex;
  height: calc(100vh - #{$bar-height});
}

.side {
  height: 100%;
  display: flex;
  flex-direction: column;

  &.left {
    width: 50%;
  }

  &.right {
    flex: 1;
    overflow: auto;
  }
}

#info-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  p {
    font-size: 2em;
  }

  .btn {
    font-size: 1.2em;
  }
}

.markdown-viewer {
  flex: 1 1 auto;
  overflow-y: auto;
}

.nav {
  flex: 0 0 auto;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
}
</style>
