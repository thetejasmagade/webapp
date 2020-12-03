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
        :x1="lineFull.x1"
        :y1="lineFull.y1"
        :x2="lineFull.x2"
        :y2="lineFull.y2"
        :style="`stroke:${fillColor};stroke-width:${lineHeight}`"
      />
      <line
        :x1="lineEmpty.x1"
        :y1="lineEmpty.y1"
        :x2="lineEmpty.x2"
        :y2="lineEmpty.y2"
        :style="`stroke:${emptyColor};stroke-width:${lineHeight}`"
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
    lineFull(){
      return {
        x1:  0,
        y1: 0,
        x2: this.width * (this.progress / this.total) -1,
        y2: 0
      };      
    },
    lineEmpty(){
      return {
        x1:  this.width * (this.progress / this.total) +1,
        y1: 0,
        x2: this.width,
        y2: 0
      }; 
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
