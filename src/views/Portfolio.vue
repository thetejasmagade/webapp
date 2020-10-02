<template>
  <div id="container">
    <TopNav :title="`Portfolio - ${user.FirstName} ${user.LastName}`" />

    <div class="contentContainer">
      <div class="about">
        <div class="title">
          <div class="name">
            {{ user.FirstName }} {{ user.LastName }}
          </div>
          <div class="handle">
            @{{ user.Handle }}
          </div>
        </div>

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
      </div>

      <div class="about">
        <h3 class="title">
          Course Progress
        </h3>

        <div class="row-portfolio d-flex align-items-center flex-wrap py-5">
          <div
            v-for="(course, i) of filteredCourses"
            :key="i"
            class="basis-25"
            @click.prevent="callModal()"
          >
            <div
              class="portfolio d-flex align-items-center justify-content-center flex-column"
              @click="linkClick(course.LandingPage)"
            >
              <img
                :src="course.ImageURL"
                alt
              >
              <div class="card-body">
                <h3
                  class="text-capitalize l-height"
                  @click.prevent="callModal($event)"
                >
                  {{ course.Title }}
                </h3>
                <p
                  :class="{'light': !course.IsComplete, complete: course.IsComplete}"
                >
                  {{ course.IsComplete ? 'Complete' : 'In Progress' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ProfileImage from '@/components/ProfileImage';

import {
  getCoursesPublic,
  getUserPublic
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
    ProfileImage
  },
  data() {
    return {
      userHandle: this.$route.params.userHandle,
      user: {},
      courses: []
    };
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => course.IsComplete || course.IsPurchased).sort((c1, c2) => c1.Title < c2.Title ? 1 : -1);
    }
  },
  async mounted() {
    try {
      this.user = await getUserPublic(this.userHandle);
      this.courses = await getCoursesPublic(this.userHandle);
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

#container {
  background-color: $gray-lightest;
  overflow: auto;
  background-image: linear-gradient(305deg, rgba(254, 254, 254,0.02) 0%, rgba(254, 254, 254,0.02) 1%,transparent 1%, transparent 50%,rgba(220, 220, 220,0.02) 50%, rgba(220, 220, 220,0.02) 64%,rgba(249, 249, 249,0.02) 64%, rgba(249, 249, 249,0.02) 100%),linear-gradient(38deg, rgba(70, 70, 70,0.02) 0%, rgba(70, 70, 70,0.02) 35%,transparent 35%, transparent 62%,rgba(152, 152, 152,0.02) 62%, rgba(152, 152, 152,0.02) 74%,rgba(99, 99, 99,0.02) 74%, rgba(99, 99, 99,0.02) 100%),linear-gradient(337deg, rgba(124, 124, 124,0.02) 0%, rgba(124, 124, 124,0.02) 45%,transparent 45%, transparent 55%,rgba(34, 34, 34,0.02) 55%, rgba(34, 34, 34,0.02) 72%,rgba(189, 189, 189,0.02) 72%, rgba(189, 189, 189,0.02) 100%),linear-gradient(92deg, rgba(239, 239, 239,0.02) 0%, rgba(239, 239, 239,0.02) 12%,transparent 12%, transparent 22%,rgba(204, 204, 204,0.02) 22%, rgba(204, 204, 204,0.02) 51%,rgba(70, 70, 70,0.02) 51%, rgba(70, 70, 70,0.02) 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255));
  background-attachment: fixed;
  height: 100%;
}

.title {
  .name {
    font-size: 24px;
    color: $black;
    font-weight: bold;
    position: relative;
    margin-bottom: 5px;
  }

  .handle {
    color: $gray-dark;
  }

  &:after {
    content: "";
    background: #3753af;
    border-radius: 25px;
    display: block;
    height: 5px;
    margin-top: 14px;
    width: 30px;
    transition: 0.7s ease-in-out;
  }

  &:hover {
    &:after {
      width: 70px;
    }
  }
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

.text-capitalize {
  text-transform: capitalize;
}

.portfolio {
  transition: 0.4s all;
  margin: 8px 15px;
  border: solid 1px #37235a38;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 0 22px -6px #c1c1c1;
  cursor: pointer;

  .card-body {
    padding: 5px 10px 15px 10px;
  }

  img {
    width: 100%;
    height: auto;
  }

  h3 {
    color: $purple-darkest;
  }

  svg {
    color: $purple-darkest;
  }

  &:hover {
    background-color: $purple-darkest;

    h3,
    svg,
    p {
      color: $white;
    }
  }
}

.contentContainer {
  max-width: 1170px;
  padding: 10px;
  margin: 0 auto;
  @media (max-width: 1024px) {
    max-width: 960px;
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

  .about {
    margin: 25px 0;
    padding: 2em;
    background-color: $white;
    border-radius: 3px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.4);
  }
}
</style>
