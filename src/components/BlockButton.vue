<template>
  <button
    type="submit"
    :class="color"
    :disabled="disabled"
    @click.stop="click"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: { 
    click:{
      type: Function,
      required: false,
      default: () =>{}
    },
    color: {
      type: String,
      required: false,
      default: 'purple'
    },
    disabled:{
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

button {
  border-radius: 5px;
  border-width: 0px;
  padding: 8px 20px 8px 20px;
  color: $white;
  cursor: pointer;

  &:disabled{
    cursor: not-allowed;
  }

  &.gray {
    background-color: $gray-dark;

    &:hover{
      background-color: $gray-mid;
    }

    &:disabled{
      background-color: $gray-light;
    }
  }

  &.gray-light {
    background-color: $gray-light;

    &:hover{
      background-color: $gray-lighter;
    }

    &:disabled{
      background-color: $gray-lighter;
    }
  }

  &.green {
    background-color: $green-darker;

    &:hover{
      background-color: $green-mid;
    }

    &:disabled{
      background-color: $green-light;
    }
  }

  &.purple {
    background-color: $purple-dark;

    &:hover{
      background-color: $purple-lighter;
    }

    &:disabled{
      background-color: $purple-lighter;
    }
  }

  &.gold {
    background-color: $gold-dark;

    &:hover{
      background-color: $gold-light;
    }

    &:disabled{
      background-color: $gold-light;
    }
  }

  &.purple-light {
    background-color: $purple-light;

    &:hover{
      background-color: $purple-lighter;
    }

    &:disabled{
      background-color: $purple-lighter;
    }
  }

  &:focus{
    outline: none !important;
  }
}

</style>
