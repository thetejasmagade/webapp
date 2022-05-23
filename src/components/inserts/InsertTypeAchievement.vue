<template>
  <div class="p-4 flex justify-center items-center h-full">
    <Section
      title="Achievement unlocked!"
      subtitle="Great job, keep going"
      class="w-full"
    >
      <div v-if="!claimed" class="flex flex-col items-center p-4">
        <h2 class="text-blue-400 text-2xl font-bold">
          {{ achievementEarned?.AchievementTitle }}
        </h2>
        <img
          loading="lazy"
          :src="
            achievementEarned.AchievementImageGifURL
              ? achievementEarned.AchievementImageGifURL
              : achievementEarned.AchievementImageURL
          "
          class="w-60"
        />
        <h3 class="text-gray-200 text-xl mb-8">
          {{ achievementEarned?.AchievementDescription }}
        </h3>
        <BlockButton :click="claim" color="blue">
          Claim Gem Reward
        </BlockButton>
      </div>
      <div v-else class="flex flex-col items-center p-4">
        <img loading="lazy" src="@/img/gem-5.png" class="w-60" />
        <div class="mb-4">
          <h2 class="text-blue-400 text-xl">Congratulations!</h2>
        </div>

        <div class="mb-8">
          <h3 class="text-blue-400 text-3xl font-bold">
            You earned {{ gemNum }} Gems
          </h3>
        </div>
        <BlockButton
          :click="onClickDone"
          :disabled="spinning"
          :color="spinning ? 'gray' : 'blue'"
        >
          Continue course
        </BlockButton>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import { sleep } from "@/lib/sleep.js";
import { loadBalance } from "@/lib/cloudStore.js";

import { markAchievementSeen } from "@/lib/cloudClient.js";
import { onMounted, reactive, toRefs } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  components: {
    BlockButton,
    Section,
  },
  props: {
    achievementEarned: {
      type: Object,
      required: true,
    },
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { achievementEarned, onDone } = toRefs(props);

    const state = reactive({
      claimed: false,
      spinning: false,
      gemNum: 0,
    });

    const store = useStore();

    onMounted(() => {
      try {
        markAchievementSeen(achievementEarned.value?.AchievementUUID);
      } catch (err) {
        console.log(err);
      }
    });

    const claim = async () => {
      state.claimed = true;
      state.spinning = true;
      let nextChangeCount = 0;
      const totalCentiSec = 250;
      for (let centiSec = 0; centiSec < totalCentiSec; centiSec++) {
        await sleep(10);
        const nextChangeAt = Math.floor(centiSec / 10) + 1;
        if (nextChangeCount === nextChangeAt) {
          if (nextChangeAt + centiSec >= totalCentiSec) {
            state.gemNum = achievementEarned.value?.AchievementGemsEarned;
          } else {
            state.gemNum = Math.floor(
              Math.random() *
                (achievementEarned.value?.AchievementGemsEarned * 2)
            );
          }
          nextChangeCount = 0;
        }
        nextChangeCount++;
      }
      state.gemNum = achievementEarned.value?.AchievementGemsEarned;
      state.spinning = false;
      await loadBalance(store.commit);
    };

    const onClickDone = () => {
      onDone.value();
      state.claimed = false;
    };

    return {
      ...toRefs(state),
      onClickDone,
      claim,
    };
  },
};
</script>

<style scoped></style>
