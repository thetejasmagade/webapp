<template>
  <ViewNavWrapper>
    <div>
      <Section title="Your Role" class="m-4">
        <div class="p-4 flex flex-col items-center">
          <div
            class="grid lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(userAchievement, i) of roleAchievements"
              :key="i"
              class="mb-6"
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

                <p class="text-center">
                  {{ userAchievement.Description }}
                </p>
              </div>
            </ImageCard>
          </div>
          <AchievementProgressWidget
            v-if="roleProgress"
            :current-progress="roleProgress.CurrentProgress"
            :max-progress="roleProgress.MaxProgress"
            text="levels to your next role"
          />
        </div>
      </Section>
      <Section title="#100DaysOfCode Achievements" class="m-4">
        <div class="p-4 flex flex-col items-center">
          <div>
            <p class="my-4">
              #100DaysOfCode is a popular Twitter challenge. You can
              <a
                href="https://www.100daysofcode.com/"
                target="_blank"
                class="text-blue-400 hover:text-blue-300 underline"
                >read the official rules here,</a
              >
              but in a nutshell, to complete the challenge you need to code
              every day for 100 days, and tweet about it daily using the
              <b>#100DaysOfCode</b> and <b>#Bootdev</b> hashtags.
            </p>
          </div>
          <div
            class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(userAchievement, i) of engagementAchievements"
              :key="i"
              class="mb-6"
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

                <p class="text-center">
                  {{ userAchievement.Description }}
                </p>
              </div>
            </ImageCard>
          </div>
          <AchievementProgressWidget
            v-if="engagementProgress"
            :current-progress="engagementProgress.CurrentProgress"
            :max-progress="engagementProgress.MaxProgress"
            text="days to your next achievement"
          />
        </div>
      </Section>
      <Section title="Milestone Achievements" class="m-4">
        <div class="p-4 flex flex-col items-center">
          <div
            class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(userAchievement, i) of milestoneAchievements"
              :key="i"
              class="mb-6"
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

                <p class="text-center">
                  {{ userAchievement.Description }}
                </p>
              </div>
            </ImageCard>
          </div>
          <AchievementProgressWidget
            v-if="milestoneProgress"
            :current-progress="milestoneProgress.CurrentProgress"
            :max-progress="milestoneProgress.MaxProgress"
            text="assignments to your next achievement"
          />
        </div>
      </Section>
      <Section title="Streak Achievements" class="m-4">
        <div class="p-4 flex flex-col items-center">
          <div
            class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(userAchievement, i) of streakAchievements"
              :key="i"
              class="mb-6"
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

                <p class="text-center">
                  {{ userAchievement.Description }}
                </p>
              </div>
            </ImageCard>
          </div>
          <AchievementProgressWidget
            v-if="streakProgress"
            :current-progress="streakProgress.CurrentProgress"
            :max-progress="streakProgress.MaxProgress"
            text="quizzes to your next achievement"
          />
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
import { computed, onMounted, reactive } from "vue";
import AchievementProgressWidget from "@/components/AchievementProgressWidget.vue";

import { loadUserAchievements } from "@/lib/cloudStore.js";
import { getAchievementsProgress } from "@/lib/cloudClient.js";

import { useStore } from "vuex";

export default {
  components: {
    ViewNavWrapper,
    ImageCard,
    Section,
    AchievementProgressWidget,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      progress: {},
    });

    onMounted(async () => {
      state.progress = await getAchievementsProgress();
    });

    const roleProgress = computed(() => {
      for (const key in state.progress) {
        const val = state.progress[key];
        if (val.AchievementToEarn.Category === "role") {
          return val;
        }
      }
      return null;
    });

    const milestoneProgress = computed(() => {
      for (const key in state.progress) {
        const val = state.progress[key];
        if (val.AchievementToEarn.Category === "milestone") {
          return val;
        }
      }
      return null;
    });

    const streakProgress = computed(() => {
      for (const key in state.progress) {
        const val = state.progress[key];
        if (val.AchievementToEarn.Category === "streak") {
          return val;
        }
      }
      return null;
    });

    const engagementProgress = computed(() => {
      for (const key in state.progress) {
        const val = state.progress[key];
        if (val.AchievementToEarn.Category === "engagement") {
          return val;
        }
      }
      return null;
    });

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
      roleProgress,
      milestoneProgress,
      streakProgress,
      engagementProgress,
      roleAchievements,
      milestoneAchievements,
      streakAchievements,
      engagementAchievements,
    };
  },
};
</script>

<style scoped></style>
