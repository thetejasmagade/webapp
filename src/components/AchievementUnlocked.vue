<template>
  <div
    class="p-4 flex justify-center items-center h-full"
  >
    <Section
      title="Achievement unlocked!"
      subtitle="If you're in Discord, we've published your accomplishment in #achievements"
      class="max-w-4xl"
    >
      <div
        v-if="!claimed"
        class="flex flex-col items-center p-4"
      >
        <h2 class="text-gold-600 text-2xl font-bold">
          {{ achievementEarned?.AchievementTitle }}
        </h2>
        <img
          :src="achievementEarned?.AchievementImageURL"
          class="w-60"
        >
        <h3 class="text-gray-600 text-xl mb-8">
          {{ achievementEarned?.AchievementDescription }}
        </h3>
        <BlockButton
          :click="claim"
          color="blue"
        >
          Claim Gem Reward
        </BlockButton>
      </div>
      <div
        v-else
        class="flex flex-col items-center p-4"
      >
        <img
          src="@/img/gem-5.png"
          class="w-60	"
        >
        <div class="mb-4">
          <h2
            v-if="spinning"
            class="text-gold-600 text-xl"
          >
            Unlocking your gems
          </h2>
          <h2
            v-else
            class="text-gold-600 text-xl"
          >
            Congragulations!
          </h2>
        </div>

        <div class="mb-8">
          <h3
            v-if="spinning"
            class="text-blue-600 text-3xl font-bold"
          >
            {{ gemNum }}...
          </h3>
          <h3
            v-else
            class="text-blue-600 text-3xl font-bold"
          >
            You earned {{ gemNum }} Gems
          </h3>
        </div>
        <BlockButton
          :click="onClickDone"
          color="blue"
        >
          Continue course
        </BlockButton>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import BlockButton from '@/components/BlockButton.vue';

export default {
  components: {
    BlockButton,
    Section
  },
  props: {
    achievementEarned: {
      type: Object,
      required: true
    },
    onDone: {
      type: Function,
      required: true
    }
  },
  data() {
    return{
      claimed: false,
      spinning: false,
      gemNum: 0
    };
  },
  methods: {
    claim(){
      this.claimed = true;
      this.spinning = true;
      const id = setInterval(() => {
        this.gemNum = Math.floor(Math.random() * (this.achievementEarned?.AchievementGemsEarned * 2));
      }, 100);
      setTimeout(() => {
        clearInterval(id);
        this.spinning = false;
        this.gemNum = this.achievementEarned?.AchievementGemsEarned;
      }, 2000);
    },
    onClickDone(){
      this.onDone();
      this.claimed = false;
    }
  }
};
</script>

<style scoped>
</style>
