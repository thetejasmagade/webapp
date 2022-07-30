<template>
  <div
    :class="{
      'opacity-70': !isPlaying,
    }"
  >
    <img class="freezeframe" :src="src" />
  </div>
</template>

<script>
import Freezeframe from "freezeframe";
import { reactive, toRefs } from "vue";
import { nextTick, onMounted } from "@vue/runtime-core";

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  setup() {
    const state = reactive({
      isPlaying: false,
    });

    onMounted(async () => {
      await nextTick();
      const freezeframe = new Freezeframe({
        trigger: "hover",
      });
      freezeframe.on("toggle", (_, isPlaying) => {
        state.isPlaying = isPlaying;
      });
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
