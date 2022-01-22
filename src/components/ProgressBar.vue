<template>
  <div>
    <div class="w-full bg-gray-200 h-full">
      <div
        class="bg-gold-400 h-2"
        :style="setProgress"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressFilled: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    setProgress() {
      let amountFilled = `width: ${this.progressFilled}%`;
      return amountFilled;
    }
  }
};

</script>
