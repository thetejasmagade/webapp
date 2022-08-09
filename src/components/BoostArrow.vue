<template>
  <div>
    <Tooltip
      v-if="multiplier"
      :text="`XP Boost ${multiplier}x
${durationRemainingString}`"
      position="bottom"
      color="green"
    >
      <div class="flex justify-center items-center w-10 h-10">
        <div class="arrow-slide1">
          <div class="arrow"></div>
        </div>
        <div class="arrow-slide2">
          <div class="arrow"></div>
        </div>
        <div class="arrow-slide3">
          <div class="arrow"></div>
        </div>
      </div>
    </Tooltip>
  </div>
</template>

<script>
import Tooltip from "@/components/Tooltip.vue";
import { getActiveUserBoosts } from "@/lib/cloudClient.js";
import { computed, onMounted, reactive } from "@vue/runtime-core";

export default {
  components: {
    Tooltip,
  },
  props: {},
  setup() {
    const state = reactive({
      boosts: null,
      msRemaining: null,
    });

    const loadBoosts = async () => {
      try {
        const boosts = await getActiveUserBoosts();
        state.boosts = boosts;
        const currentTime = new Date();
        let smallestDuration = Number.POSITIVE_INFINITY;
        for (const boost of state.boosts) {
          const delta = new Date(boost.ExpiresAt) - currentTime;
          if (delta < smallestDuration) {
            smallestDuration = delta;
          }
        }
        state.msRemaining = smallestDuration;
        setInterval(() => {
          state.msRemaining -= 1000;
        }, 1000);
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(() => {
      loadBoosts();
    });

    const multiplier = computed(() => {
      if (!state.boosts) {
        return null;
      }
      let mult = 1;
      for (const boost of state.boosts) {
        mult *= boost.XPMultiplier;
      }
      if (mult === 1) {
        return null;
      }
      return mult;
    });

    const durationRemainingString = computed(() => {
      let s = state.msRemaining;
      const ms = s % 1000;
      s = (s - ms) / 1000;
      const secs = s % 60;
      s = (s - secs) / 60;
      const mins = s % 60;
      const hrs = (s - mins) / 60;
      return hrs + ":" + mins + ":" + secs;
    });

    return {
      multiplier,
      durationRemainingString,
    };
  },
};
</script>

<style scoped>
.arrow {
  width: 25px;
  height: 25px;
  border: 5px solid;
  border-color: var(--green-600) transparent transparent var(--green-600);
  transform: rotate(45deg);
  border-radius: 4px;
}

.arrow-slide1 {
  position: absolute;
  animation: slide1 3s linear infinite;
}

.arrow-slide2 {
  position: absolute;
  animation: slide2 3s linear infinite;
}

.arrow-slide3 {
  position: absolute;
  animation: slide3 3s linear infinite;
}

@keyframes slide1 {
  0% {
    opacity: 1;
    transform: translateY(18px);
  }
  66% {
    opacity: 1;
    transform: translateY(0px);
  }
  81% {
    opacity: 0;
    transform: translateY(0px);
  }
  82% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(18px);
  }
}

@keyframes slide2 {
  0% {
    opacity: 1;
    transform: translateY(9px);
  }
  33% {
    opacity: 1;
    transform: translateY(0px);
  }
  48% {
    opacity: 0;
    transform: translateY(0px);
  }
  49% {
    opacity: 0;
    transform: translateY(18px);
  }
  66% {
    opacity: 1;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(9px);
  }
}

@keyframes slide3 {
  0% {
    opacity: 1;
    transform: translateY(0px);
  }
  15% {
    opacity: 0;
    transform: translateY(0px);
  }
  16% {
    opacity: 0;
    transform: translateY(18px);
  }
  33% {
    opacity: 1;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
