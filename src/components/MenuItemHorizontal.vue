<template>
  <div>
    <div
      id="item"
      class="hover:text-gray-800"
      :class="{
        'text-gold-500': current && color === 'gold',
        'text-red-500': current && color === 'red',
        'hover:text-gray-800': current,
        'hover:bg-red-500': color === 'red',
        'hover:bg-gold-500': color === 'gold',
      }"
      @click="click"
    >
      <FontAwesomeIcon
        :icon="['fas', icon]" 
        class="icon"
      />
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  props: { 
    click:{
      type: Function,
      required: false,
      default: () => {}
    },
    icon:{
      type: String,
      required: true
    },
    current:{
      type: Boolean,
      required: false,
      default: false
    },
    color:{
      type: String,
      required: false,
      default: 'gold'
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#item {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 5px;

  &:hover{
    cursor: pointer;

    span {
      margin-left: 25px;
    }
  }

  .icon {
    margin: 0 15px 0 15px;
  }
}
</style>
