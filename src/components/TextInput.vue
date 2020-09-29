<template>
  <input
    :placeholder="placeholder"
    :type="type"
    :value="value"
    @input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
  props: { 
    value:{
      type: String,
      required: false,
      default: null
    },
    placeholder:{
      type: String,
      required: false,
      default: null
    },
    type:{
      type: String,
      required: false,
      default: 'text'
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

input {
  outline: 0;
  border-width: 0 0 1px 0;
  border-color: $gray-lighter;
  background-color: transparent;
  padding: 0 0 2px 0;

  &:focus{
    outline: none !important;
    border-color: $purple-mid;
  }
}
</style>
