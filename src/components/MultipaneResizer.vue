<template>
  <div
    class="multipane-resizer"
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

<style scoped lang="scss">
.multipane-resizer {
  display: block;
  position: relative;
  z-index: 2;
}
</style>
