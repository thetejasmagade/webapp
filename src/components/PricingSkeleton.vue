<template>
  <div
    class="center item-center grid md:grid-cols-3 sm:grid-cols-1 gap-4 md:p-4 sm:p-0 w-full"
  >
    <div
      class="grid gap-8 grid-cols-6 shadow-lg px-6 py-14 text-center rounded-lg bg-white items-center"
    >
      <Skeletor
        height="2vw"
        class="col-start-3 col-span-2 shadow-lg rounded-lg bg-white items-center"
      />
      <Skeletor
        v-for="i in 14"
        :key="i"
        height="1.5vw"
        :class="{
          'col-start-1 col-span-3': i % 2 != 0,
          'col-start-4 col-span-3': i % 2 == 0,
        }"
        class="shadow-lg rounded-lg bg-white items-center"
      />
    </div>

    <div
      class="lg:col-span-2 md:col-span-2 sm:col-span-1 shadow-lg px-6 py-14 text-center rounded-lg bg-white items-center flex flex-col h-full w-full"
    >
      <Skeletor
        height="2vw"
        width="20vw"
        class="shadow-lg text-center rounded-lg bg-white items-center flex flex-col h-full w-full"
      />
      <div class="py-3" />
      <div
        class="grid xl:grid-cols-3 lg:grid-cols-1 gap-4 xl:p-4 md:p-0 w-full"
      >
        <Skeletor
          v-for="i in 3"
          :key="i"
          height="14.5vw"
          class="shadow-lg px-6 py-8 text-center rounded-lg bg-white items-center flex flex-col h-full w-full"
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
