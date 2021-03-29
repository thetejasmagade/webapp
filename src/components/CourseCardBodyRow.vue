<template>
  <div class="body">
    <h2 class="title item">
      <span v-if="i === 0">Your Next Course: </span>
      <span class="gold-color">{{ course.Title }}</span>
    </h2>
    <div class="pills">
      <div
        class="pill pink"
      >
        <span>
          <FontAwesomeIcon
            icon="signal"
          />
          Difficulty:
          {{ course.Difficulty }}
        </span>
      </div>
      <div
        class="pill gray"
      >
        <span>
          <FontAwesomeIcon
            icon="hourglass"
          />
          Time to complete:
          {{ `~${course.Modules.length * 6} Hours` }}
        </span>
      </div>
      <div
        v-for="(interest, j) of interests"
        :key="j"
        class="pill gold"
      >
        <span>
          <FontAwesomeIcon
            icon="tags"
          />
          {{ interest }}
        </span>
      </div>
    </div>
    <p class="title item">
      {{ course.Description }}
    </p>
    <p
      class="gray link"
      target="_blank"
      @click.stop="() => {linkClick(course.LandingPage)}"
    >
      More Info
    </p>
  </div>
</template>

<script>
import { 
  loadAllInterests
} from '@/lib/cloudStore.js';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  props: { 
    course: {
      type: Object,
      required: true
    },
    i: {
      type: Number,
      required: true
    }
  },
  computed: {
    interests(){
      if (!this.course || !this.course.Interests){
        return [];
      }
      let interests = [];
      for (const [ interestUUID ]  of Object.entries(this.course.Interests)){
        for (const interest of this.$store.getters.getAllInterests){
          if (interestUUID === interest.UUID){
            interests.push(interest.Title);
          }
        }
      }
      return interests;
    }
  },
  async mounted(){
    loadAllInterests(this);
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.gold-color {
  color: $gold-mid;
}

.body {
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;

  p {
    max-width: 400px;
  }

  .pills {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;

    .pill{
    padding: 5px 20px 5px 20px;
    color: $white;
    font-size: 1em;
    border-radius: 16px;
    margin: 0 1em 0 0;

    &.gold {
        background-color: $gold-dark;
    }
    &.pink {
        background-color: $pink-dark;
    }
    &.gray {
        background-color: $gray-dark;
    }
    margin-bottom: 1em;
    }
  }
}

</style>
