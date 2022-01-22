<template>
  <div>
    <div class="w-full bg-gray-200 h-full">
      <div
        class="bg-gold-400 h-2"
        :style="styleWidth"
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
      default: 0
    }
  },
  computed: {
    styleWidth() {
      let amountFilled = `width: ${this.percentComplete}%`;
      return amountFilled;
    }
  }
};

</script>
