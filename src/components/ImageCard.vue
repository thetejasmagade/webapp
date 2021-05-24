<template>
  <div
    class="bg-white shadow-2xl rounded mb-6 tracking-wide"
  >
    <div class="md:flex-shrink-0">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        class="w-full h-64 rounded rounded-b-none object-cover h-full w-full"
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
    }
  }
};
</script>

<style scoped>

</style>
