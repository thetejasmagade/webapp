<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="How do I get my first job as a developer?"
        subtitle="Well, we have some strong feelings about that"
        class="max-w-2xl w-full"
      >
        <div class="max-w-xl p-4">
          <p class="mb-4">
            We are a small team of passionate developers who believe:
          </p>

          <ul class="list-disc mb-4">
            <li>
              Mastering computer science fundamentals is the best way to
              differentiate yourself from other junior developers.
            </li>
            <li>A mix of courses and real life projects is best.</li>
            <li>Finding courses is easy. Finding the best courses is hard.</li>
            <li>Boot camps are too fast, degrees are too slow.</li>
            <li>Mastery of concepts is important, grades are not.</li>
            <li>
              Being able to prove your skills is as important as having them.
            </li>
            <li>There is something magical about learning with others.</li>
            <li>We can make learning as addictive as gaming.</li>
          </ul>

          <p class="mb-4 text-center">
            You can read more about our
            <a
              class="text-blue-400 underline hover:text-blue-300"
              href="https://qvault.io/method"
              target="_blank"
              >method here</a
            >
          </p>

          <div class="text-center">
            <BlockButton
              :link="{
                name: 'SignupFlowUsername',
                query: { redirect: $route.query.redirect },
              }"
            >
              Get Started
            </BlockButton>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav.vue";
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    TopNav,
    Section,
    BlockButton,
  },
  setup() {
    const state = {};
    return state;
  },
};
</script>

<style scoped></style>
