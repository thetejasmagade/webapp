<template>
  <div id="container">
    <TopNav :title="`Portfolio - ${user.FirstName} ${user.LastName}`" />

    <div class="subcontainer">
      <Section
        v-if="user.Handle"
        :title="`${user.FirstName} ${user.LastName}`"
        :subtitle="`@${user.Handle}`"
      >
        <div class="row-upper d-flex">
          <div class="profile d-flex align-items-center justify-content-center flex-1">
            <ProfileImage
              class="profile-image"
              :profile-image-u-r-l="user.ProfileImageURL"
              :editable="false"
            />
          </div>
          <div class="profileContent flex-2 py-5">
            <div class="row">
              <div
                v-if="user.JobTitle"
                class="col"
              >
                <span class="light">Title:</span>
                <span class="m-left-5">{{ user.JobTitle }}</span>
              </div>
              <div
                v-if="user.Location"
                class="col"
              >
                <span class="light">
                  <FontAwesomeIcon icon="map-marker-alt" />
                </span> 
                <span class="m-left-5">{{ user.Location }}</span>
              </div>
            </div>

            <div class="row">
              <div
                v-if="user.WebsiteURL"
                class="col"
              >
                <span class="light">
                  <FontAwesomeIcon icon="link" />
                </span> 
                <a
                  :href="user.WebsiteURL"
                  target="_blank"
                  class="m-left-5"
                >{{ stripProtocol(user.WebsiteURL) }}</a>
              </div>
              <div
                v-if="user.TwitterHandle"
                class="col"
              >
                <span class="light">
                  <FontAwesomeIcon :icon="['fab', 'twitter']" />
                </span> 
                <a
                  :href="`https://twitter.com/${user.TwitterHandle}`"
                  target="_blank"
                  class="m-left-5"
                >@{{ user.TwitterHandle }}
                </a>
              </div>
            </div>

            <div class="row">
              <div
                v-if="user.LinkedinURL"
                class="col"
              >
                <span class="light">
                  <FontAwesomeIcon :icon="['fab', 'linkedin']" />
                </span> 
                <a
                  :href="user.LinkedinURL"
                  target="_blank"
                  class="m-left-5"
                >{{ stripProtocol(user.LinkedinURL) }}</a>
              </div>
              <div
                v-if="user.GithubHandle"
                class="col"
              >
                <span class="light">
                  <FontAwesomeIcon :icon="['fab', 'github']" />
                </span> 
                <a
                  :href="`https://github.com/${user.GithubHandle}`"
                  target="_blank"
                  class="m-left-5"
                >{{ user.GithubHandle }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <span class="light">
          {{ user.Bio }}
        </span>
      </Section>

      <Section title="Course Progress">
        <div class="row-portfolio d-flex align-items-center flex-wrap py-5">
          <ImageCard
            v-for="(course, i) of filteredCourses"
            :key="i"
            :img-src="course.ImageURL"
            class="card"
            :click="() => {linkClick(course.LandingPage)}"
            theme="light"
          >
            <div
              :ref="`cardbody${i}`"
              class="body"
            >
              <h3
                class="item title purple"
              >
                {{ course.Title }}
              </h3>
              <p
                class="item description"
                :class="{'light': !course.IsComplete, 'complete': course.IsComplete}"
              >
                {{ course.IsComplete ? 'Complete' : 'In Progress' }}
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>

      <Section
        v-if="filteredAchievements.length>0"
        title="Achievements Earned"
      >
        <div class="row-portfolio d-flex align-items-center flex-wrap py-5">
          <ImageCard
            v-for="(achievement, i) of filteredAchievements"
            :key="i"
            :img-src="achievement.ImageURL"
            class="card small"
          >
            <div
              :ref="`cardbody${i}`"
              class="body"
            >
              <h3
                class="item title complete"
              >
                {{ achievement.Title }}
              </h3>
              <p
                class="item description light"
              >
                {{ achievement.Description }}
              </p>
            </div>
          </ImageCard>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ProfileImage from '@/components/ProfileImage';
import ImageCard from '@/components/ImageCard';
import Section from '@/components/Section';

import {
  getCoursesPublic,
  getUserPublic,
  getUserAchievementsPublic
} from '@/lib/cloudClient.js';

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
      return this.courses.filter(course => course.IsComplete || course.IsPurchased).sort((c1, c2) => c1.Title < c2.Title ? 1 : -1);
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
      this.$notify({
        type: 'error',
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

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/backgrounds.scss';

#container {
  background-color: $gray-lightest;
  overflow: auto;
  background-image: $gray-lines;
  background-attachment: fixed;
  height: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
  }

  .col {
    flex: 1;
    padding: 15px;
  }
}

.card {
  flex: 1 1 calc(22% - 1em);
  margin: 20px;
  max-width: 250px;
  min-width: 150px;

  &.small {
    max-width: 150px;
    min-width: 100px;

    .body {
      .title {
        font-size: 1em;
      }
    }
  }

  .body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 1em;

    .item {
      margin: 1em 1em 0em 1em;
    }

    .title {
      font-size: 1.2em;
    }

    .description {
      font-weight: 400;
      line-height: 1.3em;
      font-size: 1em;
    }
  }
}

.m-left-5 {
  margin-left: 5px;
}

.profile-image {
  width: 200px;
}

.basis-25 {
  flex-basis: 25%;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.align-items-center {
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-column {
  flex-direction: column;
}

.flex-2 {
  flex: 2;
}

.light {
  color: $gray-light;
}

.complete {
  color: $gold-mid;
}

.purple {
  color: $purple-dark;
}

.py-5 {
  padding: 50px 0;
}

.row-portfolio {
  @media (max-width: 768px) {
    flex-direction: column;
    .basis-25 {
      flex-basis: 90% !important;
    }
  }
}

.row-upper {
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.profile {
  margin-right: 2em;
  img {
    max-width: 240px;
    border-radius: 50%;
    margin: 0 auto;
  }
}
</style>
