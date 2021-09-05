<template>
  <div class="tabs">
    <ul class="tabs-header">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        class="tabs-tab"
        :class="{'tab-selected': i === selectedIndex}"
        @click="selectTab(i)"
      >
        <FontAwesomeIcon
          v-if="tab.props"
          :icon="tab.props.icon"
          class="icon"
        />
        <span
          v-if="tab.props"
          class="desktop"
        >
          {{ tab.props.title }}
        </span>
      </li>
    </ul>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  provide,
  reactive,
  onBeforeMount,
  onBeforeUpdate,
  onMounted,
  toRefs
} from 'vue';

export default {
  components: {
    FontAwesomeIcon
  },
  setup(_, {slots}) {
    const state = reactive({
      selectedIndex: 0,
      tabs: [],
      count: 0
    });

    provide('TabsProvider', state);

    const selectTab = (i) => {
      state.selectedIndex = i;
    };

    const update = () => {
      if (slots.default) {
        state.tabs = slots.default();
      }
    };

    onBeforeMount(() => update());
    onBeforeUpdate(() => update());

    onMounted(() => {
      selectTab(0);
    });
    return {...toRefs(state), selectTab};
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.tabs-header {
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tabs-tab {
  background-color: $gray-lighter;
  color: $gray-darker;
  padding: 15px 30px;
  @media screen and (max-width: $mobile-size) {
    padding: 10px 20px;
  }
  border-radius: 3px 3px 0 0;
  margin: 0 5px 0 0;
  display: inline-block;
  cursor: pointer;

  &.tab-selected {
    background-color: white
  }
}

.body {
  border-radius: 0px 3px 3px 3px;
}

.icon {
  margin: 0 10px 0 0;
  @media screen and (max-width: $mobile-size) {
    margin: 0 5px 0 5px;
  }
}

.desktop {
  display: none !important;
  @media screen and (min-width: $mobile-size) {
    display: inline-block !important;
  }
}
</style>
