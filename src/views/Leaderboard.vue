<template>
  <ViewNavWrapper>
    <div
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto p-4"
    >
      <LeaderboardSkeleton v-if="!leaderboardNumExercisesDay" />
      <Section
        title="How many exercises are learners doing?"
        subtitle="Hover over a bar to see the percentage of students who have completed that many exercises"
        class="m-4 max-w-4xl w-full"
      >
        <div class="p-4 flex flex-col items-center w-full">
          <BarChart
            :categories="leaderboardNumExercisesHistogramAlltimeCategories"
            :series="leaderboardNumExercisesHistogramAlltimeSeries"
            y-label="Percentage of learners"
            x-label="Number of exercises"
          />
        </div>
      </Section>

      <Section title="Top Daily Learners" class="m-4 max-w-4xl">
        <div class="p-4 flex flex-col items-center w-full">
          <div
            class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(user, i) of leaderboardNumExercisesDay"
              :key="i"
              class="mb-6"
              :link="{
                name: 'Portfolio',
                params: { userHandle: user.Handle },
              }"
              square
              :img-src="
                user.ProfileImageURL
                  ? user.ProfileImageURL
                  : 'https://orbitermag.com/wp-content/uploads/2017/03/default-user-image-300x300.png'
              "
            >
              <div
                :ref="`cardbody${i}`"
                class="p-4 flex flex-col items-center bg-gray-900 text-center"
              >
                <p
                  class="text-lg mb-2 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                >
                  {{ `#${i + 1}` }} {{ user.FirstName }}
                </p>

                <p
                  class="text-center text-blue-400 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                >
                  @{{ user.Handle }}
                </p>

                <p class="text-center">{{ user.Count }} exercises</p>
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>

      <Section title="Top Weekly Learners" class="m-4 max-w-4xl">
        <div class="p-4 flex flex-col items-center w-full">
          <div
            class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(user, i) of leaderboardNumExercisesWeek"
              :key="i"
              class="mb-6"
              :link="{
                name: 'Portfolio',
                params: { userHandle: user.Handle },
              }"
              square
              :img-src="
                user.ProfileImageURL
                  ? user.ProfileImageURL
                  : 'https://orbitermag.com/wp-content/uploads/2017/03/default-user-image-300x300.png'
              "
            >
              <div
                :ref="`cardbody${i}`"
                class="p-4 flex flex-col items-center bg-gray-900 text-center"
              >
                <p
                  class="text-lg mb-2 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                >
                  {{ `#${i + 1}` }} {{ user.FirstName }}
                </p>

                <p
                  class="text-center text-blue-400 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                >
                  @{{ user.Handle }}
                </p>

                <p class="text-center">{{ user.Count }} exercises</p>
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>

      <Section
        title="Top Learners of All Time"
        subtitle="The pinnacle of achievement"
        class="m-4 max-w-4xl"
      >
        <div class="p-4 flex flex-col items-center w-full">
          <div
            class="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-8"
          >
            <ImageCard
              v-for="(user, i) of leaderboardXPAlltime"
              :key="i"
              class="mb-6"
              :link="{
                name: 'Portfolio',
                params: { userHandle: user.Handle },
              }"
              square
              :img-src="
                user.ProfileImageURL
                  ? user.ProfileImageURL
                  : 'https://orbitermag.com/wp-content/uploads/2017/03/default-user-image-300x300.png'
              "
            >
              <div
                :ref="`cardbody${i}`"
                class="p-4 flex flex-col items-center bg-gray-900 text-center"
              >
                <p
                  class="text-lg mb-2 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                >
                  {{ `#${i + 1}` }} {{ user.FirstName }}
                </p>

                <p
                  class="text-center text-blue-400 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-full"
                >
                  @{{ user.Handle }}
                </p>

                <Radial
                  class="m-2"
                  :from-percent="0"
                  :to-percent="
                    Math.round((user.XPForLevel / user.XPTotalForLevel) * 100)
                  "
                  :duration="2000"
                  :level="user.Level"
                  :radius="30"
                  :stroke-width="7"
                />
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>
    </div>
  </ViewNavWrapper>
</template>

<script>
import LeaderboardSkeleton from "@/components/skeletons/LeaderboardSkeleton.vue";
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import ImageCard from "@/components/ImageCard.vue";
import Section from "@/components/Section.vue";
import BarChart from "@/components/BarChart.vue";
import Radial from "@/components/Radial.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import { computed, onMounted, reactive, toRefs } from "vue";

import {
  getLeaderBoardNumExercisesHistogram,
  getLeaderBoardNumExercises,
  getLeaderBoardXP,
} from "@/lib/cloudClient.js";

export default {
  components: {
    ViewNavWrapper,
    ImageCard,
    Section,
    Radial,
    BarChart,
    LeaderboardSkeleton,
  },
  setup() {
    const state = reactive({
      leaderboardNumExercisesHistogramAlltime: null,
      leaderboardNumExercisesWeek: null,
      leaderboardNumExercisesDay: null,
      leaderboardXPAlltime: null,
      leaderboardXPWeek: null,
      leaderboardXPDay: null,
    });

    onMounted(async () => {
      loadLeaderBoardNumExercisesHistogramAlltime();
      loadLeaderBoardNumExercisesWeek();
      loadLeaderBoardNumExercisesDay();
      loadLeaderBoardXPAlltime();
      loadLeaderBoardXPWeek();
      loadLeaderBoardXPDay();
    });

    const leaderboardNumExercisesHistogramAlltimeCategories = computed(() => {
      const categories = [];
      if (!state.leaderboardNumExercisesHistogramAlltime) {
        return categories;
      }
      for (const bar of state.leaderboardNumExercisesHistogramAlltime) {
        categories.push(`${bar.NumExercises}+`);
      }
      categories.reverse();
      categories.shift();
      return categories;
    });

    const leaderboardNumExercisesHistogramAlltimeSeries = computed(() => {
      const series = [];
      if (!state.leaderboardNumExercisesHistogramAlltime) {
        return series;
      }

      const copy = JSON.parse(
        JSON.stringify(state.leaderboardNumExercisesHistogramAlltime)
      );
      copy.reverse();
      copy.shift();

      let total = 0;
      for (const bar of copy) {
        total += bar.Count;
      }

      for (const bar of copy) {
        series.push(Math.ceil((bar.Count * 10000) / total) / 100);
      }
      return series;
    });

    const loadLeaderBoardNumExercisesHistogramAlltime = async () => {
      try {
        state.leaderboardNumExercisesHistogramAlltime =
          await getLeaderBoardNumExercisesHistogram("alltime");
      } catch (err) {
        console.log(err);
      }
    };

    const loadLeaderBoardNumExercisesWeek = async () => {
      try {
        state.leaderboardNumExercisesWeek = await getLeaderBoardNumExercises(
          "week"
        );
      } catch (err) {
        console.log(err);
      }
    };

    const loadLeaderBoardNumExercisesDay = async () => {
      try {
        state.leaderboardNumExercisesDay = await getLeaderBoardNumExercises(
          "day"
        );
      } catch (err) {
        console.log(err);
      }
    };

    const loadLeaderBoardXPAlltime = async () => {
      try {
        state.leaderboardXPAlltime = await getLeaderBoardXP("alltime");
      } catch (err) {
        console.log(err);
      }
    };

    const loadLeaderBoardXPWeek = async () => {
      try {
        state.leaderboardXPWeek = await getLeaderBoardXP("week");
      } catch (err) {
        console.log(err);
      }
    };

    const loadLeaderBoardXPDay = async () => {
      try {
        state.leaderboardXPDay = await getLeaderBoardXP("day");
      } catch (err) {
        console.log(err);
      }
    };

    const computedMeta = getComputedMeta({
      title: "Leaderboard",
      description: "See the top performers in our CS courses",
    });
    useMeta(computedMeta);

    return {
      ...toRefs(state),
      leaderboardNumExercisesHistogramAlltimeCategories,
      leaderboardNumExercisesHistogramAlltimeSeries,
    };
  },
};
</script>

<style scoped></style>
