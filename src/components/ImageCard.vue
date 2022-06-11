<template>
  <div class="rounded tracking-wide">
    <div
      v-if="imgSrc"
      class="md:shrink-0 rounded"
      :class="{
        'rounded-b-none': hasSlots,
      }"
    >
      <img
        loading="lazy"
        :src="imgSrc"
        class="rounded object-cover h-full w-full"
        :class="{
          'rounded-b-none': hasSlots,
        }"
      />
    </div>
    <div v-if="hasSlots">
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
  },
  computed: {
    hasSlots() {
      return this.$slots.default;
    },
  },
};
</script>

<style scoped></style>
