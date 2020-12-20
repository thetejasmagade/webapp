<template>
  <div class="demo-root">
    <TopNav :title="courseTitle" />

    <div
      v-if="currentIndex >= demoExercises.length && currentIndex !== 0"
      class="demo-complete"
    >
      <ExerciseNav
        class="nav"
        :go-back="goBack"
        :go-forward="goForward"
        :can-go-back="!isFirstExercise"
        :can-go-forward="!isLastScreen"
      />

      <div class="subcontainer">
        <Section
          :title="`You've completed the ${course.Title} demo!`"
          subtitle="Don't stop now"
          class="section"
        >
          <div class="body">
            <img
              src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
            >
            <div v-if="$store.getters.getIsLoggedIn">
              <p>
                Complete the rest of the course to get a certificate,
                earn free gems and content,
                and support the continued development of Qvault
              </p>
              <BlockButton
                :click="() => {this.$router.push({ path: `/dashboard/courses?courseUUID=${courseUUID}` })}"
              >
                Get Full Course
              </BlockButton>
            </div>
            <div v-else>
              <p>
                Complete the rest of the course to get a certificate,
                earn free gems and content,
                and support the continued development of Qvault.
                Create an account to get started.
              </p>
              <BlockButton
                :click="() => {this.$router.push({ name: 'Login' })}"
              >
                Sign Up
              </BlockButton>
            </div>
          </div>
        </Section>
      </div>
    </div>

    <div
      v-else
      class="container"
    >
      <div class="side left">
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
import ExerciseNav from '@/components/ExerciseNav';
import TopNav from '@/components/TopNav';
import BlockButton from '@/components/BlockButton';
import Section from '@/components/Section';

import { 
  submitCodeExercise,
  submitMultipleChoiceExercise,
  getDemoExercises,
  getCoursePublic
} from '@/lib/cloudClient.js';

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
    Section
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
      progLang: 'go'
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
      // extra for the last sceen
      return this.currentIndex === this.demoExercises.length;
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
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
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
          this.demoExercise.UUID,
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
      if (!this.demoExercise){
        return;
      }
      this.markdownSource = this.demoExercise.Readme;
      this.type = this.demoExercise.Type;

      // Allow DOM to render changes before setting data on components
      await this.$nextTick();
      if (this.type === 'type_code'){
        this.$refs.codeEditor.setCode(this.demoExercise.Code);
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

.demo-complete {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  .nav {
    width: 100%;
    box-sizing: border-box;
    padding: 0em 1em 0em 1em;
  }

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
