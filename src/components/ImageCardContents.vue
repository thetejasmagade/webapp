<template>
  <div class="rounded tracking-wide">
    <div
      v-if="imgSrc"
      class="md:shrink-0 rounded"
      :class="{
        'rounded-b-none': hasSlots,
        'square-container': square,
      }"
    >
      <img
        loading="lazy"
        :src="imgSrc"
        class="rounded object-cover h-full w-full"
        :class="{
          'rounded-b-none': hasSlots,
          absolute: square,
        }"
      />
    </div>
    <div v-if="hasSlots" class="rounded-b overflow-hidden">
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
      default: null,
    },
    square: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    hasSlots() {
      return this.$slots.default;
    },
  },
};
</script>

<style scoped>
.square-container {
  position: relative;
}

.square-container::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
</style>
