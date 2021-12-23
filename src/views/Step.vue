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
            name: `Step ${i+1} of ${project.Steps.length}`,
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
      <CardStepTypeInfo
        v-if="type === 'type_info'"
        :markdown-source="markdownSource"
        :project-slug="project.Slug"
        :step-slug="stepSlug"
        :done-with-step="() => goForward(true)"
      />
      <CardStepTypeManual
        v-else-if="type === 'type_manual'"
        :markdown-source="markdownSource"
        :project-slug="project.Slug"
        :step-slug="stepSlug"
        :done-with-step="() => goForward(true)"
      />
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
import ExerciseNav from '@/components/ExerciseNav.vue';
import CardStepTypeInfo from '@/components/cards/CardStepTypeInfo.vue';
import CardStepTypeManual from '@/components/cards/CardStepTypeManual.vue';
import Section from '@/components/Section.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';

import { loadBalance, loadUser } from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import {
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
    ExerciseNav,
    FeedbackModal,
    CardStepTypeInfo,
    CardStepTypeManual
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
      const submitResponse = await submitInformationalStep(this.$route.params.stepUUID);
      await this.handleSuccess(submitResponse);
    },
    async submitTypeManual() {
      const submitResponse = await submitManualStep(this.$route.params.stepUUID);
      this.handleSuccess(submitResponse);
    },
    async handleSuccess(submitResponse) {
      this.isComplete = true;
      if (submitResponse.ProjectDone) {
        if (!this.projectDone) {
          eventFinishCourse(this.project.Title, false);
        }
        this.projectDone = true;
      }
      loadBalance(this);
      notify({
        type: 'success',
        text: 'Great Job!'
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
    }
  }
};
</script>

<style scoped>
</style>
