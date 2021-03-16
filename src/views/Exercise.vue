<template>
  <div class="exercise-root">
    <CourseCompleted
      v-if="courseDone"
      class="full"
      :restart-callback="goToBeginning"
    />
      
    <div
      v-else
      class="container"
    >
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
          />

          <MarkdownViewer
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
            :click="() => {submitTypeInfo()}"
          >
            Continue
          </BlockButton>
        </div>
        <CodeEditor
          v-else-if="type === 'type_code'"
          v-model="code"
          class="side right"
          :run-callback="submitTypeCode"
          :reset-callback="resetCode"
          :save-callback="saveCode"
          :load-callback="getSavedCode"
          :prog-lang="progLang"
        />
        <MultipleChoice
          v-else-if="type === 'type_choice'"
          class="side right"
          :callback="submitTypeChoice"
          :answers="question.Answers"
          :question="question.Question"
        />
      </Multipane>
    </div>
  </div>
</template>

<script>
import MultipleChoice from '@/components/MultipleChoice';
import MarkdownViewer from '@/components/MarkdownViewer';
import CodeEditor from '@/components/CodeEditor';
import BlockButton from '@/components/BlockButton';
import CourseCompleted from '@/components/CourseCompleted';
import ExerciseNav from '@/components/ExerciseNav';
import Multipane from '@/components/Multipane';
import MultipaneResizer from '@/components/MultipaneResizer';

import { 
  loadBalance
} from '@/lib/cloudStore.js';

import { 
  sleep
} from '@/lib/sleep.js';

import { 
  gtmEventEarnGems,
  gtmEventUnlockAchievement,
  gtmEventFinishCourse,
  gtmEventExecuteCode
} from '@/lib/gtm.js';

import { 
  getCurrentExercise,
  getPreviousExercise,
  getNextExercise,
  submitInformationalExercise,
  submitCodeExercise,
  submitMultipleChoiceExercise,
  getFirstExercise,
  saveCode,
  getSavedCode,
  getCourses,
  getFirstExerciseInModule
} from '@/lib/cloudClient.js';

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
      defaultCode: '',
      courses: null,
      isComplete: false
    };
  },
  computed: {
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
    await this.getCurrentExercise();
  },
  methods: {
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
      if (!this.$store.getters.getUserIsSubscribed){
        await this.goForward();
        return;
      }
      await submitInformationalExercise(
        this.exerciseUUID
      );
      this.isComplete = true;
      if (this.isCurrentExercise){
        await this.getCurrentExercise();
      } else {
        await this.goForward();
      }
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
    async submitTypeCode(output) {
      gtmEventExecuteCode(this.exerciseUUID, this.course.Title);
      if (!this.$store.getters.getUserIsSubscribed){
        return;
      }
      try {
        const rewardsResponse = await submitCodeExercise(
          this.exerciseUUID,
          output
        );
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
        await sleep(1500);
        if (this.isCurrentExercise){
          await this.getCurrentExercise();
        }
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async submitTypeChoice(answer) {
      if (!this.$store.getters.getUserIsSubscribed){
        return;
      }
      try {
        const rewardsResponse = await submitMultipleChoiceExercise(
          this.exerciseUUID,
          answer
        );
        this.isComplete = true;
        this.handleRewards(rewardsResponse);
        await sleep(1500);
        if (this.isCurrentExercise){
          await this.getCurrentExercise();
        }
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async moveToExercise(exercise){
      if (exercise.CourseDone){
        if (!this.courseDone){
          gtmEventFinishCourse(this.course.Title, false);
        }
        this.courseDone = true;
        this.handleRewards(exercise.Rewards);
        return;
      }
      this.courseDone = false;
      this.isFirstExercise = exercise.Exercise.IsFirst;
      this.isLastExercise = exercise.Exercise.IsLast;
      this.isCurrentExercise = exercise.IsCurrent;
      this.isComplete = exercise.IsComplete;

      this.markdownSource = exercise.Exercise.Readme;
      this.type = exercise.Exercise.Type;
      this.moduleUUID = exercise.Exercise.ModuleUUID;
      this.$store.commit('setCurrentModuleUUID', this.moduleUUID);
      this.exerciseUUID = exercise.Exercise.UUID;

      if (this.type === 'type_code'){
        this.code = exercise.Exercise.Code;
        this.defaultCode = exercise.Exercise.Code;
        this.progLang = exercise.Exercise.ProgLang;
      } else if (exercise.Exercise.Question){
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
  background-color: $gray-dark-2;
  color: $gray-lightest;

  &.left {
    border-right: 2px solid $gray-light;
    width: 50%;
  }

  &.right {
    background-color: $gray-darker;
    color: $gray-lighter;
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

.nav {
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
}
</style>
