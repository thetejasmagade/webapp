<template>
  <div class="demo-root">
    <TopNav :title="courseTitle" />

    <DemoCompleted
      v-if="isLastScreen"
      :back-callback="goBack"
      :forward-callback="goForward"
      :can-go-back="!isFirstExercise"
      :can-go-forward="!isLastScreen"
      :course-title="course.Title"
      :course-u-u-i-d="course.UUID"
    />

    <div
      v-else
      class="container"
    >
      <div class="side left">
        <ExerciseNav
          class="nav"
          :go-back="goBack"
          :go-forward="goForward"
          :can-go-back="!isFirstExercise"
          :can-go-forward="!isLastScreen"
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
        v-if="type === 'type_code'"
        v-model="code"
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
import ExerciseNav from '@/components/ExerciseNav';
import TopNav from '@/components/TopNav';
import BlockButton from '@/components/BlockButton';
import DemoCompleted from '@/components/DemoCompleted';

import { 
  submitCodeExercise,
  submitMultipleChoiceExercise,
  getDemoExercises,
  getCoursePublic
} from '@/lib/cloudClient.js';

import { 
  gtmEventFinishCourse
} from '@/lib/gtm.js';

import { 
  sleep
} from '@/lib/sleep.js';

export default {
  metaInfo() {
    const description = `Demo the ${this.course.Title} course right in your browser. It's free to start and you don't even need to login.`;
    const featuredImage = this.course.ImageURL;
    const title = `${this.course.Title} Course Demo - Qvault`;
    return {
      title: title,
      meta: [
        { vmid:'description', name: 'description', content: description },

        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'og:description', property: 'og:description', content: description },
        { vmid:'og:image', property: 'og:image', content: featuredImage },

        { vmid:'twitter:title', name: 'twitter:title', content: title },
        { vmid:'twitter:description', property: 'twitter:description', content: description },
        { vmid:'twitter:image', name: 'twitter:image', content: featuredImage }
      ]
    };
  },
  components: {
    CodeEditor,
    MarkdownViewer,
    MultipleChoice,
    ExerciseNav,
    TopNav,
    BlockButton,
    DemoCompleted
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
      course: {},
      demoExercises: [],
      currentIndex: 0,
      question: {},
      progLang: 'go',
      code: ''
    };
  },
  computed:{
    courseTitle(){
      if (this.course.Title){
        return `${this.course.Title} - Demo`;
      }
      return 'Demo';
    },
    isFirstExercise(){
      return this.currentIndex === 0;
    },
    isLastScreen(){
      return this.currentIndex >= this.demoExercises.length && this.currentIndex !== 0;
    },
    demoExercise(){
      if (this.currentIndex < this.demoExercises.length){
        return this.demoExercises[this.currentIndex];
      }
      return null;
    }
  },
  async mounted(){
    this.demoExercises = await getDemoExercises(this.courseUUID);
    this.course = await getCoursePublic(this.courseUUID);
    this.getCurrentExercise();
  },
  methods: {
    async submitTypeInfo(){
      await this.goForward();
    },
    async submitTypeCode(output) {
      try {
        await submitCodeExercise(
          this.demoExercise.UUID,
          output,
          true
        );
        this.$notify({
          type: 'success',
          text: 'Correct! Great Job :)'
        });
        await sleep(1500);
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
          this.demoExercise.UUID,
          answer,
          true
        );
        this.$notify({
          type: 'success',
          text: 'Correct! Great Job :)'
        });
        await sleep(1500);
        await this.goForward();
      } catch(err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
    async moveToExercise(){
      if (this.isLastScreen){
        gtmEventFinishCourse(this.course.Title, true);
      }

      if (!this.demoExercise){
        return;
      }
      this.markdownSource = this.demoExercise.Readme;
      this.type = this.demoExercise.Type;

      // Allow DOM to render changes before setting data on components
      await this.$nextTick();
      if (this.type === 'type_code'){
        this.code = this.demoExercise.Code;
        this.progLang = this.demoExercise.ProgLang;
      } else if (this.demoExercise.Question){
        this.question = this.demoExercise.Question;
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
@import '@/styles/consts.scss';

.demo-root {
  height: 100%
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
  border-right: 2px solid $black;

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

.nav {
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
}

.demo-complete {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  .subcontainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    .section {
      max-width: 800px;

      .body {
        text-align: center;

        img {
          margin: 1em;
        }
      }
    }
  }
}

</style>
