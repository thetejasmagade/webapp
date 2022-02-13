<template>
  <div
    class="bg-white shadow-lg rounded mb-6 tracking-wide"
  >
    <div
      class="md:shrink-0 rounded"
      :class="{
        'bg-white': click,
        'rounded-b-none': hasSlots
      }"
    >
      <img
        v-if="imgSrc"
        loading="lazy"
        :src="imgSrc"
        class="rounded object-cover h-full w-full"
        :class="{
          'cursor-pointer': click,
          'hover:opacity-50': click,
          'rounded-b-none': hasSlots
        }"
        @click="onClick"
      >
    </div>
    <div
      v-if="hasSlots"
      class="px-4 py-2 mt-2"
    >
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
  computed: {
    hasSlots(){
      return this.$slots.default;
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
