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
        class="text-blue-400"
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
        v-if="!level && curPercent < 100"
        class="text-blue-300"
        :x="cx"
        :y="cy"
        stroke="currentColor"
        fill="currentColor"
        dy=".3em"
        :font-size="radius * 0.7"
        text-anchor="middle"
      >
        {{ Math.round(curPercent) }}%
      </text>
      <text
        v-if="level"
        class="text-blue-300"
        :x="cx"
        :y="cy"
        stroke="currentColor"
        fill="currentColor"
        dy=".3em"
        :font-size="radius * 0.7"
        text-anchor="middle"
      >
        {{ level }}
      </text>
      <line
        v-if="checkmark && curPercent === 100 && !level"
        class="text-blue-400"
        stroke="currentColor"
        fill="currentColor"
        :x1="cx * 0.65"
        :y1="cy * 1.05"
        :x2="cx * 0.9"
        :y2="cy * 1.3"
        stroke-linecap="round"
        :stroke-width="4"
      />
      <line
        v-if="checkmark && curPercent === 100 && !level"
        class="text-blue-400"
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
import { computed, reactive, toRefs, watchEffect } from "vue";
export default {
  props: {
    fromPercent: {
      type: Number,
      required: false,
      default: 0,
    },
    toPercent: {
      type: Number,
      required: false,
      default: 0,
    },
    radius: {
      type: Number,
      required: false,
      default: 24,
    },
    strokeWidth: {
      type: Number,
      required: false,
      default: 5,
    },
    duration: {
      type: Number,
      required: false,
      default: 1000,
    },
    checkmark: {
      type: Boolean,
      required: false,
      default: null,
    },
    level: {
      type: Number,
      required: false,
      default: null,
    },
    onRollover: {
      type: Function,
      required: false,
      default: () => {},
    },
    onAnimationComplete: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  setup(props) {
    const state = reactive({
      curPercent: props.fromPercent,
    });
    const cy = computed(() => {
      return props.radius + props.strokeWidth;
    });
    const cx = computed(() => {
      return props.radius + props.strokeWidth;
    });
    const circumference = computed(() => {
      return props.radius * 2 * Math.PI;
    });
    const offset = computed(() => {
      return (
        circumference.value - (state.curPercent / 100) * circumference.value
      );
    });

    const parametricBlend = (t) => {
      const sqt = t * t;
      return sqt / (2.0 * (sqt - t) + 1.0);
    };
    watchEffect(async () => {
      const percentDelta = props.toPercent - props.fromPercent;
      const startMs = Date.now();
      const totalNumRollovers = Math.floor(props.toPercent / 100);
      let numRollovers = 0;
      const step = () => {
        const msSinceStart = Date.now() - startMs;
        const parametricPercent = parametricBlend(
          msSinceStart / props.duration
        );
        const threshold = (numRollovers + 1) * 100;
        const delta = props.fromPercent + parametricPercent * percentDelta;
        if (delta > threshold && totalNumRollovers >= numRollovers) {
          props.onRollover();
          numRollovers++;
        }
        state.curPercent = delta % 100;
        if (msSinceStart < props.duration) {
          if (props.toPercent === props.fromPercent) {
            return;
          }
          window.requestAnimationFrame(step);
        } else {
          state.curPercent =
            props.toPercent !== 0 && props.toPercent % 100 === 0
              ? 100
              : props.toPercent % 100;
          props.onAnimationComplete();
        }
      };
      step();
    });
    return {
      ...toRefs(state),
      cy,
      cx,
      circumference,
      offset,
    };
  },
};
</script>
