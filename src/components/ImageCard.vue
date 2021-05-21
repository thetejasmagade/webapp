<template>
  <div
    class="image-card light column"
    :class="{
      'clickable': click,
    }"
    @click="safeClick"
  >
    <div>
      <img
        v-if="imgSrc"
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
      required: false,
      default: null
    },
    click: {
      type: Function,
      required: false,
      default: null
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
  flex-direction: column;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: .5em .5em 0 0;
  }

  &.light{
    border: solid 1px $gray-lighter;
    background-color: $white;
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
