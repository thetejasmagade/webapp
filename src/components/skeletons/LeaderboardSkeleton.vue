<template>
  <div class="flex flex-col justify-start items-center p-4">
    <Section
      title="How many exercises are learners doing?"
      subtitle="Hover over a bar to see the percentage of students who have completed that many exercises"
      class="m-4 max-w-4xl w-full"
    >
      <Skeletor
        v-for="i in 1"
        :key="i"
        height="25vw"
        width="100%"
        class="mt-5 rounded"
      />
    </Section>
    <Section title="Top Daily Learners" class="m-4 max-w-4xl">
      <div class="p-4 flex flex-col items-center w-full">
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <Skeletor
            v-for="i in 10"
            :key="i"
            height="11vw"
            width="8vw"
            class="mb-6 rounded"
          />
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import { Skeletor } from "vue-skeletor";
import "vue-skeletor/dist/vue-skeletor.css";

export default {
  components: {
    Skeletor,
    Section,
  },
};
</script>
