<template>
  <div class="p-4 flex justify-center items-center h-full">
    <Section :title="title" :subtitle="subtitle" class="w-full">
      <div class="flex flex-col items-center p-4">
        <p
          v-if="achievementEarned.AchievementCategory === 'engagement'"
          class="mb-4"
        >
          #100DaysOfCode is a popular Twitter challenge. You can
          <a
            href="https://www.100daysofcode.com/"
            target="_blank"
            class="text-blue-400 hover:text-blue-300 underline"
            >read the official rules here,</a
          >
          but in a nutshell, to complete the challenge you need to code every
          day for 100 days, and tweet about it daily using the
          <b>#100DaysOfCode</b> and <b>#Bootdev</b> hashtags.
        </p>

        <div class="flex flex-row items-center justify-center w-full">
          <img
            class="w-64"
            loading="lazy"
            :src="
              achievementEarned.AchievementImageGifURL
                ? achievementEarned.AchievementImageGifURL
                : achievementEarned.AchievementImageURL
            "
          />
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
