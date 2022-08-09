<template>
  <div>
    <div v-if="msRemaining > 0">
      <Tooltip
        :text="`${multiplier}x Boost
${durationRemainingString}`"
        position="right"
        color="blue"
        class="h-14 relative"
      >
        <Radial
          class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 fade1"
          :from-percent="getPercentXPFromUser(oldUserState)"
          :to-percent="toPercent"
          :duration="2000"
          :level="level"
          :radius="20"
          :stroke-width="7"
          :on-animation-complete="onAnimationComplete"
          :on-rollover="onRollover"
        />
        <BoostArrow
          :boosts="boosts"
          class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 fade2"
        />
      </Tooltip>
    </div>
    <div v-else class="h-14 relative">
      <Radial
        class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
        :from-percent="getPercentXPFromUser(oldUserState)"
        :to-percent="toPercent"
        :duration="2000"
        :level="level"
        :radius="20"
        :stroke-width="7"
        :on-animation-complete="onAnimationComplete"
        :on-rollover="onRollover"
      />
    </div>
  </div>
</template>

<script>
import Radial from "@/components/Radial.vue";
import BoostArrow from "@/components/BoostArrow.vue";
import Tooltip from "@/components/Tooltip.vue";

import { getActiveUserBoosts } from "@/lib/cloudClient.js";
import { loadUser } from "@/lib/cloudStore.js";
import { useStore } from "vuex";

import { computed, reactive, toRefs, watchEffect, onMounted } from "vue";

export default {
  components: {
    Radial,
    BoostArrow,
    Tooltip,
  },
  setup() {
    const state = reactive({
      level: null,
      toPercent: null,
      newUserStates: [],
      oldUserState: null,
      boosts: null,
      msRemaining: 0,
    });
    const store = useStore();

    const onRollover = () => {
      state.level++;
    };
    const getPercentXPFromUser = (user) => {
      if (!user) {
        return 0;
      }
      return Math.round((user.XPForLevel / user.XPTotalForLevel) * 100);
    };

    const getMSRemaining = (boosts) => {
      if (!boosts || boosts.length === 0) {
        return 0;
      }
      const currentTime = new Date();
      let smallestDuration = Number.POSITIVE_INFINITY;
      for (const boost of boosts) {
        const delta = new Date(boost.ExpiresAt) - currentTime;
        if (delta < smallestDuration) {
          smallestDuration = delta;
        }
      }
      return smallestDuration;
    };

    const loadBoosts = async () => {
      try {
        const boosts = await getActiveUserBoosts();
        state.boosts = boosts;
        state.msRemaining = getMSRemaining(boosts);
      } catch (err) {
        console.log(err);
      }
    };
    const newUserState = computed(() => {
      if (state.newUserStates.length === 0) {
        return null;
      }
      return state.newUserStates[0];
    });
    const onAnimationComplete = () => {
      if (state.newUserStates.length === 0) {
        return;
      }
      state.oldUserState = state.newUserStates.shift();
      state.level = state.oldUserState?.Level;
      state.toPercent = getPercentXPFromUser(state.oldUserState);
    };
    onMounted(async () => {
      loadUser(store.commit);
      loadBoosts();
    });
    watchEffect(() => {
      if (!state.oldUserState) {
        state.oldUserState = store.getters.getUser;
        state.toPercent = getPercentXPFromUser(state.oldUserState);
        state.level = state.oldUserState?.Level;
        return;
      }
      if (
        getPercentXPFromUser(state.oldUserState) ===
          getPercentXPFromUser(store.getters.getUser) &&
        state.oldUserState?.Level === store.getters.getUser?.Level
      ) {
        return;
      }
      state.newUserStates.push(store.getters.getUser);
    });
    watchEffect(() => {
      if (state.toPercent !== null) {
        return;
      }
      state.toPercent = getPercentXPFromUser(state.oldUserState);
    });
    watchEffect(async () => {
      if (!newUserState.value || !state.oldUserState) {
        return;
      }
      const levelUps = newUserState.value.Level - state.oldUserState.Level;
      state.toPercent =
        getPercentXPFromUser(newUserState.value) + levelUps * 100;
    });

    onMounted(() => {
      setInterval(() => {
        state.msRemaining -= 1000;
      }, 1000);
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
      ...toRefs(state),
      onRollover,
      onAnimationComplete,
      getPercentXPFromUser,
      multiplier,
      durationRemainingString,
    };
  },
};
</script>

<style scoped>
.fade1 {
  animation: fade1 5s linear infinite;
}

.fade2 {
  animation: fade2 5s linear infinite;
}

@keyframes fade1 {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
