<template>
  <div
    class="image-card"
    :class="{
      'clickable': click,
      'dark': theme === 'dark',
      'light': theme === 'light',
      'column': direction === 'column',
      'row': direction === 'row',
    }"
    @click="safeClick"
  >
    <div>
      <img
        :src="imgSrc"
      >
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    imgSrc: {
      type: String,
      required: true
    },
    click: {
      type: Function,
      required: false,
      default: null
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    direction: {
      type: String,
      required: false,
      default: 'column'
    }
  },
  methods: {
    safeClick(){
      if (this.click) {
        this.click();
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.image-card {
  transition: 0.3s;
  text-align: center;
  display: flex;
  justify-content: space-between;
  border-radius: .5em;
  overflow: hidden;

  &.column {
    flex-direction: column;
  }

  &.row {
    flex-direction: row;
    @media (max-width: $mobile-size) {
      flex-direction: column;
    }
  }

  &.dark{
    background-color: $gray-darkest;
  }

  &.light{
    border: solid 1px $gray-lighter;
    background-color: $gray-lightest;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  &.clickable{
    cursor: pointer;
    transition: all .2s ease-in-out; 
    &:hover{
      transform: scale(1.05);
    }
  }

  .body {
    flex: 1;
  }
}
</style>
