<template>
  <div
    v-show="isActive"
    class="tab"
  >
    <slot />
  </div>
</template>

<script>
import {onBeforeMount, ref, inject, watch} from 'vue';

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
  setup() {
    const index = ref(0);
    const isActive = ref(false);

    const tabs = inject('TabsProvider');

    watch(
      () => tabs.selectedIndex,
      () => {
        isActive.value = index.value === tabs.selectedIndex;
      }
    );

    onBeforeMount(() => {
      index.value = tabs.count;
      tabs.count++;
      isActive.value = index.value === tabs.selectedIndex;
    });
    return {index, isActive};
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
