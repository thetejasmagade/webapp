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
        </div>
        <BlockButton :click="onClickDone" color="blue">
          Continue course
        </BlockButton>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";

import { markAchievementSeen } from "@/lib/cloudClient.js";
import { computed, toRefs, onMounted } from "@vue/runtime-core";

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

    onMounted(() => {
      try {
        markAchievementSeen(achievementEarned.value?.AchievementUUID);
      } catch (err) {
        console.log(err);
      }
    });

    const title = computed(() => {
      return "Achievement unlocked!";
    });

    const subtitle = computed(() => {
      return `${achievementEarned.value?.AchievementTitle} - ${achievementEarned.value?.AchievementDescription}`;
    });

    const onClickDone = () => {
      onDone.value();
    };

    return {
      onClickDone,
      title,
      subtitle,
    };
  },
};
</script>

<style scoped></style>
