<template>
  <div class="root">
    <CourseCompleted
      v-if="courseDone"
      class="full"
      :restart-callback="goToBeginning"
    />

    <div
      v-else
      class="container"
    >
      <div class="side">
        <div class="navigation">
          <div>
            <BlockButton
              class="btn"
              :click="goBack"
              color="gray"
              :disabled="isFirstExercise"
            >
              <FontAwesomeIcon
                icon="arrow-left"
              />
            </BlockButton>
            <BlockButton
              :disabled="isCurrentExercise || isLastExercise"
              class="btn margin-left"
              :click="goForward"
              color="gray"
            >
              <FontAwesomeIcon
                icon="arrow-right"
              />
            </BlockButton>
          </div>

          <BlockButton
            class="btn"
            :click="() => {linkClick('https://discord.gg/k4rVEWt')}"
          >
            <FontAwesomeIcon
              :icon="['fab', 'discord']"
            />
            <span class="margin-left-small"> Help </span>
          </BlockButton>
        </div>
        <MarkdownViewer
          :source="markdownSource"
        />
      </div>
      <div
        v-if="type === 'type_info'"
        id="info-container"
        class="side"
      >
        <p> 👈 Read First 👈🏿 </p>
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
        class="side"
        :run-callback="submitTypeCode"
        :reset-callback="getCurrentExercise"
        :prog-lang="progLang"
      />
      <MultipleChoice
        v-else-if="type === 'type_choice'"
        class="side"
        :callback="submitTypeChoice"
        :answers="answers"
        :question="currentQuestion"
      />
    </div>
  </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor';
import MultipleChoice from '@/components/MultipleChoice';
import MarkdownViewer from '@/components/MarkdownViewer';
import BlockButton from '@/components/BlockButton';
import CourseCompleted from '@/components/CourseCompleted';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
    FontAwesomeIcon
  },
  data(){
    return {
      markdownSource: '',
      type: '',
      courseUUID: this.$route.params.courseUUID,
      moduleUUID: null,
      exerciseUUID: null,
      questions: null,
      currentQuestionIndex: 0,
      progLang: 'go',
      courseDone: false,
      isFirstExercise: false,
      isLastExercise: false,
      isCurrentExercise: false
    };
  },
  computed: {
    answers(){
      if (this.questions) {
        return this.shuffle(this.questions[this.currentQuestionIndex].Answers);
      }
      return null;
    },
    currentQuestion(){
      if (this.questions) {
        return this.questions[this.currentQuestionIndex].Question;
      }
      return null;
    }
  },
  async mounted(){
    await this.getCurrentExercise();
  },
  async beforeRouteUpdate (to, from, next) {
    this.courseUUID = to.params.courseUUID;
    this.courseDone = false;
    await this.getCurrentExercise();
    next();
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ a[i], a[j] ] = [ a[j], a[i] ];
      }
      return a;
    },
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
    async submitTypeCode(output) {
      try {
        const credit = await submitCodeExercise(
          this.exerciseUUID,
          output
        );
        if (credit.GemCredit && credit.Message){
          this.$notify({
            type: 'success',
            text: `${credit.Message} 💎x${credit.GemCredit}`
          });
          loadBalance(this);
        } else{
          this.$notify({
            type: 'success',
            text: 'Correct! Great Job :)'
          });
        }
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
    async submitTypeChoice(question, answer) {
      try {
        const credit = await submitMultipleChoiceExercise(
          this.exerciseUUID,
          question,
          answer
        );
        if (credit.GemCredit && credit.Message){
          this.$notify({
            type: 'success',
            text: `${credit.Message} 💎x${credit.GemCredit}`
          });
          loadBalance(this);
        } else{
          this.$notify({
            type: 'success',
            text: 'Correct! Great Job :)'
          });
        }
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
      } else if (exercise.Exercise.Questions){
        this.questions = this.shuffle(exercise.Exercise.Questions);
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

.root {
  height: 100%;
}

.container {
  display: flex;
  height: 100%;
}

.full {
  width: 100%;
  padding-top: 20px;
}

.navigation{
  margin: 1em 1em 0em 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .margin-left{
    margin-left: 1em;
  }

  .margin-left-small{
    margin-left: 4px;
  }
}

.side {
  height: 100%;
  overflow: auto;
  flex: 1;
  background-color: $white;
  border-right: 2px solid $black;
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
    font-size: 2em;
  }
}

</style>
