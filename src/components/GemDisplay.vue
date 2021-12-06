<template>
  <div
    class="
      flex
      justify-center
      items-center
    "
    :style="{flexDirection: vertical ? 'column' : 'row'}"
  >
    <img
      :width="imgWidth"
      src="../img/gem-3-150.png"
      :style="{'margin': `${margin}px`}"
    >
    <span
      v-if="text"
      :style="{'font-size': `${fontSize}px`}"
      :class="{
        'text-blue-500': textColor === 'blue-lighter',
        'text-gray-200': textColor === 'gray-lightest',
      }"
    >
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: { 
    text: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: Number,
      required: false,
      default: 1
    },
    vertical: {
      type: Boolean,
      required: false,
      default: false
    },
    textColor: {
      type: String,
      required: false,
      default: 'blue-lighter'
    }
  },
  computed:{
    fontSize(){
      if (this.size === .5){
        return 18;
      }
      if (this.size === 1){
        return 24;
      }
      if (this.size === 2){
        return 32;
      }
      return 24;
    },
    margin(){
      if (this.size === .5){
        return -4;
      }
      if (this.size === 1){
        return -4;
      }
      if (this.size === 2){
        return 4;
      }
      return -4;
    },
    imgWidth(){
      if (this.size === .5){
        return 40;
      }
      if (this.size === 1){
        return 40;
      }
      if (this.size === 2){
        return 60;
      }
      return 50;
    }
  }
};
</script>

<style scoped>

</style>
