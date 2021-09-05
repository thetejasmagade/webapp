<template>
  <div
    class="bg-white shadow-lg rounded mb-6 tracking-wide"
  >
    <div
      class="md:flex-shrink-0 rounded rounded-b-none"
      :class="{
        'bg-black': click,
      }"
    >
      <img
        v-if="imgSrc"
        :src="imgSrc"
        class="rounded rounded-b-none object-cover h-full w-full"
        :class="{
          'cursor-pointer': click,
          'hover:opacity-90': click
        }"
        @click="onClick"
      >
    </div>
    <div class="px-4 py-2 mt-2">
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
    onClick(){
      if (this.click){
        this.click();
      }
    }
  }
};
</script>

<style scoped>

</style>
