<template>
  <div>
    <div class="w-full bg-gray-200 h-full">
      <div
        class="bg-gold-400 h-2 transition"
        :style="`width: ${styleWidth}%; transition: width 2s;`"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percentComplete: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    styleWidth() {
      if (this.percentComplete > 100) {
        return 100;
      }
      return this.percentComplete;
    },
  },
};
</script>
