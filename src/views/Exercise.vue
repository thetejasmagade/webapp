<template>
  <div class="h-full">
    <ProModal ref="proModal" />
    <FeedbackModal
      v-if="$route.params.exerciseUUID"
      ref="feedbackModal"
      :uuid="$route.params.exerciseUUID"
      unit-type="exercise"
    />
    <PricingModal ref="pricingModal" />
    <CourseDoneModal
      ref="courseDoneModal"
      :go-to-beginning-callback="goToBeginning"
    />

    <ExerciseSkeleton v-if="!isContentLoaded" />
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
        :dropdown-one-items="course.Modules.map((mod, i) => {
          return {
            name: `${i+1}. ${mod.Title}`,
            link: {
              name: 'Exercise',
              params: {
                courseUUID: $route.params.courseUUID,
                moduleUUID: mod.UUID
              }
            }
          }
        })"
        :dropdown-two-items="exercises.map((ex, i) => {
          return {
            name: `${i+1}/${exercises.length}`,
            link: {
              name: 'Exercise',
              params: {
                courseUUID: $route.params.courseUUID,
                moduleUUID: module.UUID,
                exerciseUUID: ex.UUID
              }
            }
          }
        })"
        :dropdown-one-index="moduleIndex"
        :dropdown-two-index="exerciseIndex"
        :go-back="goBack"
        :go-forward="goForward"
        :can-go-back="!isFirstExercise"
        :can-go-forward="!isLastExercise || courseDone"
        :is-complete="isComplete"
        :locked="locked"
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
        :locked="locked"
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
        :upgrade-callback="locked ? upgradeClick : null"
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
        :upgrade-callback="locked ? upgradeClick : null"
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
</template>

<script>
import CourseDoneModal from '@/components/CourseDoneModal.vue';
import ExerciseNav from '@/components/ExerciseNav.vue';
import Section from '@/components/Section.vue';
import ProModal from '@/components/ProModal.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';
import PricingModal from '@/components/PricingModal.vue';
import ExerciseSkeleton from '@/components/ExerciseSkeleton.vue';
import CardExerciseTypeInfo from '@/components/cards/CardExerciseTypeInfo.vue';
import CardExerciseTypeMultipleChoice from '@/components/cards/CardExerciseTypeMultipleChoice.vue';
import CardExerciseTypeCode from '@/components/cards/CardExerciseTypeCode.vue';
import CardExerciseTypeCodeCanvas from '@/components/cards/CardExerciseTypeCodeCanvas.vue';

import { loadBalance, loadUser } from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import { sleep } from '@/lib/sleep.js';

import {
  eventEarnGems,
  eventUnlockAchievement,
  eventFinishCourse,
  eventExecuteCode,
  eventExerciseFailure,
  eventExerciseSuccess,
  eventSubmitMultipleChoice,
  eventClickCheat,
  eventClickExerciseNavigation,
  eventOpenProModal
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
  getExerciseByID
} from '@/lib/cloudClient.js';

import {
  saveUnsubscribedProgress,
  loadUnsubscribedProgress
} from '@/lib/localStorageLib';

export default {
  components: {
    CourseDoneModal,
    Section,
    CardExerciseTypeInfo,
    ExerciseNav,
    ProModal,
    FeedbackModal,
    PricingModal,
    ExerciseSkeleton,
    CardExerciseTypeMultipleChoice,
    CardExerciseTypeCode,
    CardExerciseTypeCodeCanvas
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
      isCurrentExercise: false,
      code: '',
      complete: '',
      defaultCode: '',
      courses: null,
      isComplete: null,
      isFree: null,
      isCheating: false
    };
  },
  computed: {
    locked() {
      if (
        this.$store.getters.getUserIsSubscribed === null ||
        this.isFree === null
      ) {
        return null;
      }
      return !this.$store.getters.getUserIsSubscribed && !this.isFree;
    },
    isContentLoaded() {
      return this.markdownSource === '' ? false : true;
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
    this.courses = await getCourses(this.$route.params.courseUUID);

    if (this.$route.params.moduleUUID && this.$route.params.exerciseUUID) {
      const exercise = await getExerciseByID(
        this.$route.params.courseUUID,
        this.$route.params.exerciseUUID
      );
      this.moveToExercise(exercise);
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

    if (!this.$store.getters.getUser) {
      await loadUser(this);
    }

    if (!this.$store.getters.getUserIsSubscribed) {
      try {
        const exerciseUUID = await loadUnsubscribedProgress(
          this.$route.params.courseUUID
        );
        const exercise = await getExerciseByID(
          this.$route.params.courseUUID,
          exerciseUUID
        );
        this.navToExercise(exercise);
        return;
      } catch (err) {
        console.log(err);
      }
    }
    await this.navToCurrentExercise();
  },
  methods: {
    showPricingModal() {
      eventOpenProModal();
      this.$refs.pricingModal.show();
    },
    showFeedbackModal() {
      this.$refs.feedbackModal.show();
    },
    upgradeClick() {
      this.$router.push({ name: 'Pricing' });
    },
    cheatClick() {
      if (this.locked) {
        this.$refs.proModal.show();
        return;
      }
      this.isCheating = !this.isCheating;
      if (this.isCheating){
        eventClickCheat(this.$route.params.exerciseUUID, this.course.Title);
      }
    },
    resetCode() {
      this.code = this.defaultCode;
    },
    async submitTypeInfo() {
      await submitInformationalExercise(this.$route.params.exerciseUUID);
      this.isComplete = true;
    },
    async handleRewards(rewardsResponse) {
      if (rewardsResponse.CourseDone) {
        if (!this.courseDone) {
          eventFinishCourse(this.course.Title, false);
        }
        this.courseDone = true;
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
          text: 'Correct! Great Job :)'
        });
      }
    },
    async verifyCode({ output }) {
      try {
        const rewardsResponse = await submitCodeExercise(
          this.$route.params.exerciseUUID,
          output
        );
        eventExerciseSuccess(this.$route.params.exerciseUUID, this.course.Title, this.exerciseIndex, this.moduleIndex);
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
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
        const rewardsResponse = await submitCodeCanvasExercise(
          this.$route.params.exerciseUUID,
          hash
        );
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    },
    async submitTypeCode({ output }) {
      eventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.locked) {
        return;
      }
      this.verifyCode({ output });
    },
    async submitTypeCodeCanvas({ hash }) {
      eventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.locked) {
        return;
      }
      this.verifyHash({ hash });
    },
    async submitTypeChoice(answer) {
      eventSubmitMultipleChoice(this.$route.params.exerciseUUID, this.course.Title);
      try {
        const rewardsResponse = await submitMultipleChoiceExercise(
          this.$route.params.exerciseUUID,
          answer
        );
        eventExerciseSuccess(this.$route.params.exerciseUUID, this.course.Title);
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
        await sleep(1500);
        if (
          this.isCurrentExercise ||
          !this.$store.getters.getUserIsSubscribed
        ) {
          await this.navToCurrentExercise();
        }
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
        name: 'Exercise',
        params: {
          courseUUID: exercise.Exercise.CourseUUID,
          moduleUUID: exercise.Exercise.ModuleUUID,
          exerciseUUID: exercise.Exercise.UUID
        }
      });
    },
    async moveToExercise(exercise) {
      // should probably get "6" from server
      if (
        this.exerciseIndex === 0 &&
        this.moduleIndex === 1 &&
        !this.$store.getters.getUserIsSubscribed
      ) {
        this.showPricingModal();
      }

      if (exercise.CourseDone) {
        this.courseDone = true;
      }

      saveUnsubscribedProgress(
        this.$route.params.courseUUID,
        exercise.Exercise.UUID
      );
      this.isFree = exercise.Exercise.IsFree;
      this.isFirstExercise = exercise.Exercise.IsFirst;
      this.isLastExercise = exercise.Exercise.IsLast;
      this.isCurrentExercise = exercise.IsCurrent;
      this.isComplete = exercise.IsComplete;
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
      if (this.type === 'type_info' && !this.isComplete) {
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
