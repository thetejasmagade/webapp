<template>
  <div class="tooltip-box">
    <div :style="{margin: `${itemMargin}px`}">
      <slot />
    </div>
    <div
      class="tooltip"
      :class="color"
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
      default: 'purple'
    },
    itemMargin: {
      type: Number,
      required: false,
      default: 5
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.tooltip-box { 
  position: relative;
  display: inline-block;

  .tooltip { 
    color: $white;
    text-align: center;
    padding: 5px 0;
    border-radius: 2px;
    
    width: 120px;
    bottom: 100%;
    left: 50%;
    margin-left: -60px;

    opacity: 0;
    transition: opacity 1s;

    position: absolute;
    z-index: 1;

    .text::after {
      content: " ";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
    }
  }

  &:hover{
    .tooltip {
      opacity: 1;
    }
  }
}

.purple {
  background: $purple-lighter;
  &::after {
    border-color: $purple-lighter transparent transparent transparent;
  }
}

.pink {
  background: $pink-mid;
  &::after {
    border-color: $pink-mid transparent transparent transparent;
  }
}

</style>
