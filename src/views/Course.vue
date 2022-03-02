<template>
  <ViewNavWrapper :title="course?.Title">
    <div class="h-full">
      <FeedbackModal
        v-if="$route.params.exerciseUUID"
        ref="feedbackModal"
        :uuid="$route.params.exerciseUUID"
        unit-type="exercise"
      />
      <SandboxModeModal ref="sandboxModeModal" />
      <CourseDoneModal
        v-if="course"
        ref="courseDoneModal"
        :course-u-u-i-d="course.UUID"
        :go-to-beginning-callback="goToBeginning"
      />

      <AchievementUnlocked
        v-if="achievementsToShow?.length > 0"
        :achievement-earned="achievementsToShow[0]"
        :on-done="onSeenAchievement"
      />
      <ExerciseSkeleton v-else-if="!isContentLoaded" />
      <div v-else class="h-full hidden flex-col sm:flex bg-white">
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
          :sandbox="sandbox"
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
      </div>
      <div class="block sm:hidden p-4">
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
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import CourseDoneModal from "@/components/CourseDoneModal.vue";
import ExerciseNav from "@/components/ExerciseNav.vue";
import Section from "@/components/Section.vue";
import FeedbackModal from "@/components/FeedbackModal.vue";
import SandboxModeModal from "@/components/SandboxModeModal.vue";
import ExerciseSkeleton from "@/components/ExerciseSkeleton.vue";
import CardExerciseTypeInfo from "@/components/cards/CardExerciseTypeInfo.vue";
import CardExerciseTypeMultipleChoice from "@/components/cards/CardExerciseTypeMultipleChoice.vue";
import CardExerciseTypeCode from "@/components/cards/CardExerciseTypeCode.vue";
import CardExerciseTypeCodeCanvas from "@/components/cards/CardExerciseTypeCodeCanvas.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import AchievementUnlocked from "@/components/AchievementUnlocked.vue";
import { loadBalance } from "@/lib/cloudStore.js";

import { notify } from "@/lib/notification.js";

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
    CourseDoneModal,
    Section,
    CardExerciseTypeInfo,
    ExerciseNav,
    FeedbackModal,
    SandboxModeModal,
    ExerciseSkeleton,
    CardExerciseTypeMultipleChoice,
    CardExerciseTypeCode,
    CardExerciseTypeCodeCanvas,
    AchievementUnlocked,
    ProgressBar,
  },
  data() {
    return {
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
      achievementsToShow: null,
      courseProgress: null,
      unitProgress: null,
      isCheatPurchased: false,
      isHintPurchased: false,
      cheatCost: 0,
      hintCost: 0,
      nextExercise: null,
      previousExercise: null,
    };
  },
  computed: {
    sandbox() {
      return (
        (!this.$store.getters.getUserIsSubscribed && !this.isFree) ||
        !this.$store.getters.getIsLoggedIn
      );
    },
    courseDone() {
      if (!this.course?.Modules) {
        return false;
      }
      for (const mod of this.course.Modules) {
        if (!this.courseProgress) {
          return false;
        }
        if (!(mod.UUID in this.courseProgress)) {
          return false;
        }
        for (const exercise of mod.Exercises) {
          if (!this.courseProgress[mod.UUID][exercise.UUID]?.Completed) {
            return false;
          }
        }
      }
      return true;
    },
    forwardLink() {
      if (!this.nextExercise) return null;
      let exercise = this.nextExercise.Exercise;
      let forwardLink = {
        name: "Course",
        params: {
          courseUUID: exercise.CourseUUID,
          moduleUUID: exercise.ModuleUUID,
          exerciseUUID: exercise.UUID,
        },
      };
      return forwardLink;
    },
    backLink() {
      if (!this.previousExercise) return null;
      let exercise = this.previousExercise.Exercise;
      let backLink = {
        name: "Course",
        params: {
          courseUUID: exercise.CourseUUID,
          moduleUUID: exercise.ModuleUUID,
          exerciseUUID: exercise.UUID,
        },
      };
      return backLink;
    },
    isLoggedIn() {
      return this.$store.getters.getIsLoggedIn;
    },
    percentComplete() {
      if (!this.courseProgress) {
        return 0;
      }
      let complete = 0;
      let total = 0;
      for (const exercise in this.courseProgress[this.module?.UUID]) {
        if (this.courseProgress[this.module?.UUID][exercise].Completed) {
          complete++;
          total++;
        } else {
          total++;
        }
      }
      return (complete / total) * 100;
    },
    dropdownModules() {
      return this.course?.Modules?.map((mod, i) => {
        let isChapterComplete = false;
        if (this.courseProgress && mod.UUID in this.courseProgress) {
          for (const exercise of mod.Exercises) {
            if (!this.courseProgress[mod.UUID][exercise.UUID]?.Completed) {
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
              courseUUID: this.$route.params.courseUUID,
              moduleUUID: mod.UUID,
            },
          },
        };
      });
    },
    dropdownExercises() {
      return this.exercises?.map((ex, i) => {
        let isExerciseComplete = false;
        if (
          this.courseProgress &&
          this.module.UUID in this.courseProgress &&
          ex.UUID in this.courseProgress[this.module?.UUID] &&
          this.courseProgress[this.module?.UUID][ex.UUID].Completed
        ) {
          isExerciseComplete = true;
        }
        return {
          name: `Exercise ${i + 1} of ${this.exercises.length}`,
          color: isExerciseComplete ? "gold" : null,
          link: {
            name: "Course",
            params: {
              courseUUID: this.$route.params.courseUUID,
              moduleUUID: this.module.UUID,
              exerciseUUID: ex.UUID,
            },
          },
        };
      });
    },
    isContentLoaded() {
      if (this.markdownSource === "") {
        return false;
      }
      if (
        this.$store.getters.getIsLoggedIn &&
        this.achievementsToShow === null
      ) {
        return false;
      }
      return true;
    },
    exerciseIndex() {
      if (!this.module) {
        return null;
      }
      if (!this.module.Exercises) {
        return null;
      }
      let count = 0;
      for (const exercise of this.module.Exercises) {
        if (exercise.UUID === this.$route.params.exerciseUUID) {
          return count;
        }
        count++;
      }
      return null;
    },
    exercises() {
      if (!this.module) {
        return null;
      }
      return this.module.Exercises;
    },
    module() {
      if (!this.course || !this.course.Modules) {
        return null;
      }
      for (const mod of this.course.Modules) {
        if (mod.UUID === this.$route.params.moduleUUID) {
          return mod;
        }
      }
      return null;
    },
    moduleIndex() {
      if (!this.course || !this.course.Modules) {
        return null;
      }
      let index = 0;
      for (const mod of this.course.Modules) {
        if (mod.UUID === this.$route.params.moduleUUID) {
          return index;
        }
        index++;
      }
      return null;
    },
    course() {
      if (!this.courses) {
        return null;
      }
      for (const course of this.courses) {
        if (course.UUID === this.$route.params.courseUUID) {
          return course;
        }
      }
      return null;
    },
  },
  async mounted() {
    try {
      this.courses = await getCourses(this.$route.params.courseUUID);
    } catch (err) {
      notify({
        type: "danger",
        text: err,
      });
    }

    try {
      this.nextExercise = await getNextExercise(
        this.$route.params.courseUUID,
        this.$route.params.exerciseUUID
      );
    } catch (err) {
      // ignore toast error
    }
    try {
      this.previousExercise = await getPreviousExercise(
        this.$route.params.courseUUID,
        this.$route.params.exerciseUUID
      );
    } catch (err) {
      // ignore toast error
    }

    if (this.$route.params.moduleUUID && this.$route.params.exerciseUUID) {
      const exercise = await getExerciseByID(
        this.$route.params.courseUUID,
        this.$route.params.exerciseUUID
      );
      this.loadExercise(exercise);
      this.getUnitProgressIfLoggedIn();

      await this.getCourseProgressIfLoggedIn();
      if (this.courseDone) {
        this.$refs.courseDoneModal.show();
        eventFinishCourse(this.course.Title, false);
      }

      if (this.$store.getters.getIsLoggedIn) {
        try {
          this.achievementsToShow = await getPendingAchievements();
        } catch (err) {
          notify({
            type: "danger",
            text: err,
          });
        }
        this.loadHintStatus();
        this.loadCheatStatus();
      }
      return;
    }

    if (this.$route.params.moduleUUID) {
      const exercise = await getFirstExerciseInModule(
        this.$route.params.courseUUID,
        this.$route.params.moduleUUID
      );
      this.navToExercise(exercise, true);
      return;
    }

    await this.navToCurrentExercise();
  },
  methods: {
    async doneWithExercise() {
      try {
        await this.submitTypeInfo();
        const nextExercise = await getNextExercise(
          this.$route.params.courseUUID,
          this.$route.params.exerciseUUID
        );
        this.navToExercise(nextExercise, false);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async loadHintStatus() {
      try {
        const hintResp = await getHintStatus(this.$route.params.exerciseUUID);
        this.isHintPurchased = hintResp.PurchasedAt !== null;
        this.hintCost = hintResp.HintCost;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },

    async loadCheatStatus() {
      try {
        const cheatResp = await getCheatStatus(this.$route.params.exerciseUUID);
        this.isCheatPurchased = cheatResp.PurchasedAt !== null;
        this.cheatCost = cheatResp.CheatCost;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async onSeenAchievement() {
      this.achievementsToShow.shift();
    },
    showSandboxModeModal() {
      eventOpenSandboxModeModal();
      this.$refs.sandboxModeModal.show();
    },
    showFeedbackModal() {
      this.$refs.feedbackModal.show();
    },
    async hintCallback() {
      if (!this.$store.getters.getIsLoggedIn) {
        return;
      }
      if (!this.isHintPurchased) {
        await purchaseHint(this.$route.params.exerciseUUID);
        loadBalance(this);
        await this.loadHintStatus();
      }
    },
    async cheatCallback() {
      if (!this.$store.getters.getIsLoggedIn) {
        return;
      }
      if (!this.isCheatPurchased) {
        await purchaseCheat(this.$route.params.exerciseUUID);
        loadBalance(this);
        await this.loadCheatStatus();
      }
      this.isCheating = !this.isCheating;
      if (this.isCheating) {
        eventClickCheat(this.$route.params.exerciseUUID, this.course.Title);
      }
    },
    resetCode() {
      this.code = this.defaultCode;
      deleteCachedCode(this.$route.params.exerciseUUID);
    },
    async submitTypeInfo() {
      const submitResponse = await submitInformationalExercise(
        this.$route.params.exerciseUUID
      );
      await this.handleSuccess(submitResponse);
    },
    async handleSuccess(submitResponse) {
      eventExerciseSuccess(
        this.$route.params.exerciseUUID,
        this.course.Title,
        this.exerciseIndex,
        this.moduleIndex
      );
      if (this.type !== "type_info") {
        if (submitResponse.GemsEarned && submitResponse.GemsEarned > 0) {
          notify({
            type: "success",
            text: `Correct! You unlocked ${submitResponse.GemsEarned} gems 💎`,
          });
          await loadBalance(this);
        } else {
          notify({
            type: "success",
            text: "Correct! Great Job",
          });
        }
      }
      this.getUnitProgressIfLoggedIn();
      this.getCourseProgressIfLoggedIn();
    },
    async getCourseProgressIfLoggedIn() {
      if (!this.$store.getters.getIsLoggedIn) {
        return;
      }
      try {
        this.courseProgress = await getCourseProgress(
          this.$route.params.courseUUID
        );
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async getUnitProgressIfLoggedIn() {
      if (!this.$store.getters.getIsLoggedIn) {
        return;
      }
      try {
        this.unitProgress = await getUnitsProgress();
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async verifyCode({ output }) {
      try {
        const submitResponse = await submitCodeExercise(
          this.$route.params.exerciseUUID,
          output
        );
        await this.handleSuccess(submitResponse);
      } catch (err) {
        eventExerciseFailure(
          this.$route.params.exerciseUUID,
          this.course.Title,
          this.exerciseIndex,
          this.moduleInde
        );
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async verifyHash({ hash }) {
      try {
        const submitResponse = await submitCodeCanvasExercise(
          this.$route.params.exerciseUUID,
          hash
        );
        await this.handleSuccess(submitResponse);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async submitTypeCode({ output }) {
      cacheExerciseCode(this.$route.params.exerciseUUID, this.code);
      eventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.sandbox) {
        this.showSandboxModeModal();
        return;
      }
      this.verifyCode({ output });
    },
    async submitTypeCodeCanvas({ hash }) {
      cacheExerciseCode(this.$route.params.exerciseUUID, this.code);
      eventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.sandbox) {
        this.showSandboxModeModal();
        return;
      }
      this.verifyHash({ hash });
    },
    async submitTypeChoice(answer) {
      eventSubmitMultipleChoice(
        this.$route.params.exerciseUUID,
        this.course.Title
      );
      try {
        const submitResponse = await submitMultipleChoiceExercise(
          this.$route.params.exerciseUUID,
          answer
        );
        await this.handleSuccess(submitResponse);
      } catch (err) {
        eventExerciseFailure(
          this.$route.params.exerciseUUID,
          this.course.Title
        );
        notify({
          type: "danger",
          text: err,
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
    navToExercise(exercise, replace) {
      this.$router.push({
        name: "Course",
        replace: replace,
        params: {
          courseUUID: exercise.Exercise.CourseUUID,
          moduleUUID: exercise.Exercise.ModuleUUID,
          exerciseUUID: exercise.Exercise.UUID,
        },
      });
    },
    async loadExercise(exercise) {
      this.isFree = exercise.Exercise.IsFree;
      this.isFirstExercise = exercise.Exercise.IsFirst;
      this.isLastExercise = exercise.Exercise.IsLast;
      this.isCheating = false;

      if (exercise.Exercise.Readme !== this.markdownSource) {
        this.scrollMarkdownToTop();
      }

      this.markdownSource = exercise.Exercise.Readme;
      this.hintMarkdownSource = exercise.Exercise.HintMarkdown;
      this.type = exercise.Exercise.Type;
      this.$store.commit("setCurrentModuleUUID", this.$route.params.moduleUUID);

      if (this.type === "type_code") {
        this.code = exercise.Exercise.Code;
        this.complete = exercise.Exercise.Complete;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (this.type === "type_code_canvas") {
        this.code = exercise.Exercise.Code;
        this.complete = exercise.Exercise.Complete;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (this.type === "type_choice") {
        this.question = exercise.Exercise.Question;
      }
      if (hasCachedCode(this.$route.params.exerciseUUID)) {
        this.code = hasCachedCode(this.$route.params.exerciseUUID);
      }
    },
    async navToCurrentExercise() {
      try {
        const exercise = await getCurrentExercise(
          this.$route.params.courseUUID
        );
        this.navToExercise(exercise, true);
      } catch (err) {
        // this probably happens because course is complete
        const exercise = await getFirstExercise(this.$route.params.courseUUID);
        this.navToExercise(exercise, true);
      }
    },
    async goToBeginning() {
      try {
        const exercise = await getFirstExercise(this.$route.params.courseUUID);
        this.navToExercise(exercise, true);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
  },
};
</script>

<style scoped></style>
