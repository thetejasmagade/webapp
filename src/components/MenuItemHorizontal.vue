<template>
  <div>
    <div
      id="item"
      :class="{'current': current}"
      @click="click"
    >
      <FontAwesomeIcon
        v-if="subItems.length === 0 && show"
        :icon="['fas', icon]" 
        class="icon"
      />
      <FontAwesomeIcon
        v-else-if="show"
        class="icon spin"
        :class="{'is-open': subItemsTabOpen}"
        icon="arrow-right"
      />
      <span v-if="text">{{ text }}</span>
    </div>
    <div
      v-if="subItems.length > 0"
      id="sub-items"
      :style="{maxHeight: subitemsTabHeight + 'px'}"
    >
      <div 
        v-for="(subItem, i) of subItems"
        :key="i"
        :class="{'current': subItem.uuid === activeSubItemUUID}"
        class="sub-item"
        @click="()=> {subItem.click ? subItem.click() : null}"
      >
        <span>{{ i + 1 }}) {{ subItem.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  props: { 
    click:{
      type: Function,
      required: false,
      default: () => {}
    },
    icon:{
      type: String,
      required: false,
      default: 'arrow-right'
    },
    text:{
      type: String,
      required: false,
      default: null
    },
    subItems:{
      type: Array,
      required: false,
      default: () => []
    },
    current:{
      type: Boolean,
      required: false,
      default: false
    },
    subItemsTabOpen:{
      type: Boolean,
      required: false,
      default: false
    },
    activeSubItemUUID:{
      type: String,
      required: false,
      default: null
    }
  },
  data(){
    return {
      show: true
    };
  },
  computed: {
    subitemsTabHeight(){
      return this.subItemsTabOpen ? this.subitemsTabHeightExpanded : 0;
    },
    subitemsTabHeightExpanded(){
      return this.subItems.length * 30;
    }
  },
  watch: {
    icon: {
      immediate: true,
      handler() {
        this.forceRerender();
      }
    }
  },
  methods: {
    // this is because alpha fortawesome is broken
    forceRerender() {
      // Remove my-component from the DOM
      this.show = false;

      this.$nextTick(() => {
        // Add the component back in
        this.show = true;
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#item {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 5px;

  &:hover{
    background-color: $gold-mid;
    color: $gray-darker;
    cursor: pointer;

    span {
      margin-left: 25px;
    }
  }

  &.current {
    color: $gold-mid;

    &:hover{
      color: $gray-darker;
    }
  }

  span {
    transition: margin-left 0.4s;
  }

  .icon {
    margin: 0 15px 0 15px;
  }

  .spin {
    transition: all 0.4s ease;

    &.is-open {
      transform: rotateZ(90deg);
    }
  }
}

#sub-items {
  overflow: hidden;
  transition: max-height 0.2s linear 0s;

  .sub-item {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border: solid $white;
    border-width: 0 0 0 1px;
    margin-left: 30px;
    cursor: pointer;

    span {
      padding-left: 20px;
    }

    &.current {
      border-color: $purple-lighter;
      color: $purple-lighter;
    }

    &:hover {
      border-color: $purple-dark;
      color: $purple-dark;
    }
  }
}

</style>
