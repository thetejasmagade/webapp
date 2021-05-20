<template>
  <div class="recruiters-root">
    <Section
      class="section"
      title="Getting Started"
      subtitle="Here are some quick tips on how to utilize this database"
    >
      <div class="section-body">
        <div class="cards">
          <p>
            We hope this list helps you connect
            our students with awesome job oppurtunities!
            If you have any questions or feedback please
            <a href="https://qvault.io/contact">let us know.</a>

            Remember that we <b>strictly require</b> everyone to play by the
            rules outlined in our <a href="https://qvault.io/terms-of-service">terms of service</a>.
            We need to be <a href="mailto:admin@qvault.io">notified:</a>
          </p>
          <ul>
            <li>When a candidate has their first interview</li>
            <li>When a candidate has accepted a job offer</li>
            <li>When the candidate starts on their first day</li>
          </ul>
          <p>
            Once a candidate starts, we'll email an invoice to your account holder on file!
            We charge a flat rate of $500/placement for any candidates who have junior-level experience or less.
            We charge $1500/placement for mid-level developers and up. We're excited to work with you, and we're keeping
            access to this list highly exclusive!  
          </p>
        </div>
      </div>
    </Section>

    <Section
      class="section"
      title="Job-Ready Candidates"
      subtitle="Everyone here has opted-in to being contacted for relevant opportunities"
    >
      <div class="section-body">
        <div class="cards">
          <ImageCard
            v-for="(user, i) of users"
            :key="i"
            theme="light"
            :img-src="user.ProfileImageURL ? user.ProfileImageURL : 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'"
            class="card"
          >
            <div class="body">
              <h3> {{ user.FirstName }} {{ user.LastName }}</h3>

              <span> {{ user.Email }} </span><br>
              <div v-if="user.Location">
                <FontAwesomeIcon icon="map-marker-alt" />
                <span> {{ user.Location }} </span>
              </div>
              <span> {{ devExperienceDescription(user.ExperienceLevel) }} </span><br>
            
              <a
                target="_blank"
                :href="`/u/${user.Handle}`"
              >
                View Profile
              </a><br>
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

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Section from '@/components/Section.vue';
import ImageCard from '@/components/ImageCard.vue';

export default {
  components: {
    Section,
    ImageCard,
    FontAwesomeIcon
  },
  data(){
    return {
      users: []
    };
  },
  async mounted(){
    try {
      this.users = await getUsersAsRecruiter();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    devExperienceDescription(experienceLevel){
      if (experienceLevel < 10){
        return 'New';
      }
      if (experienceLevel < 20){
        return 'Student';
      }
      if (experienceLevel < 30){
        return 'First Job Hunt';
      }
      if (experienceLevel < 40){
        return 'Junior';
      }
      if (experienceLevel < 60){
        return 'Mid-level';
      }
      return 'Senior';
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
    height: calc(100% - #{$margin});

    .body {
      height: 100%;
      padding: 1em;
      overflow: hidden;
    }
  }
}

</style>
