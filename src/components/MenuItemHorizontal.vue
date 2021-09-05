<template>
  <div>
    <div
      class="hover:text-gray-200 cursor-pointer rounded-lg text-lg h-12 flex flex-col justify-center items-center"
      :class="{
        'border': current,
        'border-gold-500': color === 'gold',
        'border-red-500': color === 'red',
        'hover:bg-red-500': color === 'red',
        'hover:bg-gold-500': color === 'gold',
      }"
      @click="click"
    >
      <FontAwesomeIcon
        :icon="['fas', icon]" 
        class="mx-2"
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

<style scoped>
</style>
