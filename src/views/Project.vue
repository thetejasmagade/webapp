<template>
  <ViewNavWrapper>
    <div class="h-full">
      <ProjectInsertsModal
        v-if="project && projectDone !== null"
        ref="projectInsertsModal"
        :project="project"
        :project-done="projectDone"
      />

      <div v-if="project" class="h-full flex flex-col">
        <UnitTopNav
          v-if="isContentLoaded"
          class="p-3 w-full box-border z-10"
          :dropdown-one-items="dropdownSteps"
          :dropdown-one-index="stepIndex"
          :back-link="backLink"
          :forward-link="forwardLink"
          :can-go-back="!isFirstStep"
          :can-go-forward="!isLastStep"
          :sandbox="false"
        />

        <ProgressBar
          v-if="isContentLoaded && isLoggedIn"
          :percent-complete="percentComplete"
        />
        <CardStepTypeInfo
          v-if="type === 'type_info' && $route.params.stepUUID"
          :markdown-source="markdownSource"
          :project-slug="project.Slug"
          :step-slug="stepSlug"
          :uuid="$route.params.stepUUID"
          :done-with-step="submitTypeInfo"
          :is-logged-in="isLoggedIn"
          :is-step-complete="isStepComplete"
        />
        <CardStepTypeManual
          v-else-if="type === 'type_manual' && $route.params.stepUUID"
          :markdown-source="markdownSource"
          :project-slug="project.Slug"
          :step-slug="stepSlug"
          :done-with-step="submitTypeManual"
          :uuid="$route.params.stepUUID"
          :is-logged-in="isLoggedIn"
          :is-step-complete="isStepComplete"
        />
        <CardStepTypeRepo
          v-else-if="type === 'type_submit_repo' && $route.params.stepUUID"
          :markdown-source="markdownSource"
          :project-slug="project.Slug"
          :step-slug="stepSlug"
          :done-with-step="submitTypeRepo"
          :uuid="$route.params.stepUUID"
          :is-logged-in="isLoggedIn"
          :is-step-complete="isStepComplete"
        />
      </div>
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import UnitTopNav from "@/components/navs/UnitTopNav.vue";
import ProjectInsertsModal from "@/components/modals/ProjectInsertsModal.vue";
import CardStepTypeInfo from "@/components/cards/CardStepTypeInfo.vue";
import CardStepTypeManual from "@/components/cards/CardStepTypeManual.vue";
import CardStepTypeRepo from "@/components/cards/CardStepTypeRepo.vue";
import ProgressBar from "@/components/ProgressBar.vue";

import { notify } from "@/lib/notification.js";

import {
  getCurrentStep,
  getPreviousStep,
  getNextStep,
  submitInformationalStep,
  submitManualStep,
  getFirstStep,
  getProjects,
  getProjectProgress,
  getUnitsProgress,
  getStepByID,
  submitRepoStep,
} from "@/lib/cloudClient.js";

import { useStore } from "vuex";

import { reactive, toRefs, computed, ref, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useMeta } from "vue-meta";
import { getComputedMeta } from "@/lib/meta.js";

export default {
  components: {
    UnitTopNav,
    CardStepTypeInfo,
    CardStepTypeManual,
    ViewNavWrapper,
    ProgressBar,
    ProjectInsertsModal,
    CardStepTypeRepo,
  },
  setup() {
    const state = reactive({
      stepTitle: null,
      stepDescription: null,
      markdownSource: "",
      type: "",
      isFirstStep: false,
      isLastStep: false,
      complete: "",
      projects: null,
      stepSlug: null,
      nextStep: null,
      previousStep: null,
      projectProgress: null,
      unitProgress: null,
    });
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const projectInsertsModal = ref(null);

    onMounted(async () => {
      try {
        state.projects = await getProjects();
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
      getUnitProgressIfLoggedIn();
      getProjectProgressIfLoggedIn();

      try {
        state.nextStep = await getNextStep(
          route.params.projectUUID,
          route.params.stepUUID
        );
      } catch (err) {
        // dont display toast error
      }
      try {
        state.previousStep = await getPreviousStep(
          route.params.projectUUID,
          route.params.stepUUID
        );
      } catch (err) {
        // dont display toast error
      }

      if (route.params.stepUUID) {
        const step = await getStepByID(
          route.params.projectUUID,
          route.params.stepUUID
        );
        moveToStep(step);

        return;
      }

      await navToCurrentStep();
    });

    const stepIndex = computed(() => {
      if (!project.value?.Steps) {
        return null;
      }
      let count = 0;
      for (const step of project.value?.Steps) {
        if (step.UUID === route.params.stepUUID) {
          return count;
        }
        count++;
      }
      return null;
    });

    const forwardLink = computed(() => {
      if (!state.nextStep) return null;
      const step = state.nextStep.Step;
      const forwardLink = {
        name: "Project",
        params: {
          projectUUID: step.ProjectUUID,
          stepUUID: step.UUID,
        },
      };
      return forwardLink;
    });

    const backLink = computed(() => {
      if (!state.previousStep) return null;
      const step = state.previousStep?.Step;
      const backLink = {
        name: "Project",
        params: {
          projectUUID: step.ProjectUUID,
          stepUUID: step.UUID,
        },
      };
      return backLink;
    });

    const isContentLoaded = computed(() => {
      return state.markdownSource !== "";
    });

    const isLoggedIn = computed(() => {
      return store.getters.getIsLoggedIn;
    });

    const project = computed(() => {
      return state.projects?.find(
        (project) => project.UUID === route.params.projectUUID
      );
    });

    const percentComplete = computed(() => {
      if (!state.unitProgress) {
        return 0;
      }
      if (!(route.params.projectUUID in state.unitProgress)) {
        return 0;
      }
      const pProgress = state.unitProgress[route.params.projectUUID];
      return (pProgress.NumDone / pProgress.NumMax) * 100;
    });

    const isStepComplete = computed(() => {
      if (!state.projectProgress) {
        return false;
      }
      return state.projectProgress[route.params.stepUUID]?.Completed;
    });

    const projectDone = computed(() => {
      if (!project.value?.Steps) {
        return null;
      }
      if (!state.projectProgress) {
        return null;
      }
      for (const step of project.value.Steps) {
        if (!(step.UUID in state.projectProgress)) {
          return false;
        }
        if (!state.projectProgress[step.UUID]?.Completed) {
          return false;
        }
      }
      return true;
    });

    const dropdownSteps = computed(() => {
      return project.value?.Steps?.map((step, i) => {
        let isStepComplete = false;
        if (
          state.projectProgress &&
          step.UUID in state.projectProgress &&
          state.projectProgress[step.UUID].Completed
        ) {
          isStepComplete = true;
        }
        return {
          name: `Step ${i + 1} of ${project.value?.Steps.length}`,
          color: isStepComplete ? "blue" : null,
          link: {
            name: "Project",
            params: {
              projectUUID: route.params.projectUUID,
              stepUUID: step.UUID,
            },
          },
        };
      });
    });

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: state.stepTitle,
        description: state.stepDescription,
        featuredImageURL: project.value?.ImageURL,
      });
    });
    useMeta(computedMeta);

    const getProjectProgressIfLoggedIn = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      try {
        state.projectProgress = await getProjectProgress(
          route.params.projectUUID
        );
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const getUnitProgressIfLoggedIn = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      try {
        state.unitProgress = await getUnitsProgress();
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const submitTypeInfo = async () => {
      const submitResponse = await submitInformationalStep(
        route.params.stepUUID
      );
      await handleSuccess(submitResponse);
    };

    const submitTypeManual = async () => {
      const submitResponse = await submitManualStep(route.params.stepUUID);
      handleSuccess(submitResponse);
    };

    const submitTypeRepo = async (link) => {
      const submitResponse = await submitRepoStep(route.params.stepUUID, link);
      handleSuccess(submitResponse);
    };

    const handleSuccess = async () => {
      if (state.projectProgress[route.params.stepUUID].Completed) {
        return;
      } else {
        notify({
          type: "success",
          text: "Great Job!",
        });
      }
      await getUnitProgressIfLoggedIn();
      await getProjectProgressIfLoggedIn();
      projectInsertsModal.value?.show();
    };

    const navToStep = (step, replace) => {
      router.push({
        name: "Project",
        replace: replace,
        params: {
          projectUUID: step.Step.ProjectUUID,
          stepUUID: step.Step.UUID,
        },
      });
    };

    const moveToStep = (step) => {
      state.isFirstStep = step.Step.IsFirst;
      state.isLastStep = step.Step.IsLast;
      state.stepSlug = step.Step.Slug;

      state.markdownSource = step.Step.Readme;
      state.stepTitle = step.Step.Title;
      state.stepDescription = step.Step.Description;
      state.type = step.Step.Type;
    };

    const navToCurrentStep = async () => {
      try {
        const step = await getCurrentStep(route.params.projectUUID);
        navToStep(step, true);
      } catch (err) {
        // this probably happens because course is complete
        const step = await getFirstStep(route.params.projectUUID);
        navToStep(step, true);
      }
    };

    const goToBeginning = async () => {
      try {
        const step = await getFirstStep(route.params.projectUUID);
        navToStep(step, true);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    return {
      ...toRefs(state),
      stepIndex,
      forwardLink,
      backLink,
      project,
      isContentLoaded,
      percentComplete,
      isLoggedIn,
      projectDone,
      dropdownSteps,
      submitTypeInfo,
      submitTypeManual,
      goToBeginning,
      projectInsertsModal,
      isStepComplete,
      submitTypeRepo,
    };
  },
};
</script>

<style scoped></style>
