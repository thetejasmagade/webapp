<template>
  <div>
    <TopNav :title="`Portfolio - ${user.FirstName} ${user.LastName}`" />

    <div class="flex flex-col justify-start items-center">
      <Section
        v-if="user.Handle"
        :title="`${user.FirstName} ${user.LastName}`"
        :subtitle="user.JobTitle"
        class="max-w-4xl mb-5 mt-4"
      >
        <div class="p-4 grid grid-cols-2 xs:grid-cols-1 gap-4">
          <div class="flex flex-col items-center">
            <ProfileImage
              class="w-32 mb-4"
              :profile-image-u-r-l="user.ProfileImageURL"
              :editable="false"
            />

            <div>
              <div
                v-if="user.WebsiteURL"
                class="mb-2"
              >
                <span class="mr-2">
                  <FontAwesomeIcon icon="link" />
                </span> 
                <a
                  :href="user.WebsiteURL"
                  target="_blank"
                >
                  {{ stripProtocol(user.WebsiteURL) }}
                </a>
              </div>

              <div
                v-if="user.TwitterHandle"
                class="mb-2"
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
                class="mb-2"
              >
                <span class="mr-2">
                  <FontAwesomeIcon :icon="['fab', 'linkedin']" />
                </span> 
                <a
                  :href="user.LinkedinURL"
                  target="_blank"
                >
                  {{ stripProtocol(user.LinkedinURL) }}
                </a>
              </div>

              <div
                v-if="user.GithubHandle"
                class="mb-2"
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
            </div>
          </div>

          <div class="flex flex-col">
            <p
              v-if="user.Handle"
              class="mb-2 text-gray-600"
            >
              @{{ user.Handle }}
            </p>

            <div
              v-if="user.Location"
              class="mb-2 text-blue-600"
            >
              <span class="mr-2">
                <FontAwesomeIcon icon="map-marker-alt" />
              </span> 
              <span>{{ user.Location }}</span>
            </div>
            
            <div class="text-gray-500">
              {{ user.Bio }}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Course Progress"
        class="max-w-4xl mb-5"
      >
        <div class="grid lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
          <ImageCard
            v-for="(course, i) of filteredCourses"
            :key="i"
            :img-src="course.ImageURL"
          >
            <div
              :ref="`cardbody${i}`"
              class="body"
            >
              <h2 class="text-xl underline mb-4">
                <a @click="() => {linkClick(course.LandingPage)}">{{ course.Title }}</a>
              </h2>
              <p
                class="text-center text-green-700"
              >
                Complete
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>

      <Section
        v-if="filteredAchievements.length>0"
        title="Achievements Earned"
        class="max-w-4xl mb-5"
      >
        <div class="grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 p-4">
          <ImageCard
            v-for="(achievement, i) of filteredAchievements"
            :key="i"
            :img-src="achievement.ImageURL"
          >
            <div
              :ref="`cardbody${i}`"
              class="p-4 flex flex-col items-center"
            >
              <p class="text-gold-600 text-xl mb-2">
                {{ achievement.Title }}
              </p>

              <p class="text-center">
                {{ achievement.Description }}
              </p>

              <GemDisplay
                :size="2"
                :text="`${achievement.GemReward}`"
              />
            </div>
          </ImageCard>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ProfileImage from '@/components/ProfileImage.vue';
import ImageCard from '@/components/ImageCard.vue';
import Section from '@/components/Section.vue';

import {
  getCoursesPublic,
  getUserPublic,
  getUserAchievementsPublic
} from '@/lib/cloudClient.js';
import { notify } from '@/lib/notification.js';

export default {
  metaInfo() {
    return {
      title: `Qvault - ${this.user.FirstName}'s Portfolio`,
      meta: [
        { vmid:'description', name: 'description', content: `Check out ${this.user.FirstName} ${this.user.LastName}'s coding accomplishments on Qvault` },

        { vmid:'og:title', property: 'og:title', content: `Qvault Portfolio - ${this.user.Handle}` },
        { vmid:'og:description', property: 'og:description', content: `Check out ${this.user.FirstName} ${this.user.LastName}'s coding accomplishments on Qvault` },
        { vmid:'og:image', property: 'og:image', content: this.user.ProfileImageURL },

        { vmid:'twitter:title', name: 'twitter:title', content: `Qvault Portfolio - ${this.user.Handle}` },
        { vmid:'twitter:description', property: 'twitter:description', content: `Check out ${this.user.FirstName} ${this.user.LastName}'s coding accomplishments on Qvault` },
        { vmid:'twitter:image', name: 'twitter:image', content: this.user.ProfileImageURL }
      ]
    };
  },
  components: {
    TopNav,
    FontAwesomeIcon,
    ProfileImage,
    ImageCard,
    Section
  },
  data() {
    return {
      userHandle: this.$route.params.userHandle,
      user: {},
      courses: [],
      achievements: []
    };
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => course.IsComplete).sort((c1, c2) => c1.Title < c2.Title ? 1 : -1);
    },
    filteredAchievements() {
      return this.achievements.filter(ach => ach.UnlockedAt).sort((ua1, ua2) => {
        if (ua1.Category < ua2.Category) {
          return 1;
        } else if (ua1.Category > ua2.Category) {
          return -1;
        }
        return ua1.GemReward < ua2.GemReward ? -1 : 1;
      });
    }
  },
  async mounted() {
    try {
      this.user = await getUserPublic(this.userHandle);
      this.courses = await getCoursesPublic(this.userHandle);
      this.achievements = await getUserAchievementsPublic(this.userHandle);
    } catch (err) {
      notify({
        type: 'danger',
        text: err
      });
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    },
    stripProtocol(url) {
      return url.replace(/(^\w+:|^)\/\/?(?:www\.)?/, '');
    }
  }
};
</script>

<style scoped>

</style>
