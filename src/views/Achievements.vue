<template>
  <div
    class="root"
  >
    <div class="contentContainer">
      <Section
        title="Achievements"
        subtitle="Unlocking achievements earns free gems and adds clout to your dev profile"
      >
        <div id="cards">
          <ImageCard
            v-for="(userAchievement, i) of $store.getters.getUserAchievements"
            :key="i"
            :img-src="userAchievement.ImageURL"
            class="card"
            :class="{'locked': !userAchievement.UnlockedAt}"
          >
            <div
              :ref="`cardbody${i}`"
              class="body"
            >
              <p class="item title">
                {{ userAchievement.Title }}
              </p>

              <p class="item description">
                {{ userAchievement.Description }}
              </p>

              <GemDisplay
                :size="2"
                :text="`${userAchievement.GemReward}`"
              />
            </div>
          </ImageCard>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard';
import Section from '@/components/Section';
import GemDisplay from '@/components/GemDisplay';

import { 
  loadUserAchievements
} from '@/lib/cloudStore.js';

export default {
  components: {
    ImageCard,
    GemDisplay,
    Section
  },
  async mounted(){
    loadUserAchievements(this);
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/backgrounds.scss';
@import '@/styles/consts.scss';

.root {
  display: block;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  background-image: $gray-lines;
  min-height: calc(100vh - #{$bar-height});
}

.contentContainer {
  max-width: 1170px;
  padding: 10px;
  margin: 0 auto;
  @media (max-width: 1024px) {
    max-width: 960px;
  }
}

#cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  .card {
    flex: 1 1 calc(22% - 1em);
    margin: 20px;
    max-width: 250px;
    min-width: 150px;

    &.locked {
      opacity: 0.4;
    }

    .body {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .item {
        margin: 1em;
      }

      .title {
        color: $gold-dark;
        font-size: 1.5em;
        margin: 0em;
      }

      .description {
        color: $white;
        font-weight: 400;
        line-height: 1.3em;
        font-size: 1em;
      }
    }
  }
}

</style>
