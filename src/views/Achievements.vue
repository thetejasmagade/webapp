<template>
  <div
    id="container"
  >
    <div id="title">
      <span>
        Achievements
      </span>
    </div>

    <div id="sub-title">
      <span>
        Unlocking achievements earns free gems and addss clout to your dev profile
      </span>
    </div>

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
            :cost="userAchievement.GemReward"
          />
        </div>
      </ImageCard>
    </div>
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard';
import GemDisplay from '@/components/GemDisplay';

import { 
  loadUserAchievements
} from '@/lib/cloudStore.js';

export default {
  components: {
    ImageCard,
    GemDisplay
  },
  async mounted(){
    loadUserAchievements(this);
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#container {
  display: block;
  flex-direction: column;
  text-align: center;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  background-image: linear-gradient(135deg, transparent 0%, transparent 6%,rgba(71, 71, 71,0.04) 6%, rgba(71, 71, 71,0.04) 22%,transparent 22%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 20%,rgba(71, 71, 71,0.04) 20%, rgba(71, 71, 71,0.04) 47%,transparent 47%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(71, 71, 71,0.04) 24%, rgba(71, 71, 71,0.04) 62%,transparent 62%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 73%,rgba(71, 71, 71,0.04) 73%, rgba(71, 71, 71,0.04) 75%,transparent 75%, transparent 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255));
}

#title{
  padding: 20px;
  position: relative;
  color: $gray-dark;
  font-size: 3em;
}

#sub-title {
  text-align: center;
  color: $gray-mid;
  font-size: 1.5em;
  margin-bottom: 20px;
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
