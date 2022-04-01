<template>
  <ViewNavWrapper :title="course?.Title">
    <div class="h-full">
      <FeedbackModal
        v-if="route.params.exerciseUUID"
        ref="feedbackModal"
        :uuid="route.params.exerciseUUID"
        unit-type="exercise"
      />
      <SandboxModeModal ref="sandboxModeModal" />
      <UnitDoneModal
        v-if="course"
        ref="unitDoneModal"
        :unit-u-u-i-d="course.UUID"
        :go-to-beginning-callback="goToBeginning"
        :type="'course'"
      />

      <InsertTypeAchievement
        v-if="
          insertsToShow?.length > 0 && insertsToShow[0].type === 'achievement'
        "
        :achievement-earned="insertsToShow[0].data"
        :on-done="onSeenInsert"
      />
      <InsertTypeDiscordSync
        v-else-if="
          insertsToShow?.length > 0 && insertsToShow[0].type === 'discord'
        "
        :on-done="onSeenInsert"
      />
      <ExerciseSkeleton v-else-if="!isContentLoaded" />
      <div v-else class="h-full flex-col sm:flex bg-white">
        <ExerciseNav
          class="p-3 w-full box-border shadow z-10"
          :dropdown-one-items="dropdownModules"
          :dropdown-two-items="dropdownExercises"
          :dropdown-one-index="moduleIndex"
          :dropdown-two-index="exerciseIndex"
          :back-link="backLink"
          :forward-link="forwardLink"
          :can-go-back="!isFirstExercise"
          :can-go-forward="!isLastExercise || courseDone"
          :forward-click="
            type === 'type_info' && isLoggedIn ? doneWithExercise : null
          "
          :sandbox="sandbox"
          :click-comment="() => showFeedbackModal()"
        />
        <ProgressBar
          v-if="isContentLoaded && isLoggedIn"
          :percent-complete="percentComplete"
        />
        <CardExerciseTypeInfo
          v-if="type === 'type_info'"
          :markdown-source="markdownSource"
        />
        <CardExerciseTypeMultipleChoice
          v-else-if="type === 'type_choice'"
          :markdown-source="markdownSource"
          :hint-markdown-source="hintMarkdownSource"
          :answers="question.Answers"
          :question="question.Question"
          :sandbox="sandbox"
          :callback="submitTypeChoice"
          :hint-callback="hintCallback"
          :is-hint-purchased="isHintPurchased"
          :hint-cost="hintCost"
        />
        <CardExerciseTypeCode
          v-else-if="type === 'type_code'"
          v-model="code"
          :markdown-source="markdownSource"
          :hint-markdown-source="hintMarkdownSource"
          :prog-lang="progLang"
          :solution-code="complete"
          :run-callback="submitTypeCode"
          :reset-code-callback="resetCode"
          :cheat-callback="cheatCallback"
          :is-cheating="isCheating"
          :is-cheat-purchased="isCheatPurchased"
          :cheat-cost="cheatCost"
          :hint-callback="hintCallback"
          :is-hint-purchased="isHintPurchased"
          :hint-cost="hintCost"
        />
        <CardExerciseTypeCodeCanvas
          v-else-if="type === 'type_code_canvas'"
          v-model="code"
          :markdown-source="markdownSource"
          :hint-markdown-source="hintMarkdownSource"
          :prog-lang="progLang"
          :solution-code="complete"
          :run-callback="submitTypeCodeCanvas"
          :reset-code-callback="resetCode"
          :cheat-callback="cheatCallback"
          :hint-callback="hintCallback"
          :is-hint-purchased="isHintPurchased"
          :hint-cost="hintCost"
          :is-cheating="isCheating"
          :is-cheat-purchased="isCheatPurchased"
          :cheat-cost="cheatCost"
        />
        <p v-else>something went wrong</p>
      </div>
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import UnitDoneModal from "@/components/UnitDoneModal.vue";
import ExerciseNav from "@/components/ExerciseNav.vue";
import FeedbackModal from "@/components/FeedbackModal.vue";
import SandboxModeModal from "@/components/SandboxModeModal.vue";
import ExerciseSkeleton from "@/components/ExerciseSkeleton.vue";
import CardExerciseTypeInfo from "@/components/cards/CardExerciseTypeInfo.vue";
import CardExerciseTypeMultipleChoice from "@/components/cards/CardExerciseTypeMultipleChoice.vue";
import CardExerciseTypeCode from "@/components/cards/CardExerciseTypeCode.vue";
import CardExerciseTypeCodeCanvas from "@/components/cards/CardExerciseTypeCodeCanvas.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import InsertTypeAchievement from "@/components/inserts/InsertTypeAchievement.vue";
import InsertTypeDiscordSync from "@/components/inserts/InsertTypeDiscordSync.vue";
import { loadBalance, loadUser } from "@/lib/cloudStore.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import { notify } from "@/lib/notification.js";

import { useStore } from "vuex";

import { reactive, computed, onMounted, ref, watchEffect, toRefs } from "vue";

import {
  eventFinishCourse,
  eventExecuteCode,
  eventExerciseFailure,
  eventExerciseSuccess,
  eventSubmitMultipleChoice,
  eventClickCheat,
  eventOpenSandboxModeModal,
} from "@/lib/analytics.js";

import {
  getCurrentExercise,
  getPreviousExercise,
  getNextExercise,
  submitInformationalExercise,
  submitCodeExercise,
  submitMultipleChoiceExercise,
  submitCodeCanvasExercise,
  getFirstExercise,
  getCourses,
  getFirstExerciseInModule,
  getExerciseByID,
  getCourseProgress,
  getUnitsProgress,
  getPendingAchievements,
  getHintStatus,
  purchaseHint,
  getCheatStatus,
  purchaseCheat,
} from "@/lib/cloudClient.js";

import {
  cacheExerciseCode,
  hasCachedCode,
  deleteCachedCode,
} from "@/lib/localStorageLib.js";

export default {
  components: {
    ViewNavWrapper,
    UnitDoneModal,
    CardExerciseTypeInfo,
    ExerciseNav,
    FeedbackModal,
    SandboxModeModal,
    ExerciseSkeleton,
    CardExerciseTypeMultipleChoice,
    CardExerciseTypeCode,
    CardExerciseTypeCodeCanvas,
    ProgressBar,
    InsertTypeAchievement,
    InsertTypeDiscordSync,
  },
  setup() {
    const state = reactive({
      exerciseTitle: null,
      exerciseDescription: null,
      markdownSource: "",
      hintMarkdownSource: "",
      type: "",
      question: {},
      progLang: "go",
      isFirstExercise: false,
      isLastExercise: false,
      code: "",
      complete: "",
      defaultCode: "",
      courses: null,
      isFree: null,
      isCheating: false,
      insertsToShow: [],
      courseProgress: null,
      unitProgress: null,
      isCheatPurchased: false,
      isHintPurchased: false,
      cheatCost: 0,
      hintCost: 0,
      nextExercise: null,
      previousExercise: null,
      chapterCompleted: false,
    });

    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const sandboxModeModal = ref(null);
    const feedbackModal = ref(null);
    const unitDoneModal = ref(null);

    const sandbox = computed(() => {
      return (
        (!store.getters.getUserIsSubscribed && !state.isFree) ||
        !store.getters.getIsLoggedIn
      );
    });

    const courseDone = computed(() => {
      if (!course?.value?.Modules) {
        return false;
      }
      for (const mod of course.value.Modules) {
        if (!state.courseProgress) {
          return false;
        }
        if (!(mod.UUID in state.courseProgress)) {
          return false;
        }
        for (const exercise of mod.Exercises) {
          if (!state.courseProgress[mod.UUID][exercise.UUID]?.Completed) {
            return false;
          }
        }
      }
      return true;
    });

    const forwardLink = computed(() => {
      if (!state.nextExercise) return null;
      let exercise = state.nextExercise.Exercise;
      let forwardLink = {
        name: "Course",
        params: {
          courseUUID: exercise.CourseUUID,
          moduleUUID: exercise.ModuleUUID,
          exerciseUUID: exercise.UUID,
        },
      };
      return forwardLink;
    });

    const backLink = computed(() => {
      if (!state.previousExercise) return null;
      let exercise = state.previousExercise.Exercise;
      let backLink = {
        name: "Course",
        params: {
          courseUUID: exercise.CourseUUID,
          moduleUUID: exercise.ModuleUUID,
          exerciseUUID: exercise.UUID,
        },
      };
      return backLink;
    });

    const isLoggedIn = computed(() => {
      return store.getters.getIsLoggedIn;
    });

    const percentComplete = computed(() => {
      if (!state.courseProgress) {
        return 0;
      }
      let complete = 0;
      let total = 0;
      for (const exercise in state.courseProgress[module?.value?.UUID]) {
        if (state.courseProgress[module?.value?.UUID][exercise].Completed) {
          complete++;
          total++;
        } else {
          total++;
        }
      }
      return (complete / total) * 100;
    });

    const dropdownModules = computed(() => {
      return course?.value?.Modules.map((mod, i) => {
        let isChapterComplete = false;
        if (state.courseProgress && mod.UUID in state.courseProgress) {
          for (const exercise of mod.Exercises) {
            if (!state.courseProgress[mod.UUID][exercise.UUID]?.Completed) {
              isChapterComplete = false;
              break;
            }
            isChapterComplete = true;
          }
        }
        return {
          name: `Chapter ${i + 1}: ${mod.Title}`,
          color: isChapterComplete ? "gold" : null,
          link: {
            name: "Course",
            params: {
              courseUUID: route.params.courseUUID,
              moduleUUID: mod.UUID,
            },
          },
        };
      });
    });

    const dropdownExercises = computed(() => {
      return exercises?.value?.map((ex, i) => {
        let isExerciseComplete = false;
        if (
          state.courseProgress &&
          module?.value?.UUID in state.courseProgress &&
          ex.UUID in state.courseProgress[module?.value?.UUID] &&
          state.courseProgress[module?.value?.UUID][ex.UUID].Completed
        ) {
          isExerciseComplete = true;
        }
        return {
          name: `Exercise ${i + 1} of ${exercises.value.length}`,
          color: isExerciseComplete ? "gold" : null,
          link: {
            name: "Course",
            params: {
              courseUUID: route.params.courseUUID,
              moduleUUID: module.value?.UUID,
              exerciseUUID: ex.UUID,
            },
          },
        };
      });
    });

    const isContentLoaded = computed(() => {
      if (state.markdownSource === "") {
        return false;
      }
      if (store.getters.getIsLoggedIn && state.insertsToShow === null) {
        return false;
      }
      return true;
    });

    const exerciseIndex = computed(() => {
      if (!module.value) {
        return null;
      }
      if (!module.value?.Exercises) {
        return null;
      }
      let count = 0;
      for (const exercise of module.value?.Exercises) {
        if (exercise.UUID === route.params.exerciseUUID) {
          return count;
        }
        count++;
      }
      return null;
    });

    const exercises = computed(() => {
      if (!module.value) {
        return null;
      }
      return module.value?.Exercises;
    });

    const module = computed(() => {
      if (!course || !course.value?.Modules) {
        return null;
      }
      for (const mod of course.value?.Modules) {
        if (mod.UUID === route.params.moduleUUID) {
          return mod;
        }
      }
      return null;
    });

    const moduleIndex = computed(() => {
      if (!course || !course.value?.Modules) {
        return null;
      }
      let index = 0;
      for (const mod of course.value?.Modules) {
        if (mod.UUID === route.params.moduleUUID) {
          return index;
        }
        index++;
      }
      return null;
    });

    const course = computed(() => {
      if (!state.courses) {
        return null;
      }
      for (const course of state.courses) {
        if (course.UUID === route.params.courseUUID) {
          return course;
        }
      }
      return null;
    });

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: state.exerciseTitle,
        description: state.exerciseDescription,
        image: course.value?.ImageURL,
      });
    });
    useMeta(computedMeta);

    onMounted(async () => {
      try {
        state.courses = await getCourses(route.params.courseUUID);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
      if (!store.getters.getUser) {
        loadUser(store.commit);
      }

      try {
        state.nextExercise = await getNextExercise(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
      } catch (err) {
        // ignore toast error
      }
      try {
        state.previousExercise = await getPreviousExercise(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
      } catch (err) {
        // ignore toast error
      }

      if (route.params.moduleUUID && route.params.exerciseUUID) {
        const exercise = await getExerciseByID(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
        loadExercise(exercise);
        getUnitProgressIfLoggedIn();

        await getCourseProgressIfLoggedIn();
        if (store.getters.getIsLoggedIn) {
          try {
            let pendingAchievements = await getPendingAchievements();
            const user = store.getters.getUser;
            if (
              user.DiscordUserID === null &&
              moduleIndex.value != 0 &&
              exerciseIndex.value === 0
            ) {
              state.insertsToShow.push({
                type: "discord",
              });
            }
            if (pendingAchievements.length > 0) {
              for (const achievement of pendingAchievements) {
                state.insertsToShow.push({
                  type: "achievement",
                  data: achievement,
                });
              }
            }
          } catch (err) {
            notify({
              type: "danger",
              text: err,
            });
          }
          loadHintStatus();
          loadCheatStatus();
        }
        return;
      }

      if (route.params.moduleUUID) {
        const exercise = await getFirstExerciseInModule(
          route.params.courseUUID,
          route.params.moduleUUID
        );
        navToExercise(exercise, true);
        return;
      }

      await navToCurrentExercise();
    });

    const doneWithExercise = async () => {
      try {
        await submitTypeInfo();
        const nextExercise = await getNextExercise(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
        navToExercise(nextExercise, false);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const loadHintStatus = async () => {
      try {
        const hintResp = await getHintStatus(route.params.exerciseUUID);
        state.isHintPurchased = hintResp.PurchasedAt !== null;
        state.hintCost = hintResp.HintCost;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const loadCheatStatus = async () => {
      try {
        const cheatResp = await getCheatStatus(route.params.exerciseUUID);
        state.isCheatPurchased = cheatResp.PurchasedAt !== null;
        state.cheatCost = cheatResp.CheatCost;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const onSeenInsert = () => {
      state.insertsToShow.shift();
    };

    const showSandboxModeModal = () => {
      eventOpenSandboxModeModal();
      sandboxModeModal.value.show();
    };

    const showFeedbackModal = () => {
      feedbackModal.value.show();
    };

    const hintCallback = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      if (!state.isHintPurchased) {
        await purchaseHint(route.params.exerciseUUID);
        loadBalance(store.commit);
        await loadHintStatus();
      }
    };

    const cheatCallback = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      if (!state.isCheatPurchased) {
        await purchaseCheat(route.params.exerciseUUID);
        loadBalance(store.commit);
        await loadCheatStatus();
      }
      state.isCheating = !state.isCheating;
      if (state.isCheating) {
        eventClickCheat(route.params.exerciseUUID, course.value?.Title);
      }
    };

    const resetCode = () => {
      state.code = state.defaultCode;
      deleteCachedCode(route.params.exerciseUUID);
    };

    const submitTypeInfo = async () => {
      const submitResponse = await submitInformationalExercise(
        route.params.exerciseUUID
      );
      await handleSuccess(submitResponse);
    };

    const handleSuccess = async (submitResponse) => {
      eventExerciseSuccess(
        route.params.exerciseUUID,
        course?.value?.Title,
        exerciseIndex.value,
        moduleIndex.value
      );
      if (state.type !== "type_info") {
        if (submitResponse.GemsEarned && submitResponse.GemsEarned > 0) {
          notify({
            type: "success",
            text: `Correct! You unlocked ${submitResponse.GemsEarned} ${
              submitResponse.GemsEarned === 1 ? "gem" : "gems"
            } 💎`,
          });
          await loadBalance(store.commit);
        } else {
          notify({
            type: "success",
            text: "Correct! Great Job",
          });
        }
      }
      getUnitProgressIfLoggedIn();
      getCourseProgressIfLoggedIn();
    };

    const getCourseProgressIfLoggedIn = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      try {
        state.courseProgress = await getCourseProgress(route.params.courseUUID);
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

    const verifyCode = async ({ output }) => {
      try {
        const submitResponse = await submitCodeExercise(
          route.params.exerciseUUID,
          output
        );
        await handleSuccess(submitResponse);
      } catch (err) {
        eventExerciseFailure(
          route.params.exerciseUUID,
          course.value?.Title,
          exerciseIndex.value,
          moduleIndex.value
        );
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const verifyHash = async ({ hash }) => {
      try {
        const submitResponse = await submitCodeCanvasExercise(
          route.params.exerciseUUID,
          hash
        );
        await handleSuccess(submitResponse);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const submitTypeCode = ({ output }) => {
      cacheExerciseCode(route.params.exerciseUUID, state.code);
      eventExecuteCode(route.params.exerciseUUID, course.value?.Title);
      if (sandbox.value) {
        showSandboxModeModal();
        notify({
          type: "danger",
          text: "You are in Sandbox Mode! Upgrade to continue Code Verification",
        });
        return;
      }
      verifyCode({ output });
    };

    const submitTypeCodeCanvas = ({ hash }) => {
      cacheExerciseCode(route.params.exerciseUUID, state.code);
      eventExecuteCode(route.params.exerciseUUID, course.value?.Title);
      if (sandbox.value) {
        showSandboxModeModal();
        notify({
          type: "danger",
          text: "You are in Sandbox Mode! Upgrade to continue Code Verification",
        });
        return;
      }
      verifyHash({ hash });
    };

    const submitTypeChoice = async (answer) => {
      eventSubmitMultipleChoice(route.params.exerciseUUID, course.value?.Title);
      try {
        const submitResponse = await submitMultipleChoiceExercise(
          route.params.exerciseUUID,
          answer
        );
        await handleSuccess(submitResponse);
      } catch (err) {
        eventExerciseFailure(route.params.exerciseUUID, course.value?.Title);
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const navToExercise = (exercise, replace) => {
      router.push({
        name: "Course",
        replace: replace,
        params: {
          courseUUID: exercise.Exercise.CourseUUID,
          moduleUUID: exercise.Exercise.ModuleUUID,
          exerciseUUID: exercise.Exercise.UUID,
        },
      });
    };

    const loadExercise = (exercise) => {
      state.isFree = exercise.Exercise.IsFree;
      state.isFirstExercise = exercise.Exercise.IsFirst;
      state.isLastExercise = exercise.Exercise.IsLast;
      state.isCheating = false;
      state.exerciseTitle = exercise.Exercise.Title;
      state.exerciseDescription = exercise.Exercise.Description;

      state.markdownSource = exercise.Exercise.Readme;
      state.hintMarkdownSource = exercise.Exercise.HintMarkdown;
      state.type = exercise.Exercise.Type;
      store.commit("setCurrentModuleUUID", route.params.moduleUUID);

      if (state.type === "type_code") {
        state.code = exercise.Exercise.Code;
        state.complete = exercise.Exercise.Complete;
        state.defaultCode = exercise.Exercise.Code;
        state.progLang = exercise.Exercise.ProgLang;
      } else if (state.type === "type_code_canvas") {
        state.code = exercise.Exercise.Code;
        state.complete = exercise.Exercise.Complete;
        state.defaultCode = exercise.Exercise.Code;
        state.progLang = exercise.Exercise.ProgLang;
      } else if (state.type === "type_choice") {
        state.question = exercise.Exercise.Question;
      }
      if (hasCachedCode(route.params.exerciseUUID)) {
        state.code = hasCachedCode(route.params.exerciseUUID);
      }
    };

    const navToCurrentExercise = async () => {
      try {
        const exercise = await getCurrentExercise(route.params.courseUUID);
        navToExercise(exercise, true);
      } catch (err) {
        // this probably happens because course is complete
        const exercise = await getFirstExercise(route.params.courseUUID);
        navToExercise(exercise, true);
      }
    };

    const goToBeginning = async () => {
      try {
        const exercise = await getFirstExercise(route.params.courseUUID);
        navToExercise(exercise, true);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    watchEffect(() => {
      if (courseDone.value) {
        unitDoneModal.value.show();
        eventFinishCourse(course.value?.Title, false);
      }
    });

    return {
      ...toRefs(state),
      sandboxModeModal,
      feedbackModal,
      unitDoneModal,
      isContentLoaded,
      sandbox,
      courseDone,
      forwardLink,
      backLink,
      isLoggedIn,
      percentComplete,
      dropdownModules,
      dropdownExercises,
      exerciseIndex,
      exercises,
      module,
      moduleIndex,
      course,
      doneWithExercise,
      onSeenInsert,
      showSandboxModeModal,
      showFeedbackModal,
      hintCallback,
      cheatCallback,
      resetCode,
      submitTypeInfo,
      submitTypeCode,
      submitTypeCodeCanvas,
      submitTypeChoice,
      goToBeginning,
      route,
    };
  },
};
</script>

<style scoped></style>
