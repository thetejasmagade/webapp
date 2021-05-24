<template>
  <div
    class="root"
  >
    <div class="contentContainer">
      <Section
        title="Achievements"
        subtitle="Achievements and gems add clout to your portfolio."
      >
        <div class="p-4">
          <p class="mb-5">
            <a
              v-if="!$store.getters.getUserIsSubscribed"
              @click="$router.push({name: 'Pricing'})"
            >
              Upgrade to a Pro plan to be able to check your answers,
              earn certifications, unlock achievements and support the project.
            </a>
          </p>
          <div class="grid md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-1 gap-4">
            <ImageCard
              v-for="(userAchievement, i) of $store.getters.getUserAchievements"
              :key="i"
              :img-src="userAchievement.ImageURL"
              :class="{'opacity-25': !userAchievement.UnlockedAt}"
            >
              <div
                :ref="`cardbody${i}`"
                class="p-4 flex flex-col items-center"
              >
                <p class="text-gold-600 text-xl mb-2">
                  {{ userAchievement.Title }}
                </p>

                <p class="text-center">
                  {{ userAchievement.Description }}
                </p>

                <GemDisplay
                  :size="2"
                  :text="`${userAchievement.GemReward}`"
                />
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard.vue';
import Section from '@/components/Section.vue';
import GemDisplay from '@/components/GemDisplay.vue';

import { 
  loadUserAchievements
} from '@/lib/cloudStore.js';

export default {
  metaInfo() {
    const title = 'Qvault - Achievements';
    return {
      title: title,
      meta: [
        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
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

<style scoped>

</style>
