<template>
  <ViewNavWrapper>
    <div class="h-full">
      <Confetti ref="confetti" />
      <CourseInsertsModal
        v-if="
          user &&
          exerciseIndex !== null &&
          moduleIndex != null &&
          course &&
          sandbox !== null
        "
        :user="user"
        :exercise-index="exerciseIndex"
        :module-index="moduleIndex"
        :course="course"
        :course-done="courseDone"
        :in-sandbox-mode="sandbox"
        :is-exercise-complete="isExerciseComplete"
      />

      <ExerciseSkeleton v-if="!isContentLoaded" />

      <div v-if="isContentLoaded" class="h-full flex-col sm:flex">
        <UnitTopNav
          class="p-3 w-full box-border z-10"
          :dropdown-one-items="dropdownModules"
          :dropdown-two-items="dropdownExercises"
          :dropdown-one-index="moduleIndex"
          :dropdown-two-index="exerciseIndex"
          :back-link="backLink"
          :forward-link="forwardLink"
          :can-go-back="!isFirstExercise"
          :can-go-forward="!isLastExercise || courseDone"
          :sandbox="sandbox"
          :pulse-next="pulseNext"
        />
        <ProgressBar
          v-if="percentComplete !== null"
          :percent-complete="percentComplete"
        />
        <CardExerciseTypeMultipleChoice
          v-if="type === 'type_choice'"
          :markdown-source="markdownSource"
          :hint-markdown-source="hintMarkdownSource"
          :answers="question.Answers"
          :question="question.Question"
          :answer="question.Answer"
          :sandbox="sandbox"
          :callback="submitTypeChoice"
          :hint-callback="hintCallback"
          :did-user-hint="usedHint"
          :uuid="route.params.exerciseUUID"
          unit-type="exercise"
          :is-logged-in="isLoggedIn"
          :already-answered="isExerciseComplete"
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
          :did-user-cheat="didUserCheat"
          :hint-callback="hintCallback"
          :did-user-hint="usedHint"
          :uuid="route.params.exerciseUUID"
          unit-type="exercise"
          :is-logged-in="isLoggedIn"
          :is-exercise-complete="isExerciseComplete"
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
          :did-user-hint="usedHint"
          :is-cheating="isCheating"
          :did-user-cheat="didUserCheat"
          :uuid="route.params.exerciseUUID"
          unit-type="exercise"
          :is-logged-in="isLoggedIn"
          :is-exercise-complete="isExerciseComplete"
        />
        <p v-else>something went wrong</p>
      </div>
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import UnitTopNav from "@/components/navs/UnitTopNav.vue";
import ExerciseSkeleton from "@/components/skeletons/ExerciseSkeleton.vue";
import CardExerciseTypeMultipleChoice from "@/components/cards/CardExerciseTypeMultipleChoice.vue";
import CardExerciseTypeCode from "@/components/cards/CardExerciseTypeCode.vue";
import CardExerciseTypeCodeCanvas from "@/components/cards/CardExerciseTypeCodeCanvas.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import CourseInsertsModal from "@/components/modals/CourseInsertsModal.vue";
import { loadUser } from "@/lib/cloudStore.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import Confetti from "@/components/Confetti.vue";

import { notify } from "@/lib/notification.js";

import { useStore } from "vuex";

import { reactive, computed, onMounted, ref, toRefs } from "vue";

import {
  eventExecuteCode,
  eventExerciseFailure,
  eventExerciseSuccess,
  eventSubmitMultipleChoice,
  eventClickCheat,
} from "@/lib/analytics.js";

import {
  getCurrentExercise,
  getPreviousExercise,
  getNextExercise,
  submitCodeExercise,
  submitMultipleChoiceExercise,
  submitCodeCanvasExercise,
  getFirstExercise,
  getCourses,
  getFirstExerciseInModule,
  getExerciseByID,
  getCourseProgress,
  getUnitsProgress,
  markHintSeen,
  markSolutionSeen,
} from "@/lib/cloudClient.js";

import {
  cacheExerciseCode,
  hasCachedCode,
  deleteCachedCode,
} from "@/lib/localStorageLib.js";

export default {
  components: {
    ViewNavWrapper,
    UnitTopNav,
    ExerciseSkeleton,
    CardExerciseTypeMultipleChoice,
    CardExerciseTypeCode,
    CardExerciseTypeCodeCanvas,
    ProgressBar,
    CourseInsertsModal,
    Confetti,
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
      usedHint: false,
      courseProgress: null,
      unitProgress: null,
      didUserCheat: false,
      didUserHint: false,
      nextExercise: null,
      previousExercise: null,
      chapterCompleted: false,
      pulseNext: false,
    });

    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const unitDoneModal = ref(null);
    const confetti = ref(null);

    const sandbox = computed(() => {
      if (state.isFree === null) {
        return null;
      }
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
        return null;
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
      if (total === 0) {
        return null;
      }
      return (complete / total) * 100;
    });

    const isExerciseComplete = computed(() => {
      if (!state.courseProgress) {
        return false;
      }
      return state.courseProgress[route.params.moduleUUID][
        route.params.exerciseUUID
      ]?.Completed;
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
          color: isChapterComplete ? "blue" : null,
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
          color: isExerciseComplete ? "blue" : null,
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
      const isLanding = exerciseIndex.value === 0 && moduleIndex.value === 0;
      return getComputedMeta({
        title: isLanding
          ? course.value?.Title
          : `${course.value?.Title}: ${state.exerciseTitle}`,
        description: isLanding
          ? course.value?.Description
          : state.exerciseDescription,
        featuredImageURL: course.value?.ImageURL,
      });
    });
    useMeta(computedMeta);

    onMounted(async () => {
      if (route.params.moduleUUID && route.params.exerciseUUID) {
        await Promise.all([
          loadCourses(),
          loadNextExercise(),
          loadPrevExercise(),
          loadCurrentExercise(),
          getUnitProgressIfLoggedIn(),
          loadUserStatus(),
        ]);
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

    const loadCourses = async () => {
      try {
        state.courses = await getCourses(route.params.courseUUID);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const loadNextExercise = async () => {
      try {
        state.nextExercise = await getNextExercise(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
      } catch (err) {
        // ignore toast error
      }
    };

    const loadPrevExercise = async () => {
      try {
        state.previousExercise = await getPreviousExercise(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
      } catch (err) {
        // ignore toast error
      }
    };

    const loadCurrentExercise = async () => {
      try {
        const exercise = await getExerciseByID(
          route.params.courseUUID,
          route.params.exerciseUUID
        );
        loadExercise(exercise);
      } catch (err) {
        // ignore toast error
      }
    };

    const loadUserStatus = async () => {
      getUnitProgressIfLoggedIn();
      await getCourseProgressIfLoggedIn();
      if (store.getters.getIsLoggedIn) {
        try {
          if (!store.getters.getUser) {
            await loadUser(store.commit);
          }
        } catch (err) {
          notify({
            type: "danger",
            text: err,
          });
        }
      }
    };

    const hintCallback = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }
      state.usedHint = true;
      if (!isExerciseComplete.value) {
        notify({
          type: "warn",
          text: "XP for this assignment reduced by 50%",
        });
      }
      try {
        await markHintSeen(route.params.exerciseUUID);
      } catch (err) {
        console.log(err);
      }
    };

    const cheatCallback = async () => {
      if (!store.getters.getIsLoggedIn) {
        return;
      }

      state.isCheating = !state.isCheating;
      if (state.isCheating && !isExerciseComplete.value) {
        notify({
          type: "warn",
          text: "XP for this assignment reduced by 75%",
        });
        try {
          await markSolutionSeen(route.params.exerciseUUID);
        } catch (err) {
          console.log(err);
        }
        eventClickCheat(route.params.exerciseUUID, course.value?.Title);
      }
    };

    const resetCode = () => {
      state.code = state.defaultCode;
      deleteCachedCode(route.params.exerciseUUID);
    };

    const handleSuccess = async (submitResponse) => {
      state.pulseNext = true;
      eventExerciseSuccess(
        route.params.exerciseUUID,
        course?.value?.Title,
        exerciseIndex.value,
        moduleIndex.value
      );
      if (submitResponse.XPReward && submitResponse.XPReward > 0) {
        confetti.value?.start();
        notify({
          type: "success",
          text: `Correct! You earned ${submitResponse.XPReward} XP`,
        });
        loadUser(store.commit);
      } else {
        confetti.value?.start();
        notify({
          type: "success",
          text: "Correct! Great Job",
        });
      }
      await getCourseProgressIfLoggedIn();
      await getUnitProgressIfLoggedIn();
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

    const handleSandbox = async () => {
      notify({
        type: "danger",
        text: "You are in Sandbox Mode! Become a patron to continue passing off assignments.",
      });
    };

    const submitTypeCode = ({ output }) => {
      if (!sandbox.value) {
        cacheExerciseCode(
          store.getters.getUser.UUID,
          route.params.exerciseUUID,
          state.code
        );
      }
      eventExecuteCode(route.params.exerciseUUID, course.value?.Title);
      if (sandbox.value) {
        handleSandbox();
        return;
      }
      verifyCode({ output });
    };

    const submitTypeCodeCanvas = ({ hash }) => {
      if (!sandbox.value) {
        cacheExerciseCode(
          store.getters.getUser.UUID,
          route.params.exerciseUUID,
          state.code
        );
      }
      eventExecuteCode(route.params.exerciseUUID, course.value?.Title);
      if (sandbox.value) {
        handleSandbox();
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
      state.usedHint = false;
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
      if (
        hasCachedCode(store.getters.getUser.UUID, route.params.exerciseUUID)
      ) {
        state.code = hasCachedCode(
          store.getters.getUser.UUID,
          route.params.exerciseUUID
        );
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

    return {
      ...toRefs(state),
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
      hintCallback,
      cheatCallback,
      resetCode,
      submitTypeCode,
      submitTypeCodeCanvas,
      submitTypeChoice,
      goToBeginning,
      route,
      user: computed(() => store.getters.getUser),
      isExerciseComplete,
      confetti,
    };
  },
};
</script>

<style scoped></style>
