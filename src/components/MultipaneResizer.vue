<template>
  <div
    class="multipane-resizer block relative z-10"
    :class="{
      vertical: layout === 'vertical',
      horizontal: layout === 'horizontal',
    }"
  >
    <slot />
  </div>
</template>

<script>
// taken from https://github.com/yansern/vue-multipane
export default {
  name: "Multipane",
  props: {
    layout: {
      type: String,
      required: true,
    },
  },
  emits: ["paneResizeStart", "paneResize", "paneResizeStop"],
};
</script>

<style scoped></style>
