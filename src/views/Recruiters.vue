<template>
  <div class="recruiters-root">
    <Modal ref="experienceHelpModal">
      <div>
        <div
          v-for="(experienceLevel, i) of experienceLevels"
          :key="i"
        >
          <h3 class="font-bold text-lg">
            {{ experienceLevel.label }}
          </h3>
          <p class="mb-4">
            {{ experienceLevel.description }}
          </p>
        </div>
      </div>
    </Modal>
    <Section
      class="section"
      title="Rules"
      subtitle="Here are some quick rules regarding how to utilize this tool"
    >
      <div class="section-body">
        <p class="mb-4">
          We <b>strictly require</b> everyone to play by the
          rules. All the rules are legally binding <a href="https://qvault.io/terms-of-service">terms of service that your team agreed to</a>.
        </p>
        <ul class="list-disc ml-5 mb-4">
          <li>
            When you initially contact a candidate you <b>must</b> tell them you found them through Qvault
          </li>
          <li>
            If a candidate asks you to, you <b>must</b> remove them from <b>all</b> your team's contact lists
          </li>
          <li>
            When a candidate is successfully placed, you're <b>required</b> to <a href="mailto:admin@qvault.io">notify us</a>
            on or before their first day. We'll send an invoice to your account holder on file at that point
          </li>
          <li>
            We charge $750 to place a mid-level developer, $1500 to place a senior developer,
            and there is no charge for all other lower experience levels.
            That said, we still require you to contact us and let us know you placed them
          </li>
          <li>
            Experience levels are determined in this pricing system by how the candidate self-identifies in Qvault,
            not their job title once placed
          </li>
        </ul>

        <p class="mb-4">
          Access to this list is exclusive to our amazing partners like you.
          Any breach of the rules will result in an immediate ban and potential legal action.
        </p>
      </div>
    </Section>

    <Section
      class="section"
      title="Job-Ready Candidates"
      subtitle="Everyone here has opted-in to being contacted for relevant opportunities"
    >
      <div class="section-body">
        <h2 class="mb-4">
          * Indicates required
        </h2>
        <div class="toggles">
          <div class="toggle interests">
            <h3 class="font-bold text-lg mb-4">
              * Interests
            </h3>
            <CheckboxForm
              v-model="interestsChecked"
              :options="interestsAnswers"
            />
          </div>
          <div class="toggle experience">
            <h3
              class="font-bold text-lg mb-4 link"
              @click="showExperienceHelpModal"
            >
              * Experience
            </h3>
            <CheckboxForm
              v-model="experienceLabelsChecked"
              :options="experienceLevelLabels"
            />
          </div>
          <div class="toggle location">
            <h3 class="font-bold text-lg mb-4">
              Location
            </h3>
            <p>
              This is a "contains" match on the candidate's location text.
              Try cities, states, or countries, and also try abbreviations like "CA" for "California" or "US" for "United States".
            </p>
            <TextInput
              v-model="locationSearch"
              class="location-input"
              placeholder="city, state or country"
              type="text"
            />
          </div>

          <div>
            <h3 class="font-bold text-lg mb-4">
              Misc
            </h3>
            <div class="flex flex-row leading-3 items-center mb-4">
              <ToggleSwitch
                v-model="filterResumes"
              />
              <span class="ml-2">
                Has resume
              </span>
            </div>
            <div class="flex flex-row leading-3 items-center">
              <ToggleSwitch
                v-model="filterLinkedin"
              />
              <span class="ml-2">
                Has linkedin
              </span>
            </div>
          </div>
        </div>
        <div class="cards">
          <ImageCard
            v-for="(user, i) of displayedUsers"
            :key="i"
            theme="light"
            class="card"
          >
            <div
              v-if="!false"
              class="body"
            >
              <h3 class="font-bold text-lg mb-4">
                {{ capitalize(user.FirstName) }} {{ user.revealed ? capitalize(user.LastName) : '' }}
              </h3>
              
              <div
                v-if="user.revealed"
                class="item"
              >
                {{ user.Email }}
              </div>

              <div
                v-if="user.revealed && user.ResumeURL"
                class="item"
              >
                <a
                  target="_blank"
                  :href="user.ResumeURL"
                >
                  resume
                </a>
              </div>

              <div
                v-if="user.revealed && user.LinkedinURL"
                class="item"
              >
                <a
                  target="_blank"
                  :href="user.LinkedinURL"
                >
                  Linkedin
                </a>
              </div>

              <div class="item">
                <b>{{ experienceLevelToLabel(user.ExperienceLevel) }}</b>
              </div>

              <div class="item">
                <FontAwesomeIcon
                  icon="map-marker-alt"
                  class="mr-3"
                />
                <span> {{ user.Location ? user.Location : 'Unknown' }} </span>
              </div>

              <div class="item">
                <ul class="list-disc ml-5 mb-4">
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
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import { experienceLevels } from '@/lib/experienceLevels.js';
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

import Modal from '@/components/Modal.vue';
import CheckboxForm from '@/components/CheckboxForm.vue';
import Section from '@/components/Section.vue';
import ImageCard from '@/components/ImageCard.vue';
import BlockButton from '@/components/BlockButton.vue';
import TextInput from '@/components/TextInput.vue';

export default {
  components: {
    Modal,
    Section,
    ImageCard,
    FontAwesomeIcon,
    BlockButton,
    CheckboxForm,
    TextInput,
    ToggleSwitch
  },
  data(){
    return {
      users: {},
      interestsChecked: [],
      interestsMap: {},
      experienceLabelsChecked: [],
      locationSearch: '',
      filterResumes: false,
      filterLinkedin: false
    };
  },
  computed: {
    experienceLevels(){
      return experienceLevels;
    },
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
      users = this.filterByLocation(users);
      users = this.filterByLinkedin(users);
      users = this.filterByResume(users);
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
    showExperienceHelpModal() {
      this.$refs.experienceHelpModal.show();
    },
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
    filterByLocation(users){
      if (this.locationSearch === ''){
        return users;
      }
      users = users.filter(user => {
        if (!user.Location){
          return false;
        }
        return user.Location.toLowerCase().includes(this.locationSearch.toLowerCase());
      });
      return users;
    },
    filterByLinkedin(users){
      console.log(this.filterLinkedin);
      if (!this.filterLinkedin){
        return users;
      }
      users = users.filter(user => {
        return user.LinkedinURL;
      });
      return users;
    },
    filterByResume(users){
      if (!this.filterResumes){
        return users;
      }
      users = users.filter(user => {
        return user.ResumeURL;
      });
      return users;
    },
    reveal(handle){
      const user = JSON.parse(JSON.stringify(this.users[handle]));
      user.revealed = true;
      this.users[handle] = user;
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
    
    .location {
      max-width: 300px;
    }

    .toggle {
      margin: 0 1em 0 1em;
    }
  }

  .item {
    margin: 0 0 0.5em 0;
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
