<template>
  <div
    class="center item-center grid md:grid-cols-3 sm:grid-cols-1 gap-4 md:p-4 sm:p-0 w-full"
  >
    <div class="text-center rounded-lg items-center">
      <Skeletor
        v-for="i in 9"
        :key="i"
        height="25"
        class="shadow-lg rounded-lg items-center mb-2"
      />
    </div>

    <div
      class="lg:col-span-2 md:col-span-2 sm:col-span-1 ext-center rounded-lg items-center flex flex-col h-full w-full"
    >
      <div class="grid xl:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
        <Skeletor
          v-for="i in 3"
          :key="i"
          height="275"
          class="shadow-lg px-6 py-8 text-center rounded-lg items-center flex flex-col h-full w-full"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Skeletor } from "vue-skeletor";
import "vue-skeletor/dist/vue-skeletor.css";

export default {
  components: {
    Skeletor,
  },
};
</script>
