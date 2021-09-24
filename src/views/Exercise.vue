<template>
  <div class="exercise-root">
    <ProModal ref="proModal" />
    <FeedbackModal
      v-if="$route.params.exerciseUUID"
      ref="feedbackModal"
      :exercise-u-u-i-d="$route.params.exerciseUUID"
    />
    <Modal ref="pricingModal">
      <div>
        <h1 class="text-2xl text-gold-600 mb-4">
          Upgrade for continued pro access
        </h1>
        <p class="text-gray-600 mb-4">
          If you want to continue to verify your answers and get credit for
          assignments,
          <b>you'll need to upgrade to a pro account.</b>
        </p>
        <p class="text-gray-600 mb-4">
          That said, click outside this pop-up to continue the course in
          read-only mode, its free to audit!
        </p>
        <BlockButton
          class="btn"
          :click="
            () => {
              modalButtonClick();
            }
          "
        >
          View Plans
        </BlockButton>
      </div>
    </Modal>
    <Modal ref="courseDoneModal">
      <div>
        <h1 class="text-2xl text-gold-600 mb-4">
          Congragulations! You've completed the course
        </h1>
        <p class="text-gray-600 mb-4">
          Check out the new certificate on your portfolio then start your next
          course
        </p>
        <img
          src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
        >
        <div class="flex justify-center">
          <BlockButton
            class="m-4"
            :click="clickNextCourse"
          >
            Next Course
          </BlockButton>
          <BlockButton
            class="m-4"
            :click="
              () => {
                $router.push({
                  name: 'Portfolio',
                  params: { userHandle: $store.getters.getUser.Handle },
                });
              }
            "
            color="gray"
          >
            View Portfolio
          </BlockButton>
          <BlockButton
            class="m-4"
            :click="goToBeginning"
            color="gray"
          >
            Restart
          </BlockButton>
        </div>
      </div>
    </Modal>

    <div class="exercise-container desktop">
      <Multipane layout="horizontal">
        <div class="side left">
          <ExerciseNav
            v-if="locked !== null"
            class="nav"
            :modules="course ? course.Modules : null"
            :exercises="exercises"
            :course-u-u-i-d="$route.params.courseUUID"
            :current-exercise-index="exerciseIndex"
            :current-module-index="moduleIndex"
            :go-back="goBack"
            :go-forward="goForward"
            :can-go-back="!isFirstExercise"
            :can-go-forward="!isLastExercise || courseDone"
            :is-complete="isComplete"
            :locked="locked"
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
          v-if="type === 'type_info'"
          id="info-container"
          class="side right"
        >
          <BlockButton
            class="btn"
            :click="goForward"
          >
            Continue
          </BlockButton>
        </div>
        <CodeEditor
          v-else-if="type === 'type_code' || type === 'type_code_canvas'"
          :key="isCheating"
          v-model="code"
          class="side right"
          :run-callback="
            type === 'type_code' ? submitTypeCode : submitTypeCodeCanvas
          "
          :reset-callback="resetCode"
          :upgrade-callback="locked ? upgradeClick : null"
          :cheat-callback="cheatClick"
          :prog-lang="progLang"
          :canvas-enabled="type === 'type_code_canvas'"
          :solution="complete"
          :is-cheating="isCheating"
        />
        <MultipleChoice
          v-else-if="type === 'type_choice'"
          class="
            side
            right
          "
          :callback="submitTypeChoice"
          :answers="question.Answers"
          :question="question.Question"
          :locked="locked"
        />
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
import Modal from '@/components/Modal.vue';
import MultipleChoice from '@/components/MultipleChoice.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import BlockButton from '@/components/BlockButton.vue';
import ExerciseNav from '@/components/ExerciseNav.vue';
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';
import Section from '@/components/Section.vue';
import ProModal from '@/components/ProModal.vue';
import FeedbackModal from '@/components/FeedbackModal.vue';

import { loadBalance, loadUser, loadProgramCS } from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

import { sleep } from '@/lib/sleep.js';

import {
  gtmEventEarnGems,
  gtmEventUnlockAchievement,
  gtmEventFinishCourse,
  gtmEventExecuteCode,
  gtmEventExerciseFailure,
  gtmEventExerciseSuccess,
  gtmEventSubmitMultipleChoice,
  gtmEventClickCheat,
  gtmEventClickExerciseNavigation,
  gtmEventOpenProModal
} from '@/lib/gtm.js';

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
    Modal,
    Section,
    CodeEditor,
    MarkdownViewer,
    BlockButton,
    MultipleChoice,
    ExerciseNav,
    Multipane,
    MultipaneResizer,
    ProModal,
    FeedbackModal
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
    courseTitle() {
      if (this.course) {
        return this.course.Title;
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
    async clickNextCourse() {
      await loadProgramCS(this);
      this.$router.push({ name: 'Courses' });
    },
    showPricingModal() {
      gtmEventOpenProModal();
      this.$refs.pricingModal.show();
    },
    showFeedbackModal() {
      this.$refs.feedbackModal.show();
    },
    modalButtonClick() {
      this.$router.push({ name: 'Pricing' });
      this.$refs.pricingModal.hide();
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
        gtmEventClickCheat(this.$route.params.exerciseUUID, this.course.Title);
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
          gtmEventFinishCourse(this.course.Title, false);
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
        gtmEventExerciseSuccess(this.$route.params.exerciseUUID, this.course.Title);
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
      } catch (err) {
        gtmEventExerciseFailure(this.$route.params.exerciseUUID, this.course.Title);
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
      gtmEventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.locked) {
        return;
      }
      this.verifyCode({ output });
    },
    async submitTypeCodeCanvas({ hash }) {
      gtmEventExecuteCode(this.$route.params.exerciseUUID, this.course.Title);
      if (this.locked) {
        return;
      }
      this.verifyHash({ hash });
    },
    async submitTypeChoice(answer) {
      gtmEventSubmitMultipleChoice(this.$route.params.exerciseUUID, this.course.Title);
      try {
        const rewardsResponse = await submitMultipleChoiceExercise(
          this.$route.params.exerciseUUID,
          answer
        );
        gtmEventExerciseSuccess(this.$route.params.exerciseUUID, this.course.Title);
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
        gtmEventExerciseFailure(this.$route.params.exerciseUUID, this.course.Title);
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
      gtmEventClickExerciseNavigation(this.$route.params.exerciseUUID, this.course.Title);
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
      gtmEventClickExerciseNavigation(this.$route.params.exerciseUUID, this.course.Title);
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

.full {
  padding-top: 20px;
}

.side {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $gray-lightest;
  color: $gray-darker;

  &.left {
    border-right: 2px solid $gray-dark;
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
