<template>
  <ViewNavWrapper>
    <div>
      <Section
        title="Roles"
        subtitle="Unlock new roles and show them off in the Discord server"
        class="m-4"
      >
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <ImageCard
            v-for="(userAchievement, i) of roleAchievements"
            :key="i"
            :img-src="
              userAchievement.ImageGifURL && userAchievement.UnlockedAt
                ? userAchievement.ImageGifURL
                : userAchievement.ImageURL
            "
            :class="{ 'opacity-25': !userAchievement.UnlockedAt }"
          >
            <div :ref="`cardbody${i}`" class="p-4 flex flex-col items-center">
              <p class="text-blue-400 text-lg mb-2">
                {{ userAchievement.Title }}
              </p>

              <p class="text-center text-sm">
                {{ userAchievement.Description }}
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>
      <Section
        title="Milestone Achievements"
        subtitle="How far can you go?"
        class="m-4"
      >
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <ImageCard
            v-for="(userAchievement, i) of milestoneAchievements"
            :key="i"
            :img-src="
              userAchievement.ImageGifURL && userAchievement.UnlockedAt
                ? userAchievement.ImageGifURL
                : userAchievement.ImageURL
            "
            :class="{ 'opacity-25': !userAchievement.UnlockedAt }"
          >
            <div :ref="`cardbody${i}`" class="p-4 flex flex-col items-center">
              <p class="text-blue-400 text-lg mb-2">
                {{ userAchievement.Title }}
              </p>

              <p class="text-center text-sm">
                {{ userAchievement.Description }}
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>
      <Section
        title="Streak Achievements"
        subtitle="How many can you get right in a row?"
        class="m-4"
      >
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <ImageCard
            v-for="(userAchievement, i) of streakAchievements"
            :key="i"
            :img-src="
              userAchievement.ImageGifURL && userAchievement.UnlockedAt
                ? userAchievement.ImageGifURL
                : userAchievement.ImageURL
            "
            :class="{ 'opacity-25': !userAchievement.UnlockedAt }"
          >
            <div :ref="`cardbody${i}`" class="p-4 flex flex-col items-center">
              <p class="text-blue-400 text-lg mb-2">
                {{ userAchievement.Title }}
              </p>

              <p class="text-center text-sm">
                {{ userAchievement.Description }}
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>
      <Section
        title="Devotion Achievements"
        subtitle="Are you commited to your goals?"
        class="m-4"
      >
        <div
          class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
        >
          <ImageCard
            v-for="(userAchievement, i) of engagementAchievements"
            :key="i"
            :img-src="
              userAchievement.ImageGifURL && userAchievement.UnlockedAt
                ? userAchievement.ImageGifURL
                : userAchievement.ImageURL
            "
            :class="{ 'opacity-25': !userAchievement.UnlockedAt }"
          >
            <div :ref="`cardbody${i}`" class="p-4 flex flex-col items-center">
              <p class="text-blue-400 text-lg mb-2">
                {{ userAchievement.Title }}
              </p>

              <p class="text-center text-sm">
                {{ userAchievement.Description }}
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import ImageCard from "@/components/ImageCard.vue";
import Section from "@/components/Section.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import { computed } from "vue";

import { loadUserAchievements } from "@/lib/cloudStore.js";

import { useStore } from "vuex";

export default {
  components: {
    ViewNavWrapper,
    ImageCard,
    Section,
  },
  setup() {
    const store = useStore();

    const roleAchievements = computed(() => {
      return store.getters.getUserAchievements.filter(
        (item) => item.Category === "role"
      );
    });
    const milestoneAchievements = computed(() => {
      return store.getters.getUserAchievements.filter(
        (item) => item.Category === "milestone"
      );
    });
    const streakAchievements = computed(() => {
      return store.getters.getUserAchievements.filter(
        (item) => item.Category === "streak"
      );
    });
    const engagementAchievements = computed(() => {
      return store.getters.getUserAchievements.filter(
        (item) => item.Category === "engagement"
      );
    });

    const computedMeta = getComputedMeta({
      title: "Achievements",
      description: "View your Boot.dev achievements",
    });
    useMeta(computedMeta);

    loadUserAchievements(store.commit);

    return {
      roleAchievements,
      milestoneAchievements,
      streakAchievements,
      engagementAchievements,
    };
  },
};
</script>

<style scoped></style>
