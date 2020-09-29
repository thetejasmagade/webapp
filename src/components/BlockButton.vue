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
    color:{
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
  border-radius: 20px;
  border-width: 0px;
  padding: 10px 30px 10px 30px;
  color: $white;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  cursor: pointer;

  &:disabled{
    cursor: not-allowed;
  }

  &.gray {
    background-color: $gray-dark;

    &:hover{
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.8);
      background-color: $gray-mid;
    }

    &:disabled{
      background-color: $gray-light;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
    }
  }

  &.green {
    background-color: $green-darker;

    &:hover{
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.8);
      background-color: $green-mid;
    }

    &:disabled{
      background-color: $green-light;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
    }
  }

  &.purple {
    background-color: $purple-dark;

    &:hover{
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.8);
      background-color: $purple-lighter;
    }

    &:disabled{
      background-color: $purple-light;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
    }
  }

  &:focus{
    outline: none !important;
  }
}

</style>
