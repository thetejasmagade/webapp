<template>
  <div
    class="
      multipane-resizer
      block
      relative
      z-10
    "
    :class="{
      'vertical': layout === 'vertical',
      'horizontal': layout === 'horizontal'
    }"
  >
    <slot />
  </div>
</template>

<script>

// taken from https://github.com/yansern/vue-multipane
export default {
  name: 'Multipane',
  emits: [ 'paneResizeStart', 'paneResize', 'paneResizeStop' ],
  props: {
    layout: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
</style>
