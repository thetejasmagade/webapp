<template>
  <ViewNavWrapper>
    <div
      v-if="user"
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto p-4"
    >
      <Section
        :title="`${user.FirstName} ${user.LastName}`"
        :subtitle="`@${user.Handle}`"
        class="max-w-2xl w-full mb-5"
      >
        <div class="p-4 flex flex-col min-h-[150px]">
          <div class="flex justify-end">
            <ProfileImage
              class="w-32 mb-4 -mt-16"
              :profile-image-u-r-l="user.ProfileImageURL"
              :editable="isLoggedInUser"
            />
          </div>

          <div class="-mt-16">
            <div v-if="user.Location" class="mb-2">
              <span class="mr-2">
                <FontAwesomeIcon icon="map-marker-alt" />
              </span>
              <span>{{ user.Location }}</span>
            </div>

            <div
              v-if="user.WebsiteURL"
              class="mb-2 text-blue-400 underline hover:text-blue-300"
            >
              <span class="mr-2">
                <FontAwesomeIcon icon="link" />
              </span>
              <a :href="user.WebsiteURL" target="_blank">
                {{ stripProtocol(user.WebsiteURL) }}
              </a>
            </div>

            <div
              v-if="user.TwitterHandle"
              class="mb-2 text-blue-400 underline hover:text-blue-300"
            >
              <span class="mr-1">
                <FontAwesomeIcon :icon="['fab', 'twitter']" />
              </span>
              <a
                :href="`https://twitter.com/${user.TwitterHandle}`"
                target="_blank"
              >
                @{{ user.TwitterHandle }}
              </a>
            </div>

            <div
              v-if="user.LinkedinURL"
              class="mb-2 text-blue-400 underline hover:text-blue-300"
            >
              <span class="mr-2">
                <FontAwesomeIcon :icon="['fab', 'linkedin']" />
              </span>
              <a :href="user.LinkedinURL" target="_blank">
                {{ stripProtocol(user.LinkedinURL) }}
              </a>
            </div>

            <div
              v-if="user.GithubHandle"
              class="mb-2 text-blue-400 underline hover:text-blue-300"
            >
              <span class="mr-2">
                <FontAwesomeIcon :icon="['fab', 'github']" />
              </span>
              <a
                :href="`https://github.com/${user.GithubHandle}`"
                target="_blank"
              >
                {{ user.GithubHandle }}
              </a>
            </div>

            <div>
              {{ user.Bio }}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Certifications"
        subtitle="Download and share Boot.dev certificates with potential employers to show off your skills"
        class="max-w-2xl w-full mb-5"
      >
        <div class="grid md:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
          <router-link
            v-for="(course, i) of filteredCourses"
            :key="i"
            class="hover:opacity-75"
            :to="{
              name: 'Certificate',
              params: { userHandle: user.Handle, courseUUID: course.UUID },
            }"
            target="_blank"
          >
            <ImageCard :img-src="course.ImageURL" />
          </router-link>
        </div>
      </Section>

      <Section
        v-if="filteredAchievements.length > 0"
        title="Achievements"
        class="max-w-2xl w-full mb-5"
      >
        <div class="grid sm:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
          <ImageCard
            v-for="(achievement, i) of filteredAchievements"
            :key="i"
            :img-src="achievement.ImageURL"
          >
            <div class="p-2 flex flex-col items-center">
              <p class="text-blue-300 text-xl mb-2">
                {{ achievement.Title }}
              </p>

              <p class="text-center">
                {{ achievement.Description }}
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ProfileImage from "@/components/ProfileImage.vue";
import ImageCard from "@/components/ImageCard.vue";
import Section from "@/components/Section.vue";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import { computed, reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { sortUserAchievements } from "@/lib/sort.js";

import {
  getCoursesPublic,
  getUserPublic,
  getUserAchievementsPublic,
} from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";

export default {
  components: {
    ViewNavWrapper,
    FontAwesomeIcon,
    ProfileImage,
    ImageCard,
    Section,
  },
  setup() {
    const state = reactive({
      user: null,
      courses: [],
      achievements: [],
      filteredCourses: [],
      filteredAchievements: [],
    });
    const store = useStore();
    const route = useRoute();

    const filteredCourses = computed(() => {
      return state.courses
        .filter((course) => course.CompletedAt)
        .sort((c1, c2) => (c1.Title < c2.Title ? 1 : -1));
    });

    const filteredAchievements = computed(() => {
      return state.achievements.filter((ach) => ach.UnlockedAt);
    });

    onMounted(async () => {
      try {
        state.user = await getUserPublic(route.params.userHandle);
        state.courses = await getCoursesPublic(route.params.userHandle);
        const achievements = await getUserAchievementsPublic(
          route.params.userHandle
        );
        const sorted = sortUserAchievements(achievements);
        sorted.reverse();
        state.achievements = sorted;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    });

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: `${state.user?.FirstName}'s Portfolio`,
        description: `Check out ${state.user?.FirstName} ${state.user?.LastName}'s coding accomplishments on Boot.dev`,
        featuredImageURL: state.user?.ProfileImageURL,
      });
    });
    useMeta(computedMeta);
    return {
      ...toRefs(state),
      filteredCourses,
      filteredAchievements,
      isLoggedInUser:
        store.getters.getIsLoggedIn &&
        store.getters.getUser?.Handle === route.params.userHandle,
    };
  },
  methods: {
    stripProtocol(url) {
      return url.replace(/(^\w+:|^)\/\/?(?:www\.)?/, "");
    },
  },
};
</script>

<style scoped></style>
