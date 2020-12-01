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
      <div class="side left">
        <ExerciseNav
          :go-back="goBack"
          :go-forward="goForward"
          :can-go-back="!isFirstExercise"
          :can-go-forward="!(isCurrentExercise || isLastExercise)"
        />
        
        <MarkdownViewer
          :source="markdownSource"
        />
      </div>
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
        ref="codeEditor"
        class="side right"
        :run-callback="submitTypeCode"
        :reset-callback="getCurrentExercise"
        :prog-lang="progLang"
      />
      <MultipleChoice
        v-else-if="type === 'type_choice'"
        class="side right"
        :callback="submitTypeChoice"
        :answers="question.Answers"
        :question="question.Question"
      />
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

import { 
  loadBalance
} from '@/lib/cloudStore.js';

import { 
  getCurrentExercise,
  getPreviousExercise,
  getNextExercise,
  submitInformationalExercise,
  submitCodeExercise,
  submitMultipleChoiceExercise,
  getFirstExercise
} from '@/lib/cloudClient.js';

export default {
  components: {
    CodeEditor,
    MarkdownViewer,
    BlockButton,
    MultipleChoice,
    CourseCompleted,
    ExerciseNav
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
      isCurrentExercise: false
    };
  },
  async mounted(){
    await this.getCurrentExercise();
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async submitTypeInfo(){
      await submitInformationalExercise(
        this.exerciseUUID
      );
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
      try {
        const rewardsResponse = await submitCodeExercise(
          this.exerciseUUID,
          output
        );
        this.handleRewards(rewardsResponse);
        await this.sleep(1500);
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
      try {
        const rewardsResponse = await submitMultipleChoiceExercise(
          this.exerciseUUID,
          answer
        );
        this.handleRewards(rewardsResponse);
        await this.sleep(1500);
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
        this.courseDone = true;
        if (exercise.Message && exercise.GemCredit){
          this.$notify({
            type: 'success',
            text: `${exercise.Message} 💎x${exercise.GemCredit}`
          });
        }
        return;
      }
      this.courseDone = false;
      this.isFirstExercise = exercise.Exercise.IsFirst;
      this.isLastExercise = exercise.Exercise.IsLast;
      this.isCurrentExercise = exercise.IsCurrent;

      this.markdownSource = exercise.Exercise.Readme;
      this.type = exercise.Exercise.Type;
      this.moduleUUID = exercise.Exercise.ModuleUUID;
      this.$store.commit('setCurrentModuleUUID', this.moduleUUID);
      this.exerciseUUID = exercise.Exercise.UUID;

      // Allow DOM to render changes before setting data on components
      await this.$nextTick();
      if (this.type === 'type_code'){
        this.$refs.codeEditor.setCode(exercise.Exercise.Code);
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
  width: 100%;
  padding-top: 20px;
}

.side {
  height: 100%;
  overflow: auto;
  flex: 1;
  background-color: $gray-dark-2;
  color: $gray-lightest;

  &.left {
    border-right: 2px solid $gray-light;
  }

  &.right {
    background-color: $gray-darker;
    color: $gray-lighter;
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

</style>
