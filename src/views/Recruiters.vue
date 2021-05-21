<template>
  <div class="recruiters-root">
    <Section
      class="section"
      title="Rules"
      subtitle="Here are some quick rules regarding how to utilize this tool"
    >
      <div class="section-body">
        <p>
          We <b>strictly require</b> everyone to play by the
          rules. All the rules are legally binding <a href="https://qvault.io/terms-of-service">terms of service that your team agreed to</a>.
        </p>
        <ul>
          <li>
            Our system ensures a candidate's contact info can be accessed at most 5 times per month.
            This keeps candidates responsive. We don't want them constantly contacted by different teams.
          </li>
          <li>
            You're able to view up to 200 candidate's contact information each month.
          </li>
          <li>
            When you initially contact a candidate you <b>must</b> tell them you found them through Qvault.
          </li>
          <li>
            If a candidate asks you to, you <b>must</b> remove them from <b>all</b> your team's contact lists.
          </li>
          <li>
            When a candidate is successfully placed, you're <b>required</b> to <a href="mailto:admin@qvault.io">notify us</a>
            on or before their first day. We'll send an invoice to your account holder on file at that point.
          </li>
        </ul>

        <p>
          Access to this list is exclusive to our amazing partners like you.
          Any breach of the rules will result in an immediate ban and potentially legal action.
        </p>

        <h2> Pricing </h2>
        <p>
          We charge a flat rate of $500/placement for any candidates who have junior-level experience or less.
          We charge $1500/placement for mid-level developers and up. We're excited to work with you!
        </p>
      </div>
    </Section>

    <Section
      class="section"
      title="Job-Ready Candidates"
      subtitle="Everyone here has opted-in to being contacted for relevant opportunities"
    >
      <div class="section-body">
        <p> Check at least one option from each column to see candidates that match your filters </p>
        <div class="toggles">
          <div class="interests">
            <CheckboxForm
              v-model="interestsChecked"
              :options="interestsAnswers"
            />
          </div>
          <div class="experience">
            <CheckboxForm
              v-model="experienceLabelsChecked"
              :options="experienceLevelLabels"
            />
          </div>
        </div>
        <div class="cards">
          <ImageCard
            v-for="(user, i) of displayedUsers"
            :key="i"
            theme="light"
            :img-src="user.ProfileImageURL ? user.ProfileImageURL : 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'"
            class="card"
          >
            <div
              v-if="!false"
              class="body"
            >
              <h3> {{ capitalize(user.FirstName) }} {{ user.revealed ? capitalize(user.LastName) : '' }}</h3>
              
              <div
                v-if="user.revealed"
                class="item"
              >
                {{ user.Email }}
              </div>

              <div class="item">
                <b>{{ experienceLevelToLabel(user.ExperienceLevel) }}</b>
              </div>

              <div class="item">
                <FontAwesomeIcon icon="map-marker-alt" />
                <span> {{ user.Location ? user.Location : 'Unknown' }} </span>
              </div>

              <div class="item">
                <ul>
                  <li
                    v-for="(interest, j) of getInterestTags(user.Interests)"
                    :key="j"
                  >
                    {{ interest }}
                  </li>
                </ul>
              </div>
            
              <BlockButton
                v-if="!user.revealed"
                :click="() => {reveal(user.Handle)}"
                class="item"
              >
                <FontAwesomeIcon icon="eye" />
                Contact Info
              </BlockButton>

              <div
                v-if="user.revealed"
                class="item"
              >
                <a
                  target="_blank"
                  :href="`/u/${user.Handle}`"
                >
                  View Profile
                </a>
              </div>
            </div>
          </ImageCard>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import { 
  getUsersAsRecruiter
} from '@/lib/cloudClient.js';
import { 
  loadAllInterests
} from '@/lib/cloudStore.js';
import {
  experienceLevelLabels,
  experienceLevelUpperLimitToLabel,
  experienceLevelToObj
} from '@/lib/experienceLevels.js';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import CheckboxForm from '@/components/CheckboxForm.vue';
import Section from '@/components/Section.vue';
import ImageCard from '@/components/ImageCard.vue';
import BlockButton from '@/components/BlockButton.vue';

export default {
  components: {
    Section,
    ImageCard,
    FontAwesomeIcon,
    BlockButton,
    CheckboxForm
  },
  data(){
    return {
      users: {},
      interestsChecked: [],
      interestsMap: {},
      experienceLabelsChecked: []
    };
  },
  computed: {
    experienceLevelLabels(){
      return experienceLevelLabels();
    },
    interestsAnswers(){
      return Object.keys(this.interestsMap);
    },
    displayedUsers(){
      let users = [];
      for (const value of Object.entries(this.users)) {
        users.push(value[1]);
      }
      users = this.filterMisc(users);
      users = this.filterByInterests(users);
      users = this.filterByExperience(users);
      users = users.sort((user1, user2) => {
        return Date.parse(user1.CreatedAt) > Date.parse(user2.CreatedAt) ? -1 : 1;
      });
      return users;
    }
  },
  async mounted(){
    try {
      const users = await getUsersAsRecruiter();
      let final = {};
      for (const user of users){
        final[user.Handle] = user;
      }
      this.users = final;
    } catch (err) {
      console.log(err);
    }
    await loadAllInterests(this);
    let interestsMap = {};
    for (const interest of this.$store.getters.getAllInterests){
      interestsMap[interest.Title] = interest.UUID;
    }
    this.interestsMap = interestsMap;
  },
  methods: {
    experienceLevelToLabel(level){
      return experienceLevelToObj(level).label;
    },
    experienceLevelUpperLimitToLabel(upperLimit){
      return experienceLevelUpperLimitToLabel(upperLimit);
    },
    filterMisc(users){
      users = users.filter(user => {
        return !user.Email.includes('lane.c.wagner');
      });
      return users;
    },
    filterByInterests(users){
      users = users.filter(user => {
        if (!user.Interests){
          return this.interestsChecked.length === 0;
        }
        for (const interestObject of user.Interests){
          for (const interestTag of this.interestsChecked){
            if (interestTag === this.interestTagFromUUID(interestObject.InterestUUID)){
              return true;
            }
          }
        }
        return false;
      });
      return users;
    },
    filterByExperience(users){
      users = users.filter(user => {
        for (const experienceLabelChecked of this.experienceLabelsChecked){
          const expObj = experienceLevelToObj(user.ExperienceLevel);
          if (expObj.label === experienceLabelChecked){
            return true;
          }
        }
        return false;
      });
      return users;
    },
    reveal(handle){
      const user = JSON.parse(JSON.stringify(this.users[handle]));
      user.revealed = true;
      this.$set(this.users, handle, user);
    },
    interestTagFromUUID(interestUUID) {
      for (const interest of this.$store.getters.getAllInterests){
        if (interestUUID === interest.UUID){
          return interest.Title;
        }
      }
      return 'unknown';
    },
    getInterestTags(interestObjects) {
      if (!interestObjects){
        return [];
      }
      let interests = [];
      for (const interestObject of interestObjects){
        interests.push(this.interestTagFromUUID(interestObject.InterestUUID));
      }
      return interests;
    },
    capitalize(s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";
@import '@/styles/consts.scss';

.recruiters-root {
  .section {
    margin: 1em;
  }

  .section-body {
    padding: 1em 0 0 0;
  }

  .toggles {
    display: flex;
    flex-direction: row;
  }

  .item {
    margin: 0 0 1em 0;
  }

  .cards {
    margin: 1em 0 0 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .card {
    $margin: 10px;
    flex: 1;
    margin: $margin;
    max-width: 300px;
    min-width: 200px;
    height: calc(100% - #{$margin});

    .body {
      height: 100%;
      padding: 1em;
      overflow: hidden;

      ul {
        text-align: left;
      }
    }
  }
}

</style>
