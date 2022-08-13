<template>
  <div class="flex flex-col justify-start items-center w-full">
    <Section title="Top Daily Learners" class="mb-4 w-full">
      <div class="p-4 flex flex-col items-center w-full">
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <Skeletor
            v-for="i in 10"
            :key="i"
            height="250"
            width="175"
            class="mb-6 rounded"
          />
        </div>
      </div>
    </Section>
    <Section title="Top Weekly Learners" class="mb-4 w-full">
      <div class="p-4 flex flex-col items-center w-full">
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <Skeletor
            v-for="i in 10"
            :key="i"
            height="200"
            width="150"
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
