<template>
  <div
    id="gem-display"
  >
    <span
      v-if="cost"
      :style="{'font-size': `${fontSize}px`}"
    >
      {{ cost }}
    </span>
    <img
      :width="imgWidth"
      src="../img/gem-256.png"
    >
  </div>
</template>

<script>
export default {
  props: { 
    cost: {
      type: Number,
      required: false,
      default: null
    },
    size: {
      type: Number,
      required: false,
      default: 1
    }
  },
  computed:{
    fontSize(){
      if (this.size === 1){
        return 24;
      }
      if (this.size === 2){
        return 32;
      }
      return 24;
    },
    imgWidth(){
      if (this.size === 1){
        return 50;
      }
      if (this.size === 2){
        return 75;
      }
      return 50;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#gem-display {
  color: $purple-lighter;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 10px;
  }
}
</style>
