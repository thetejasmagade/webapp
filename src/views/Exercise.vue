<template>
  <div class="exercise-root">
    <CourseCompleted
      v-if="courseDone"
      class="full"
      :restart-callback="goToBeginning"
    />

    <div
      v-else-if="demoComplete"
      class="demo-complete"
    >
      <ExerciseNav
        class="nav"
        :go-back="goBack"
        :go-forward="goForward"
        :can-go-back="!isFirstExercise"
        :can-go-forward="false"
      />

      <div class="subcontainer">
        <Section
          :title="`You've completed the ${courseTitle} demo!`"
          subtitle="Don't stop now"
          class="section"
        >
          <div class="body">
            <img
              src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
            >
            <div>
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
import BlockButton from '@/components/BlockButton';
import CourseCompleted from '@/components/CourseCompleted';
import ExerciseNav from '@/components/ExerciseNav';
import Section from '@/components/Section';

import { 
  loadBalance
} from '@/lib/cloudStore.js';

import { 
  sleep
} from '@/lib/sleep.js';

import { 
  gtmEarnGems,
  gtmUnlockAchievement
} from '@/lib/gtm.js';

import { 
  getCurrentExercise,
  getPreviousExercise,
  getNextExercise,
  submitInformationalExercise,
  submitCodeExercise,
  submitMultipleChoiceExercise,
  getFirstExercise,
  getDemoExercises
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
    Section
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
      demoExercises: [],
      question: {},
      progLang: 'go',
      courseDone: false,
      isFirstExercise: false,
      isLastExercise: false,
      isCurrentExercise: false,
      code: ''
    };
  },
  computed: {
    course(){
      let courses = this.$store.getters.getCourses;
      for (const course of courses){
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
    demoComplete(){
      if (!this.course || this.course.IsPurchased){
        return false;
      }
      if (this.demoExercises.length === 0){
        return false;
      }
      for (const demo of this.demoExercises){
        if (demo.UUID === this.exerciseUUID){
          return false;
        }
      }
      return true;
    }
  },
  async mounted(){
    await this.getCurrentExercise();
    this.demoExercises = await getDemoExercises(this.courseUUID);
  },
  methods: {
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

      if (rewardsResponse.GemCredit){
        gtmEarnGems(rewardsResponse.GemCredit);
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
            gtmEarnGems(achievement.GemReward);
          }
          if (achievement.UUID){
            gtmUnlockAchievement(achievement.UUID);
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
      try {
        const rewardsResponse = await submitCodeExercise(
          this.exerciseUUID,
          output
        );
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
      try {
        const rewardsResponse = await submitMultipleChoiceExercise(
          this.exerciseUUID,
          answer
        );
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
        this.courseDone = true;
        this.handleRewards(exercise.Rewards);
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

      if (this.type === 'type_code'){
        this.code = exercise.Exercise.Code;
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
