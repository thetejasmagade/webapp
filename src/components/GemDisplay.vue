<template>
  <div
    id="gem-display"
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
      :class="textColor"
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
      default: 'purple-lighter'
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

<style scoped lang="scss">
@import '@/styles/colors.scss';

#gem-display {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.purple-lighter {
  color: $purple-lighter;
}

.gray-lightest {
  color: $gray-lightest;
}
</style>
