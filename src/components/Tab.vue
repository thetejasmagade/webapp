<template lang="html">
  <div
    v-show="isActive"
    class="tab"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      isActive: false
    };
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.tab {
  display: inline-block;
  width: 100%;
}
</style>
