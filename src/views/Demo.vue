<template>
  <div class="root">
    <TopNav :title="`Demo`" />

    <div
      v-if="currentIndex >= exercises.length && currentIndex !== 0"
      class="demo-complete"
    >
      <ExerciseNav
        class="nav"
        :go-back="goBack"
        :go-forward="goForward"
        :can-go-back="!isFirstExercise"
        :can-go-forward="!isLastScreen"
      />
      <img
        src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
      >
      <p> 
        You've completed the demo!
      </p>
      <div v-if="$store.getters.getIsLoggedIn"> 
        <BlockButton
          class="btn"
          :click="() => {this.$router.push({ path: `/dashboard/courses?courseUUID=${courseUUID}` })}"
        >
          Get Full Course
        </BlockButton>
      </div>
      <BlockButton
        v-else
        class="btn"
        :click="() => {this.$router.push({ name: 'Login' })}"
      >
        Sign Up
      </BlockButton>
    </div>

    <div
      v-else
      class="container"
    >
      <div class="side">
        <ExerciseNav
          :go-back="goBack"
          :go-forward="goForward"
          :can-go-back="!isFirstExercise"
          :can-go-forward="!isLastScreen"
        />
        
        <MarkdownViewer
          :source="markdownSource"
        />
      </div>
      <CodeEditor
        v-if="type === 'type_code'"
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
        :answers="question.Answers"
        :question="question.Question"
      />
    </div>
  </div>
</template>

<script>
import CodeEditor from '@/components/CodeEditor';
import MultipleChoice from '@/components/MultipleChoice';
import MarkdownViewer from '@/components/MarkdownViewer';
import ExerciseNav from '@/components/ExerciseNav';
import TopNav from '@/components/TopNav';
import BlockButton from '@/components/BlockButton';

import { 
  submitCodeExercise,
  submitMultipleChoiceExercise,
  getDemoExercises
} from '@/lib/cloudClient.js';

export default {
  components: {
    CodeEditor,
    MarkdownViewer,
    MultipleChoice,
    ExerciseNav,
    TopNav,
    BlockButton
  },
  async beforeRouteUpdate (to, from, next) {
    this.courseUUID = to.params.courseUUID;
    await this.getCurrentExercise();
    next();
  },
  data(){
    return {
      markdownSource: '',
      type: '',
      courseUUID: this.$route.params.courseUUID,
      exercises: [],
      currentIndex: 0,
      question: {},
      progLang: 'go'
    };
  },
  computed:{
    isFirstExercise(){
      return this.currentIndex === 0;
    },
    isLastScreen(){
      // extra for the last sceen
      return this.currentIndex === this.exercises.length;
    },
    exercise(){
      if (this.currentIndex < this.exercises.length){
        return this.exercises[this.currentIndex];
      }
      return null;
    }
  },
  async mounted(){
    this.exercises = await getDemoExercises(this.courseUUID);
    this.getCurrentExercise();
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async submitTypeCode(output) {
      try {
        await submitCodeExercise(
          this.exercise.UUID,
          output,
          true
        );
        this.$notify({
          type: 'success',
          text: 'Correct! Great Job :)'
        });
        await this.sleep(1500);
        await this.goForward();
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async submitTypeChoice(answer) {
      try {
        await submitMultipleChoiceExercise(
          this.exercise.UUID,
          answer,
          true
        );
        this.$notify({
          type: 'success',
          text: 'Correct! Great Job :)'
        });
        await this.sleep(1500);
        await this.goForward();
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async moveToExercise(){
      if (!this.exercise){
        return;
      }
      this.markdownSource = this.exercise.Readme;
      this.type = this.exercise.Type;

      // Allow DOM to render changes before setting data on components
      await this.$nextTick();
      if (this.type === 'type_code'){
        this.$refs.codeEditor.setCode(this.exercise.Code);
        this.progLang = this.exercise.ProgLang;
      } else if (this.exercise.Question){
        this.question = this.exercise.Question;
      }
    },
    async getCurrentExercise(){
      this.moveToExercise();
    },
    async goBack(){
      this.currentIndex--;
      this.moveToExercise();
    },
    async goForward(){
      this.currentIndex++;
      this.moveToExercise();
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

.demo-complete {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: $gray-lightest;

  .nav {
    width: 100%;
    box-sizing: border-box;
    padding: 0em 1em 0em 1em;
  }

  p {
    font-size: 2em;
  }

  .btn {
    font-size: 1.5em;
    margin: 1em;
  }
}

</style>
