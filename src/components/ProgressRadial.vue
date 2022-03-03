<template>
  <svg :width="cx * 2" :height="cy * 2">
    <circle
      class="text-gray-300"
      :stroke-width="strokeWidth"
      stroke="currentColor"
      fill="transparent"
      :r="radius"
      :cx="cx"
      :cy="cy"
    />
    <circle
      class="text-gold-500"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
      stroke="currentColor"
      fill="transparent"
      :r="radius"
      :cx="cx"
      :cy="cy"
    />
    <text
      class="text-gray-500"
      :x="cx"
      :y="cy"
      stroke="currentColor"
      stroke-width=".6px"
      dy=".3em"
      font-size="12"
      text-anchor="middle"
    >
      {{ normalizedPercent }}%
    </text>
  </svg>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
  computed: {
    normalizedPercent() {
      const maxPercent = 100;
      if (this.percent > maxPercent) {
        return maxPercent;
      }
      return Math.round(this.percent);
    },
    circumference() {
      return this.radius * 2 * Math.PI;
    },
    radius() {
      return 24;
    },
    cy() {
      return this.radius + this.strokeWidth;
    },
    cx() {
      return this.radius + this.strokeWidth;
    },
    strokeWidth() {
      return 5;
    },
    offset() {
      return (
        this.circumference - (this.normalizedPercent / 100) * this.circumference
      );
    },
  },
};
</script>

<style scoped></style>
