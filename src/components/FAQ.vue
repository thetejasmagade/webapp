<template>
  <Section
    title="Frequently Asked Questions"
    subtitle="Interested in becoming a patron but unsure what that entails?"
  >
    <div class="flex justify-center p-4">
      <div class="px-4 max-w-4xl">
        <h2 class="text-xl my-4 text-blue-400">
          What's the difference between a free account and a patron account?
        </h2>
        <p class="mb-4">
          You can demo patron-only features at the beginning of each course, but
          after that you'll be in "sandbox" or "read only" mode. You won't pass
          off assignments or know if you got the correct answers. You also won't
          earn achievements and certifications without a patron account.
        </p>
        <p class="mb-4">
          Patrons enjoy all the features in the free plan, plus the ability to
          pass off exercises, view solutions, complete quizzes, earn
          certifications, and chat in the patron-only lounge.
        </p>

        <h2 class="text-xl my-4 text-blue-400">
          Why aren't all the features on Boot.dev free?
        </h2>
        <p class="mb-4">
          Free options use ads to pay for ongoing development, or don't have the
          resources to offer an amazing experience. We're a small team of 2
          dedicated to giving Boot.dev our full-time attention while keeping it
          ad-free. The only way for us to do that is if our fans to support us
          directly.
        </p>
        <p class="mb-4">
          That said, we make all of our content free to read, and open our
          community to everyone so that those who are unable to support us can
          still find a lot of value.
        </p>

        <h2 class="text-xl my-4 text-blue-400">
          What makes Boot.dev different?
        </h2>
        <p class="mb-4">
          I built Boot.dev based on the lessons I've been learning as an
          engineering hiring manager. You can read about
          <a
            class="underline cursor-pointer text-blue-400 hover:text-blue-300"
            href="https://blog.boot.dev/about"
            target="_blank"
            >our methodology here</a
          >, but in a nutshell I've learned that entry-level developers don't
          learn enough computer science, and that is the biggest obstacle on
          their way to a successful coding career.
        </p>

        <h2 class="text-xl my-4 text-blue-400">
          Do I need to know how to code before signing up?
        </h2>
        <p>
          No, in fact many of our students have zero experience when they sign
          up. Our "Basic Intro to Coding" courses are built just for you.
        </p>

        <h2 class="text-xl my-4 text-blue-400">
          How do I cancel my patronage?
        </h2>
        <p>
          We do our best to be transparent about pricing, and never want you to
          feel obligated to keep supporting us if you don't want to. You can
          cancel your patron account any time from your
          <a
            class="underline cursor-pointer text-blue-400 hover:text-blue-300"
            href="/settings"
            >settings page</a
          >
          and you won't be billed again.
        </p>

        <h2 class="text-xl my-4 text-blue-400">
          What if I don't like being a Patron?
        </h2>
        <p>
          Hopefully you can figure out if you're enjoying the platform within
          the first several free chapters. That said, if you become a patron and
          no longer want to support us you can take advantage of our
          <a
            class="underline cursor-pointer text-blue-400 hover:text-blue-300"
            href="https://blog.boot.dev/return-policy/"
            >return policy.</a
          >
          If you contact us within 30 days of your purchase you're entitled to a
          full refund.
        </p>
      </div>
    </div>
  </Section>
</template>

<script>
import Section from "@/components/Section.vue";

export default {
  components: {
    Section,
  },
};
</script>

<style scoped></style>
