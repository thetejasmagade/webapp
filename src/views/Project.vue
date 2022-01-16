<template>
  <ViewNavWrapper>
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
          v-if="isContentLoaded"
          class="
            p-3
            w-full
            box-border
            shadow
            z-10
          "
          :dropdown-one-items="dropdownSteps"
          :dropdown-one-index="stepIndex"
          :go-back="goBack"
          :go-forward="() => {goForward(false)}"
          :can-go-back="!isFirstStep"
          :can-go-forward="!isLastStep || projectDone"
          :sandbox="false"
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
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from '@/components/ViewNavWrapper.vue';
import CourseDoneModal from '@/components/CourseDoneModal.vue';
import ExerciseNav from '@/components/ExerciseNav.vue';
import CardStepTypeInfo from '@/components/cards/CardStepTypeInfo.vue';
import CardStepTypeManual from '@/components/cards/CardStepTypeManual.vue';
import Section from '@/components/Section.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';

import { loadBalance } from '@/lib/cloudStore.js';
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
  getProjectProgress,
  getStepByID
} from '@/lib/cloudClient.js';

export default {
  components: {
    CourseDoneModal,
    Section,
    ExerciseNav,
    FeedbackModal,
    CardStepTypeInfo,
    CardStepTypeManual,
    ViewNavWrapper
  },
  data() {
    return {
      markdownSource: '',
      type: '',
      projectDone: false,
      isFirstStep: false,
      isLastStep: false,
      complete: '',
      projects: null,
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
    isContentLoaded() {
      if (this.markdownSource === ''){
        return false;
      }
      return true;
    },
    dropdownSteps() {
      return this.project?.Steps?.map((step, i) => {
        let isStepComplete = false;
        if (this.projectProgress
        && step.UUID in this.projectProgress 
        && this.projectProgress[step.UUID].Completed) {
          isStepComplete = true;
        }
        return {
          name: `Step ${i+1} of ${this.project.Steps.length}`,
          color: isStepComplete ? 'gold' : null,
          link: {
            name: 'Project',
            params: {
              projectUUID: this.$route.params.projectUUID,
              stepUUID: step.UUID
            }
          }
        };
      });
    },
    project() {
      const project = this.projects?.find(project => project.UUID === this.$route.params.projectUUID);
      return project;
    }
  },
  async mounted() {
    try {
      this.projects = await getProjects();
    } catch(err) {
      notify({
        type: 'danger',
        text: err
      });
    }

    this.getProjectProgressIfLoggedIn();

    if (this.$route.params.stepUUID) {
      const step = await getStepByID(
        this.$route.params.projectUUID,
        this.$route.params.stepUUID
      );
      this.moveToStep(step);
      return;
    }

    await this.navToCurrentStep();
  },
  methods: {
    async getProjectProgressIfLoggedIn(){
      if (!this.$store.getters.getIsLoggedIn){
        return;
      }
      try {
        this.projectProgress = await getProjectProgress(this.$route.params.projectUUID);
      } catch(err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
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
        name: 'Project',
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
      if (this.type === 'type_info' && done) {
        await this.submitTypeInfo();
      }
      if (this.type === 'type_manual' && done) {
        await this.submitTypeManual();
      }
      if (this.projectDone && this.isLastStep) {
        this.$refs.projectDoneModal.show();
        return;
      }
      if (this.isLastStep) {
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
