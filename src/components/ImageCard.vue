<template>
  <div
    id="card"
    @click="click"
  >
    <div id="img-container">
      <img
        :src="imgSrc"
      >
    </div>
    <div id="body">
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
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  background-color: $gray-darkest;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover{
    box-shadow: 0 16px 32px 0 rgba(0,0,0,0.8);
  }
   
  #img-container {
    img {
      width: 100%;
    }
  }

  #body {
    padding: 10px;
    flex: 1;
  }
}
</style>
