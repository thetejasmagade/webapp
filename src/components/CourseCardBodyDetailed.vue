<template>
  <div class="body">
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
          Est.
          {{ `~${course.Modules.length * 4} Hours` }}
        </span>
      </div>
      <div
        v-for="(interest, j) of interests"
        :key="j"
        class="pill green"
      >
        <span>
          <FontAwesomeIcon
            icon="tags"
          />
          {{ interest }}
        </span>
      </div>
    </div>
    <p>
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
    click: {
      type: Function,
      required: false,
      default: null
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
.body {
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;

  .btn {
    max-width: 200px;
    font-size: 1.5em;
  }

  p {
    text-align: left;
  }

  .pills {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;

    .pill {
      padding: 5px 20px 5px 20px;
      color: $white;
      font-size: 1em;
      border-radius: 16px;
      margin: 0 1em 1em 0;

      &.green {
        background-color: $green-dark;
      }
      &.pink {
        background-color: $pink-dark;
      }
      &.gray {
        background-color: $gray-dark;
      }
    }
  }
}

</style>
