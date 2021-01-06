<template>
  <div class="tooltip-box">
    <div :style="{margin: `${itemMargin}px`}">
      <slot />
    </div>
    <div
      class="tooltip"
      :class="{
        gray: color === 'gray',
        pink: color === 'pink',
        top: position === 'top',
        right: position === 'right'
      }"
      :style="{'margin-top': `${marginTop}px`}"
    >
      <span
        class="text"
        :class="color"
      >{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    text: {
      type: String,
      required: true
    },
    color:{
      type: String,
      required: false,
      default: 'gray'
    },
    position:{
      type: String,
      required: false,
      default: 'top'
    },
    itemMargin: {
      type: Number,
      required: false,
      default: 0
    },
    marginTop: {
      type: Number,
      required: false,
      default: 0
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.tooltip-box { 
  position: relative;
  display: inline-block;

  .tooltip { 
    color: $white;
    text-align: center;
    padding: 5px 0;
    border-radius: 2px;
    font-family: $default-font-family;

    width: 120px;

    &.top {
      bottom: 100%;
      left: 50%;
      margin-left: -60px;
    }

    &.right {
      top: 50%;
      left: 110%;
    }

    opacity: 0;
    transition: opacity 1s;

    position: absolute;
    z-index: 1;
  }

  &:hover{
    .tooltip {
      opacity: 1;
    }
  }
}

.gray {
  background: $gray-light;
}

.pink {
  background: $pink-mid;
}

</style>
