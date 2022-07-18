<template>
  <div class="flex flex-col justify-start items-center h-full-minus-bar p-4">
    <Section
      :title="`Username`"
      :subtitle="`@Profile`"
      class="max-w-2xl w-full mb-4"
    >
      <div class="flex flex-col-2 justify-end mt-2">
        <Skeletor
          height="7vw"
          width="25%"
          class="rounded max-w-2xl w-full w-32 mb-4 -mt-16"
        />
      </div>
      <div class="p-4 flex flex-col mr-2 -mt-16">
        <Skeletor
          v-for="i in 4"
          :key="i"
          height="1vw"
          width="45%"
          class="rounded max-w-2xl w-full mb-4"
        />
      </div>
    </Section>
    <Section
      title="Courses Completed"
      subtitle="Download and share Boot.dev certificates to show off your skills"
      class="max-w-2xl w-full mb-5"
    >
      <div class="grid md:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
        <Skeletor
          v-for="i in 4"
          :key="i"
          height="8vw"
          width="80%%"
          class="rounded max-w-2xl w-full"
        />
      </div>
    </Section>
  </div>
</template>

<script>
import { Skeletor } from "vue-skeletor";
import Section from "@/components/Section.vue";
import "vue-skeletor/dist/vue-skeletor.css";

export default {
  components: {
    Skeletor,
    Section,
  },
};
</script>
