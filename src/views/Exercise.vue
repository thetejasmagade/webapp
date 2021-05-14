<template>
  <div class="exercise-root">
    <CourseCompleted
      v-if="courseDone"
      class="full"
      :restart-callback="goToBeginning"
    />
      
    <div
      v-else
      class="container desktop"
    >
      <Modal
        ref="pricingModal"
      >
        <div class="pricing-modal">
          <h1> Upgrade for continued access </h1>
          <p>
            If you want to continue to verify your answers and get credit for assignments,
            <b>you'll need to upgrade to a pro account.</b>
          </p>
          <p>
            That said, still feel free to continue the course in read-only mode, its free to audit!
          </p>
          <BlockButton
            class="btn"
            :click="() => {modalButtonClick()}"
            color="purple"
          >
            View Plans
          </BlockButton>
        </div>
      </Modal>

      <Multipane layout="horizontal">
        <div class="side left">
          <ExerciseNav
            class="nav"
            :title="modulePosition ? `${moduleTitleTruncated} - ${modulePosition}/${numExercisesInModule}`: null"
            :go-back="goBack"
            :go-forward="goForward"
            :can-go-back="!isFirstExercise"
            :can-go-forward="!isLastExercise"
            :exercise-is-complete="isComplete"
            :locked="locked"
            :click-solution="type === 'type_code' || type === 'type_code_canvas' ?
              () => {clickSolution()} : null
            "
          />

          <MarkdownViewer
            ref="viewer"
            class="markdown-viewer"
            :source="markdownSource"
          />
        </div>
        <MultipaneResizer />
        <div
          v-if="type === 'type_info'"
          id="info-container"
          class="side right"
        >
          <p> 👈 Read First </p>
          <BlockButton
            class="btn"
            :click="goForward"
          >
            Continue
          </BlockButton>
        </div>
        <CodeEditor
          v-else-if="type === 'type_code' || type === 'type_code_canvas'"
          v-model="code"
          class="side right"
          :run-callback="type === 'type_code' ? submitTypeCode : submitTypeCodeCanvas"
          :reset-callback="resetCode"
          :upgrade-callback="locked ? upgradeClick : null"
          :save-callback="saveCode"
          :load-callback="getSavedCode"
          :prog-lang="progLang"
          :canvas-enabled="type === 'type_code_canvas'"
        />
        <MultipleChoice
          v-else-if="type === 'type_choice'"
          class="side right"
          :callback="submitTypeChoice"
          :answers="question.Answers"
          :question="question.Question"
          :locked="locked"
        />
      </Multipane>
    </div>
    <div class="mobile">
      <Section
        title="Come back on a computer"
      >
        <p> Coding is hard to do on a phone. I want you to have a great experience, so please hurry back on a larger device. </p>
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
import CourseCompleted from '@/components/CourseCompleted.vue';
import ExerciseNav from '@/components/ExerciseNav.vue';
import Multipane from '@/components/Multipane.vue';
import MultipaneResizer from '@/components/MultipaneResizer.vue';
import Section from '@/components/Section.vue';

import { 
  loadBalance,
  loadUser
} from '@/lib/cloudStore.js';

import { 
  sleep
} from '@/lib/sleep.js';

import { 
  gtmEventEarnGems,
  gtmEventUnlockAchievement,
  gtmEventFinishCourse,
  gtmEventExecuteCode,
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
  saveCode,
  getSavedCode,
  getCourses,
  getFirstExerciseInModule,
  getExerciseByID
} from '@/lib/cloudClient.js';

import {
  saveUnsubscribedProgress,
  loadUnsubscribedProgress
} from '@/lib/localStorageLib';

export default {
  metaInfo() {
    const title = `${this.courseTitle} Course - Qvault`;
    return {
      title: title,
      meta: [
        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
  components: {
    Modal,
    Section,
    CodeEditor,
    MarkdownViewer,
    BlockButton,
    MultipleChoice,
    CourseCompleted,
    ExerciseNav,
    Multipane,
    MultipaneResizer
  },
  async beforeRouteUpdate (to, from, next) {
    this.courseUUID = to.params.courseUUID;
    this.courseDone = false;
    await this.getCurrentExercise();
    next();
  },
  data(){
    return {
      markdownSource: '',
      defaultMarkdownSource: '',
      type: '',
      courseUUID: this.$route.params.courseUUID,
      moduleUUID: null,
      exerciseUUID: null,
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
      isComplete: false,
      isFree: false
    };
  },
  computed: {
    locked(){
      return !this.$store.getters.getUserIsSubscribed && !this.isFree;
    },
    modulePosition(){
      if (!this.module){
        return null;
      }
      let count = 0;
      if (!this.module.Exercises){
        return null;
      }
      for (const exercise of this.module.Exercises){
        count++;
        if (exercise.UUID === this.exerciseUUID){
          return count;
        }
      }
      return null;
    },
    numExercisesInModule(){
      if (!this.module){
        return null;
      }
      if (this.module.Exercises){
        return this.module.Exercises.length;
      }
      return null;
    },
    module(){
      if (!this.course || !this.course.Modules){
        return null;
      }
      for (const mod of this.course.Modules){
        if (mod.UUID === this.moduleUUID){
          return mod;
        }
      }
      return null;
    },
    moduleTitleTruncated(){
      const maxLength = 15;
      if (this.module.Title > 5) {
        return this.module.Title.substring(0, maxLength) + '...';
      }
      return this.module.Title;
    },
    course(){
      if (!this.courses){
        return null;
      }
      for (const course of this.courses){
        if (course.UUID === this.courseUUID){
          return course;
        }
      }
      return null;
    },
    courseTitle(){
      if (this.course){
        return this.course.Title;
      }
      return null;
    },
    cheatedMarkdownSource(){
      return `## Full Solution

\`\`\`${this.progLang}
${this.complete}
\`\`\`

${this.defaultMarkdownSource}
`;
    }
  },
  async mounted(){
    this.courses = await getCourses(this.courseUUID);
    if (this.$route.params.moduleUUID){
      const exercise = await getFirstExerciseInModule(
        this.courseUUID,
        this.$route.params.moduleUUID
      );
      this.moveToExercise(exercise);
      return;
    }

    if (!this.$store.getters.getUser){
      await loadUser(this);
    }

    if (!this.$store.getters.getUserIsSubscribed){
      try{
        const exerciseUUID = await loadUnsubscribedProgress(this.courseUUID);
        const exercise = await getExerciseByID(
          this.courseUUID,
          exerciseUUID
        );
        this.moveToExercise(exercise);
        return;
      } catch (err){
        console.log(err);
        // do nothing
      }
    }
    await this.getCurrentExercise();
  },
  methods: {
    clickSolution(){
      if (this.locked){
        this.$proModal.show();
        return;
      }
      if (this.markdownSource === this.cheatedMarkdownSource){
        this.markdownSource = this.defaultMarkdownSource;
      } else {
        this.markdownSource = this.cheatedMarkdownSource;
      }
      this.scrollMarkdownToTop();
    },
    showModal(){
      gtmEventOpenProModal();
      this.$refs.pricingModal.show();
    },
    modalButtonClick(){
      this.$router.push({name: 'Pricing'});
      this.$refs.pricingModal.hide();
    },
    upgradeClick(){
      this.$router.push({name: 'Pricing'});
    },
    resetCode(){
      this.code = this.defaultCode;
    },
    async saveCode(){
      try{
        await saveCode(this.exerciseUUID, this.code);
        this.$notify({
          type: 'success',
          text: 'Code saved!'
        });
      } catch (err) {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t save code'
        });
      }
    },
    async getSavedCode(){
      try{
        const resp = await getSavedCode (this.exerciseUUID, this.code);
        if (resp.Code && resp.Code !== ''){
          this.code = resp.Code;
          this.$notify({
            type: 'success',
            text: 'Last save loaded!'
          });
          return;
        }
        this.$notify({
          type: 'error',
          text: 'No saved code found for this exercise'
        });
      } catch (err) {
        this.$notify({
          type: 'error',
          text: 'Couldn\'t load code'
        });
      }
    },
    async submitTypeInfo(){
      await submitInformationalExercise(
        this.exerciseUUID
      );
      this.isComplete = true;
    },
    async handleRewards(rewardsResponse){
      if ((rewardsResponse.GemCredit && rewardsResponse.Message) || 
        rewardsResponse.Achievements && rewardsResponse.Achievements.length > 0){
        loadBalance(this);
      }

      if (rewardsResponse.GemCredit){
        gtmEventEarnGems(rewardsResponse.GemCredit);
      }

      let notificationShown = false;
      if (rewardsResponse.GemCredit && rewardsResponse.Message){
        this.$notify({
          type: 'success',
          text: `${rewardsResponse.Message} 💎x${rewardsResponse.GemCredit}`
        });
        notificationShown = true;
      } 
      if (rewardsResponse.Achievements){
        for (const achievement of rewardsResponse.Achievements){
          if (achievement.GemReward){
            gtmEventEarnGems(achievement.GemReward);
          }
          if (achievement.UUID){
            gtmEventUnlockAchievement(achievement.UUID);
          }
          this.$notify({
            type: 'success',
            title: `<img width="50" src="${achievement.ImageURL}">`,
            text: `<i>${achievement.Title}</i> achievement unlocked! 💎x${achievement.GemReward}`
          });
          notificationShown = true;
        }
      }
      if (!notificationShown) {
        this.$notify({
          type: 'success',
          text: 'Correct! Great Job :)'
        });
      }
    },
    async verifyCode({output}){
      try {
        const rewardsResponse = await submitCodeExercise(
          this.exerciseUUID,
          output
        );
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
        await sleep(1500);
        if (this.isCurrentExercise || !this.$store.getters.getUserIsSubscribed){
          await this.getCurrentExercise();
        }
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async verifyHash({hash}){
      try {
        const rewardsResponse = await submitCodeCanvasExercise(
          this.exerciseUUID,
          hash
        );
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
        await sleep(1500);
        if (this.isCurrentExercise || !this.$store.getters.getUserIsSubscribed){
          await this.getCurrentExercise();
        }
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async submitTypeCode({output}) {
      gtmEventExecuteCode(this.exerciseUUID, this.course.Title);
      if (this.locked){
        return;
      }
      this.verifyCode({output});
    },
    async submitTypeCodeCanvas({hash}) {
      gtmEventExecuteCode(this.exerciseUUID, this.course.Title);
      if (this.locked){
        return;
      }
      this.verifyHash({hash});
    },
    async submitTypeChoice(answer) {
      try {
        const rewardsResponse = await submitMultipleChoiceExercise(
          this.exerciseUUID,
          answer
        );
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
        await sleep(1500);
        if (this.isCurrentExercise || !this.$store.getters.getUserIsSubscribed){
          await this.getCurrentExercise();
        }
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    scrollMarkdownToTop() {
      requestAnimationFrame(() => {
        this.$refs.viewer.$el.scrollTop = 0;
      });
    },
    async moveToExercise(exercise){
      if (this.isFree && this.code && !exercise.Exercise.IsFree && !this.$store.getters.getUserIsSubscribed){
        this.showModal();
      }
      saveUnsubscribedProgress(this.courseUUID, exercise.Exercise.UUID);
      if (exercise.CourseDone){
        if (!this.courseDone){
          gtmEventFinishCourse(this.course.Title, false);
        }
        this.courseDone = true;
        this.handleRewards(exercise.Rewards);
        return;
      }
      this.courseDone = false;
      this.isFree = exercise.Exercise.IsFree;
      this.isFirstExercise = exercise.Exercise.IsFirst;
      this.isLastExercise = exercise.Exercise.IsLast;
      this.isCurrentExercise = exercise.IsCurrent;
      this.isComplete = exercise.IsComplete;

      if (exercise.Exercise.Readme !== this.markdownSource){
        this.scrollMarkdownToTop();
      }

      this.markdownSource = exercise.Exercise.Readme;
      this.defaultMarkdownSource = exercise.Exercise.Readme;
      this.type = exercise.Exercise.Type;
      this.moduleUUID = exercise.Exercise.ModuleUUID;
      this.$store.commit('setCurrentModuleUUID', this.moduleUUID);
      this.exerciseUUID = exercise.Exercise.UUID;

      if (this.type === 'type_code'){
        this.code = exercise.Exercise.Code;
        this.complete = exercise.Exercise.Complete;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (this.type === 'type_code_canvas'){
        this.code = exercise.Exercise.Code;
        this.complete = exercise.Exercise.Complete;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (this.type === 'type_choice'){
        this.question = exercise.Exercise.Question;
      }
    },
    async getCurrentExercise(){
      try {
        const exercise = await getCurrentExercise(this.courseUUID);
        this.moveToExercise(exercise);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async goBack(){
      try {
        const exercise = await getPreviousExercise(this.courseUUID, this.exerciseUUID);
        this.moveToExercise(exercise);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async goForward(){
      if (this.type === 'type_info' && !this.isComplete){
        await this.submitTypeInfo();
      }
      try {
        const exercise = await getNextExercise(this.courseUUID, this.exerciseUUID);
        this.moveToExercise(exercise);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async goToBeginning(){
      try {
        const exercise = await getFirstExercise(this.courseUUID);
        this.moveToExercise(exercise);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

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

.container {
  display: flex;
  height: calc(100vh - #{$bar-height});
}

.full {
  padding-top: 20px;
}

.side {
  height: 100%;
  overflow: auto;
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
  border-bottom: solid 1px $gray-light;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
}
</style>
