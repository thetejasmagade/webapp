<template>
  <div
    class="image-card light"
    :class="{
      'clickable': click,
      'column': direction === 'column',
      'row': direction === 'row',
    }"
    @click="safeClick"
  >
    <div>
      <img
        :style="{'width': imgWidth, 'min-height': imgMinHeight}"
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
    direction: {
      type: String,
      required: false,
      default: 'column'
    },
    imgWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    imgMinHeight: {
      type: String,
      required: false,
      default: '100%'
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

  img {
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  &.column {
    flex-direction: column;

    img {
      border-radius: .5em .5em 0 0;
    }
  }

  &.row {
    flex-direction: row;
    @media (max-width: $mobile-size) {
      flex-direction: column;
    }

    img {
      border-radius: .5em 0 0 .5em;
    }
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
