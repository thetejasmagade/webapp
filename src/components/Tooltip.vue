<template>
  <div class="tooltip-box">
    <div>
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
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.tooltip-box { 
  position: relative;

  .tooltip { 
    color: $white;
    text-align: center;
    padding: 5px 0;
    border-radius: 2px;
    font-family: $default-font-family;
    width: 120px;

    &.top {
      bottom: calc(100% + 5px);
      left: 50%;
      margin-left: -60px;
    }

    &.right {
      top: 50%;
      left: calc(100% + 5px);
      transform: translate(0, -50%);
    }

    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s linear;
    transition-delay: .4s;

    position: absolute;
    z-index: 1;

    @media (max-width: $mobile-size) {
      display: none;
    }
  }

  &:hover{
    .tooltip {
      visibility: visible;
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
