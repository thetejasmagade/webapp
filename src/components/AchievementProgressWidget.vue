<template>
  <div class="flex flex-row items-center bg-gray-850 rounded p-4">
    <Radial
      class="mr-4"
      :from-percent="0"
      :to-percent="(100 * currentProgress) / maxProgress"
      :radius="30"
    />
    <p class="text-xl">
      {{ currentProgress }} /
      {{ maxProgress }}
      {{ text }}
    </p>
  </div>
</template>

<script>
import Radial from "@/components/Radial.vue";

export default {
  components: {
    Radial,
  },
  props: {
    currentProgress: {
      type: Number,
      required: false,
      default: 0,
    },
    maxProgress: {
      type: Number,
      required: false,
      default: 0,
    },
    text: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
