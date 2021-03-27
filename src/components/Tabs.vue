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
          v-if="tab.icon"
          :icon="tab.icon"
          class="icon"
        />
        <span class="desktop">{{ tab.title }}</span>
      </li>
    </ul>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      selectedIndex: 0,
      tabs: [] 
    };
  },
  created () {
    this.tabs = this.$children;
  },
  mounted () {
    this.selectTab(0);
  },
  methods: {
    selectTab (i) {
      this.selectedIndex = i;
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i);
      });
    }
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
  background-color: $gray-light;
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
    background-color: $gray-lightest;
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
