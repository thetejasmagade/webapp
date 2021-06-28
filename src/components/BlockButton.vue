<template>
  <button
    type="submit"
    :class="colors"
    class="
      disabled:cursor-not-allowed
      focus:outline-none
      text-white
      py-2 px-4 rounded
    "
    :disabled="disabled"
    :style="{'cursor': disabled ? 'not-allowed' : 'pointer'}"
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
  },
  computed: {
    colors(){
      return {
        'bg-gray-500': this.color === 'gray',
        'hover:bg-gray-700': this.color === 'gray',
        'disabled:bg-gray-500': this.color === 'gray',

        'bg-gray-400': this.color === 'gray-light',
        'hover:bg-gray-300': this.color === 'gray-light',
        'disabled:bg-gray-300': this.color === 'gray-light',

        'bg-green-700': this.color === 'green',
        'hover:bg-green-800': this.color === 'green',
        'disabled:bg-green-600': this.color === 'green',

        'bg-blue-500': this.color === 'purple',
        'hover:bg-blue-600': this.color === 'purple',
        'disabled:bg-blue-400': this.color === 'purple',

        'bg-blue-400': this.color === 'purple-light',
        'hover:bg-blue-300': this.color === 'purple-light',
        'disabled:bg-blue-300': this.color === 'purple-light',

        'bg-gold-500': this.color === 'gold',
        'hover:bg-gold-600': this.color === 'gold',
        'disabled:bg-gold-400': this.color === 'gold',

        'bg-red-500': this.color === 'red',
        'hover:bg-red-600': this.color === 'red',
        'disabled:bg-red-400': this.color === 'red'
      };
    }
  }
};
</script>

<style scoped>

</style>
