<template>
  <div
    ref="container"
  >
    <svg
      class="step-progress"
      :height="lineHeight"
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
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    progress: {
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
      width: 0,
      lineHeight: 8
    };
  },
  computed: {
    lines() {
      const linesFilled = this.progress - 1;
      const linesEmpty = this.empty() + 1;
      let lines = [];
      for (let i = 0; i < linesFilled; i++) {
        lines.push({
          x1:  this.spacing() * i,
          y1: 0,
          x2: this.spacing() * (i + 1),
          y2: 0,
          style: `stroke:${this.fillColor};stroke-width:${this.lineHeight}`
        });
      }
      for (let i = 0; i < linesEmpty; i++) {
        lines.push({
          x1:
            linesFilled * this.spacing() +
            this.spacing() * i,
          y1: 0,
          x2:
            linesFilled * this.spacing() +
            this.spacing() * (i + 1),
          y2: 0,
          style: `stroke:${this.emptyColor};stroke-width:${this.lineHeight}`
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
      return this.total - this.progress;
    },
    spacing() {
      return (
        this.width / (this.progress + this.empty() - 1)
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
