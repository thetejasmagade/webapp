<template>
  <div>
    <svg :width="cx * 2" :height="cy * 2">
      <circle
        class="text-gray-700"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        fill="transparent"
        :r="radius"
        :cx="cx"
        :cy="cy"
      />
      <circle
        class="text-blue-500"
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
        v-if="normalizedPercent < 100"
        class="text-blue-300"
        :x="cx"
        :y="cy"
        stroke="currentColor"
        dy=".3em"
        font-size="14"
        text-anchor="middle"
      >
        {{ normalizedPercent }}%
      </text>
      <line
        v-if="normalizedPercent === 100"
        class="text-blue-500"
        stroke="currentColor"
        :x1="cx * 0.65"
        :y1="cy * 1.05"
        :x2="cx * 0.9"
        :y2="cy * 1.3"
        stroke-linecap="round"
        :stroke-width="4"
      />
      <line
        v-if="normalizedPercent === 100"
        class="text-blue-500"
        stroke="currentColor"
        :x1="cx * 0.9"
        :y1="cy * 1.3"
        :x2="cx * 1.45"
        :y2="cy * 0.75"
        stroke-linecap="round"
        :stroke-width="4"
      />
    </svg>
  </div>
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
