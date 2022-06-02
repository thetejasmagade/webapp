<template>
  <div class="p-4 flex justify-center items-center h-full">
    <Section :title="title" :subtitle="subtitle" class="w-full">
      <div class="flex flex-col items-center px-4 py-8">
        <div class="flex flex-row items-center justify-center w-full">
          <div class="w-full p-4">
            <img
              loading="lazy"
              :src="
                achievementEarned.AchievementImageGifURL
                  ? achievementEarned.AchievementImageGifURL
                  : achievementEarned.AchievementImageURL
              "
            />
          </div>

          <LootBox :on-done="claim" />
        </div>
        <BlockButton
          :click="onClickDone"
          :disabled="!claimed"
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
import LootBox from "@/components/LootBox.vue";
import { loadBalance } from "@/lib/cloudStore.js";

import { markAchievementSeen } from "@/lib/cloudClient.js";
import { computed, onMounted, reactive, toRefs } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  components: {
    BlockButton,
    Section,
    LootBox,
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
      await loadBalance(store.commit);
    };

    const title = computed(() => {
      if (state.claimed) {
        return `You earned ${achievementEarned.value?.AchievementGemsEarned} Gems!`;
      }
      return "Achievement unlocked!";
    });

    const subtitle = computed(() => {
      if (state.claimed) {
        return "Congratulations!";
      }
      return `${achievementEarned.value?.AchievementTitle} - ${achievementEarned.value?.AchievementDescription}`;
    });

    const onClickDone = () => {
      onDone.value();
      state.claimed = false;
    };

    return {
      ...toRefs(state),
      onClickDone,
      claim,
      title,
      subtitle,
    };
  },
};
</script>

<style scoped></style>
