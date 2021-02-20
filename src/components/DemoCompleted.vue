<template>
  <div class="subcontainer">
    <ExerciseNav
      class="nav"
      :go-back="backCallback"
      :go-forward="forwardCallback"
      :can-go-back="canGoBack"
      :can-go-forward="canGoForward"
    />
      
    <Section
      :title="`You've completed the ${courseTitle} demo!`"
      subtitle="Don't stop now"
      class="section"
    >
      <div class="body">
        <img
          src="https://media4.giphy.com/media/3o7qDT9Yp5DdcN3qi4/giphy.gif"
        >
        <div>
          <p>
            Complete the rest of the course to get a certificate,
            earn free gems and content,
            and support the continued development of Qvault
          </p>

          <p v-if="$store.getters.getIsLoggedIn">
            <BlockButton
              :click="() => {this.$router.push({ path: `/dashboard/courses?courseUUID=${courseUUID}` })}"
            >
              Get Full Course
            </BlockButton>
          </p>
          <p v-else>
            <BlockButton
              :click="() => {this.$router.push({ name: 'Login' })}"
            >
              Sign Up
            </BlockButton>
          </p>

          <p>
            <a
              target="_blank"
              href="https://forms.gle/tG3Vj8g1NJ2dCWfT8"
            >
              Also, take a quick survey to get some free gems
            </a>
          </p>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton';
import Section from '@/components/Section';
import ExerciseNav from '@/components/ExerciseNav';

export default {
  components: {
    BlockButton,
    Section,
    ExerciseNav
  },
  props: {
    courseTitle: {
      type: String,
      required: true
    },
    courseUUID: {
      type: String,
      required: true
    },
    backCallback: {
      type: Function,
      required: true
    },
    forwardCallback: {
      type: Function,
      required: true
    },
    canGoBack: {
      type: Boolean,
      required: true
    },
    canGoForward: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

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
</style>
