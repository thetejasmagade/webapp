<template>
  <div
    ref="container"
  >
    <svg
      class="step-progress"
      :height="circleHeight"
      width="100%"
    >
      <line
        v-for="(line, i) in lines"
        :key="`line${i}`"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :style="line.style"
      />
      <circle
        v-for="(circle, i) in circles"
        :key="`circle${i}`"
        :cx="circle.cx"
        :cy="circle.cy"
        :r="circle.r"
        :stroke="circle.stroke"
        :stroke-width="circle.stroke_width"
        :fill="circle.fill"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    circlesTotal: {
      type: Number,
      required: true
    },
    circlesProgress: {
      type: Number,
      required: true
    },
    fillColor: {
      type: String,
      required: false,
      default: '#D8A22E'
    },
    emptyColor: {
      type: String,
      required: false,
      default: '#949494'
    }
  },
  data() {
    return {
      circleRadius: 5,
      width: 0
    };
  },
  computed: {
    circleHeight() {
      return this.circleRadius * 2;
    },
    circles() {
      let circles = [];
      for (let i = 0; i < this.circlesProgress; i++) {
        circles.push({
          cx: this.circleRadius + this.spacing() * i,
          cy: this.circleRadius,
          r: this.circleRadius - 1,
          stroke: this.fillColor,
          stroke_width: 1,
          fill: this.fillColor
        });
      }
      for (let i = 0; i < this.empty(); i++) {
        circles.push({
          cx:
            this.circleRadius +
            this.spacing() * this.circlesProgress +
            this.spacing() * i,
          cy: this.circleRadius,
          r: this.circleRadius - 1,
          stroke: this.emptyColor,
          stroke_width: 1,
          fill: this.emptyColor
        });
      }
      return circles;
    },
    lines() {
      const linesFilled = this.circlesProgress - 1;
      const linesEmpty = this.empty() + 1;
      let lines = [];
      for (let i = 0; i < linesFilled; i++) {
        lines.push({
          x1: this.circleRadius + this.spacing() * i,
          y1: this.circleRadius,
          x2: this.circleRadius + this.spacing() * (i + 1),
          y2: this.circleRadius,
          style: `stroke:${this.fillColor};stroke-width:2`
        });
      }
      for (let i = 0; i < linesEmpty; i++) {
        lines.push({
          x1:
            this.circleRadius +
            linesFilled * this.spacing() +
            this.spacing() * i,
          y1: this.circleRadius,
          x2:
            this.circleRadius +
            linesFilled * this.spacing() +
            this.spacing() * (i + 1),
          y2: this.circleRadius,
          style: `stroke:${this.emptyColor};stroke-width:2`
        });
      }
      return lines;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.width = this.$refs.container.clientWidth;
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    empty() {
      return this.circlesTotal - this.circlesProgress;
    },
    spacing() {
      return (
        (this.width - this.circleRadius * 2) / (this.circlesProgress + this.empty() - 1)
      );
    },
    handleResize() {
      if (this.$refs.container) {
        this.width = this.$refs.container.clientWidth;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  margin: auto;
  display: block;
}
</style>
