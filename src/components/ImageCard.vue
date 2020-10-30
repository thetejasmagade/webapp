<template>
  <div
    id="card"
    :class="{'clickable': click, 'dark': theme === 'dark', 'light': theme === 'light'}"
    @click="safeClick"
  >
    <img
      :src="imgSrc"
    >
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

#card {
  transition: 0.3s;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: .5em;
  overflow: hidden;

  &.dark{
    background-color: $gray-darkest;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);

    &:hover{
      box-shadow: 0 16px 32px 0 rgba(0,0,0,0.8);
    }
  }

  &.light{
    border: solid 1px $gray-lighter;
    background-color: $gray-lightest;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);

    &:hover{
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.5);
    }
  }

  &.clickable{
    cursor: pointer;
  }
   
  img {
    width: 100%;
  }

  .body {
    flex: 1;
  }
}
</style>
