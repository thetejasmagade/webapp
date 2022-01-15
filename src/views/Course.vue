<template>
  <ViewNavWrapper>
    <div class="h-full">
      <FeedbackModal
        v-if="$route.params.exerciseUUID"
        ref="feedbackModal"
        :uuid="$route.params.exerciseUUID"
        unit-type="exercise"
      />
      <SandboxModeModal ref="sandboxModeModal" />
      <CourseDoneModal
        ref="courseDoneModal"
        :go-to-beginning-callback="goToBeginning"
      />

      <AchievementUnlocked
        v-if="achievementsToShow?.length > 0"
        :achievement-earned="achievementsToShow[0]"
        :on-done="onSeenAchievement"
      />
      <ExerciseSkeleton v-else-if="!isContentLoaded" />
      <div
        v-else
        class="
          h-full
          hidden
          flex-col
          sm:flex
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
          :dropdown-one-items="dropdownModules"
          :dropdown-two-items="dropdownExercises"
          :dropdown-one-index="moduleIndex"
          :dropdown-two-index="exerciseIndex"
          :go-back="goBack"
          :go-forward="goForward"
          :can-go-back="!isFirstExercise"
          :can-go-forward="!isLastExercise || courseDone"
          :sandbox="sandbox"
          :click-comment="() => showFeedbackModal()"
        />
        <CardExerciseTypeInfo
          v-if="type === 'type_info'"
          :markdown-source="markdownSource"
        />
        <CardExerciseTypeMultipleChoice
          v-else-if="type === 'type_choice'"
          :markdown-source="markdownSource"
          :answers="question.Answers"
          :question="question.Question"
          :sandbox="sandbox"
          :callback="submitTypeChoice"
        />
        <CardExerciseTypeCode
          v-else-if="type === 'type_code'"
          v-model="code"
          :markdown-source="markdownSource"
          :prog-lang="progLang"
          :solution-code="complete"
          :run-callback="submitTypeCode"
          :reset-code-callback="resetCode"
          :cheat-callback="cheatClick"
          :is-cheating="isCheating"
        />
        <CardExerciseTypeCodeCanvas
          v-else-if="type === 'type_code_canvas'"
          v-model="code"
          :markdown-source="markdownSource"
          :prog-lang="progLang"
          :solution-code="complete"
          :run-callback="submitTypeCodeCanvas"
          :reset-code-callback="resetCode"
          :cheat-callback="cheatClick"
          :is-cheating="isCheating"
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
import Section from '@/components/Section.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';
import SandboxModeModal from '@/components/SandboxModeModal.vue';
import ExerciseSkeleton from '@/components/ExerciseSkeleton.vue';
import CardExerciseTypeInfo from '@/components/cards/CardExerciseTypeInfo.vue';
import CardExerciseTypeMultipleChoice from '@/components/cards/CardExerciseTypeMultipleChoice.vue';
import CardExerciseTypeCode from '@/components/cards/CardExerciseTypeCode.vue';
import CardExerciseTypeCodeCanvas from '@/components/cards/CardExerciseTypeCodeCanvas.vue';
import AchievementUnlocked from '@/components/AchievementUnlocked.vue';

import { loadBalance } from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import {
  eventFinishCourse,
  eventExecuteCode,
  eventExerciseFailure,
  eventExerciseSuccess,
  eventSubmitMultipleChoice,
  eventClickCheat,
  eventClickExerciseNavigation,
  eventOpenSandboxModeModal
} from '@/lib/analytics.js';

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
  getPendingAchievements
} from '@/lib/cloudClient.js';

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
    AchievementUnlocked
  },
  data() {
    return {
      markdownSource: '',
      type: '',
      question: {},
      progLang: 'go',
      courseDone: false,
      isFirstExercise: false,
      isLastExercise: false,
      code: '',
      complete: '',
      defaultCode: '',
      courses: null,
      isFree: null,
      isCheating: false,
      achievementsToShow: null,
      courseProgress: null
    };
  },
  computed: {
    sandbox() {
      return (!this.$store.getters.getUserIsSubscribed && !this.isFree) || !this.$store.getters.getIsLoggedIn;
    },
    dropdownModules() {
      return this.course?.Modules?.map((mod, i) => {
        let isChapterComplete = false; 
        if (this.courseProgress 
        && mod.UUID in this.courseProgress){
          for (const exercise of mod.Exercises){  
            if (!this.courseProgress[mod.UUID][exercise.UUID]?.Completed){
              isChapterComplete = false;
              break;
            }
            isChapterComplete = true;
          }
        }
        return {
          name: `Chapter ${i+1}: ${mod.Title}`,
          color: isChapterComplete ? 'gold' : null,
          link: {
            name: 'Course',
            params: {
              courseUUID: this.$route.params.courseUUID,
              moduleUUID: mod.UUID
            }
          }
        };
      });
    },
    dropdownExercises(){
      return this.exercises?.map((ex, i) => {
        let isExerciseComplete = false;
        if (this.courseProgress 
        && this.module.UUID in this.courseProgress
        && ex.UUID in this.courseProgress[this.module?.UUID]
        && this.courseProgress[this.module?.UUID][ex.UUID].Completed) {
          isExerciseComplete = true;
        }
        return {
          name: `Exercise ${i+1} of ${this.exercises.length}`,
          color: isExerciseComplete ? 'gold' : null,
          link: {
            name: 'Course',
            params: {
              courseUUID: this.$route.params.courseUUID,
              moduleUUID: this.module.UUID,
              exerciseUUID: ex.UUID
            }
          }
        };
      });
    },
    isContentLoaded() {
      if (this.markdownSource === ''){
        return false;
      }
      if (this.$store.getters.getIsLoggedIn && this.achievementsToShow === null){
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
    }
  },
  async mounted() {
    try {
      this.courses = await getCourses(this.$route.params.courseUUID);
    } catch(err) {
      notify({
        type: 'danger',
        text: err
      });
    }

    if (this.$route.params.moduleUUID && this.$route.params.exerciseUUID) {
      const exercise = await getExerciseByID(
        this.$route.params.courseUUID,
        this.$route.params.exerciseUUID
      );
      this.loadExercise(exercise);
      this.getCourseProgressIfLoggedIn();
      
      if (this.$store.getters.getIsLoggedIn){
        try {
          this.achievementsToShow = await getPendingAchievements();
        }
        catch (err) {
          notify({
            type: 'danger',
            text: err
          });
        }
      }
      return;
    }

    if (this.$route.params.moduleUUID) {
      const exercise = await getFirstExerciseInModule(
        this.$route.params.courseUUID,
        this.$route.params.moduleUUID
      );
      this.navToExercise(exercise);
      return;
    }

    await this.navToCurrentExercise();
  },
  methods: {
    async onSeenAchievement(){
      this.achievementsToShow.shift();
      await loadBalance(this);
    },
    sandboxModeModal() {
      eventOpenSandboxModeModal();
      this.$refs.sandboxModeModal.show();
    },
    showFeedbackModal() {
      this.$refs.feedbackModal.show();
    },
    cheatClick() {
      this.isCheating = !this.isCheating;
      if (this.isCheating){
        eventClickCheat(this.$route.params.exerciseUUID, this.course.Title);
      }
    },
    resetCode() {
      this.code = this.defaultCode;
    },
    async submitTypeInfo() {
      const submitResponse = await submitInformationalExercise(this.$route.params.exerciseUUID);
      await this.handleSuccess(submitResponse);
    },
    async handleSuccess(submitResponse) {
      eventExerciseSuccess(this.$route.params.exerciseUUID, this.course.Title, this.exerciseIndex, this.moduleIndex);
      if (submitResponse.CourseDone) {
        if (!this.courseDone) {
          eventFinishCourse(this.course.Title, false);
        }
        this.courseDone = true;
      }
      if (this.type !== 'type_info') {
        notify({
          type: 'success',
          text: 'Correct! Great Job'
        });
      }
      this.getCourseProgressIfLoggedIn();
    },
    async getCourseProgressIfLoggedIn(){
      if (!this.$store.getters.getIsLoggedIn){
        return;
      }
      try {
        this.courseProgress = await getCourseProgress(this.$route.params.courseUUID);
      } catch(err) {
        notify({
          type: 'danger',
          text: err
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
        eventExerciseFailure(this.$route.params.exerciseUUID, this.course.Title, this.exerciseIndex, this.moduleInde);
        notify({
          type: 'danger',
          text: err
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
          type: 'danger',
          text: err
        });
      }
    },
    async submitTypeCode({ output }) {
      eventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.sandbox) {
        return;
      }
      this.verifyCode({ output });
    },
    async submitTypeCodeCanvas({ hash }) {
      eventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.sandbox) {
        return;
      }
      this.verifyHash({ hash });
    },
    async submitTypeChoice(answer) {
      eventSubmitMultipleChoice(this.$route.params.exerciseUUID, this.course.Title);
      try {
        const submitResponse = await submitMultipleChoiceExercise(
          this.$route.params.exerciseUUID,
          answer
        );
        await this.handleSuccess(submitResponse);
      } catch (err) {
        eventExerciseFailure(this.$route.params.exerciseUUID, this.course.Title);
        notify({
          type: 'danger',
          text: err
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
    navToExercise(exercise) {
      this.$router.push({
        name: 'Course',
        params: {
          courseUUID: exercise.Exercise.CourseUUID,
          moduleUUID: exercise.Exercise.ModuleUUID,
          exerciseUUID: exercise.Exercise.UUID
        }
      });
    },
    async loadExercise(exercise) {
      if (
        this.exerciseIndex === 0 &&
        this.moduleIndex === 1 &&
        this.sandbox
      ) {
        this.sandboxModeModal();
      }

      if (exercise.CourseDone) {
        this.courseDone = true;
      }

      this.isFree = exercise.Exercise.IsFree;
      this.isFirstExercise = exercise.Exercise.IsFirst;
      this.isLastExercise = exercise.Exercise.IsLast;
      this.isCheating = false;

      if (exercise.Exercise.Readme !== this.markdownSource) {
        this.scrollMarkdownToTop();
      }

      this.markdownSource = exercise.Exercise.Readme;
      this.type = exercise.Exercise.Type;
      this.$store.commit('setCurrentModuleUUID', this.$route.params.moduleUUID);

      if (this.type === 'type_code') {
        this.code = exercise.Exercise.Code;
        this.complete = exercise.Exercise.Complete;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (this.type === 'type_code_canvas') {
        this.code = exercise.Exercise.Code;
        this.complete = exercise.Exercise.Complete;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (this.type === 'type_choice') {
        this.question = exercise.Exercise.Question;
      }
    },
    async navToCurrentExercise() {
      try {
        const exercise = await getCurrentExercise(
          this.$route.params.courseUUID
        );
        this.navToExercise(exercise);
      } catch (err) {
        // this probably happens because course is complete
        const exercise = await getFirstExercise(this.$route.params.courseUUID);
        this.navToExercise(exercise);
      }
    },
    async goBack() {
      eventClickExerciseNavigation(this.$route.params.exerciseUUID, this.course.Title);
      try {
        const exercise = await getPreviousExercise(
          this.$route.params.courseUUID,
          this.$route.params.exerciseUUID
        );
        this.navToExercise(exercise);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async goForward() {
      eventClickExerciseNavigation(this.$route.params.exerciseUUID, this.course.Title);
      if (this.type === 'type_info') {
        await this.submitTypeInfo();
      }
      if (this.courseDone && this.isLastExercise) {
        this.$refs.courseDoneModal.show();
        return;
      }
      try {
        const exercise = await getNextExercise(
          this.$route.params.courseUUID,
          this.$route.params.exerciseUUID
        );
        this.navToExercise(exercise);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async goToBeginning() {
      try {
        const exercise = await getFirstExercise(this.$route.params.courseUUID);
        this.navToExercise(exercise);
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
