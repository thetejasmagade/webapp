<template>
  <div>
    <router-link
      v-if="link"
      :to="link"
      class="rounded tracking-wide hover:opacity-50 cursor-pointer"
    >
      <ImageCardContents :img-src="imgSrc" :square="square">
        <slot />
      </ImageCardContents>
    </router-link>

    <ImageCardContents v-else :img-src="imgSrc" :square="square">
      <slot />
    </ImageCardContents>
  </div>
</template>

<script>
import ImageCardContents from "@/components/ImageCardContents.vue";

export default {
  components: {
    ImageCardContents,
  },
  props: {
    imgSrc: {
      type: String,
      required: false,
      default: null,
    },
    link: {
      type: Object,
      required: false,
      default: null,
    },
    square: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped></style>
