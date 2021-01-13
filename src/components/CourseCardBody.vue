<template>
  <div
    class="body"
  >
    <div class="icons item">
      <div class="icon pink">
        <Tooltip
          :text="`Difficulty ${course.Difficulty}%`"
          color="pink"
        >
          <FontAwesomeIcon
            icon="signal"
          />
        </Tooltip>
      </div>
      <div
        v-if="interests.length > 0"
        class="icon gold"
      >
        <Tooltip
          :text="`Tags: ${interests.join(', ')}`"
          color="gold"
        >
          <FontAwesomeIcon
            icon="tags"
          />
        </Tooltip>
      </div>
      <div
        v-if="prereqs.length > 0 "
        class="icon purple"
      >
        <Tooltip
          :text="`Prerequsites: ${prereqs.join(', ')}`"
          color="purple"
        >
          <FontAwesomeIcon
            icon="school"
          />
        </Tooltip>
      </div>
      <div class="icon gray">
        <Tooltip
          :text="`~${course.Modules.length * 6} Hours`"
          color="gray"
        >
          <FontAwesomeIcon
            icon="hourglass"
          />
        </Tooltip>
      </div>
    </div>
            
    <span class="title">
      {{ course.Title }}
    </span>

    <div
      v-if="course.IsComplete"
    >
      <div class="completed item">
        <FontAwesomeIcon
          icon="check"
        />
        <span>Complete</span>
      </div>
      <BlockButton
        :click="clickBuyCourse"
        class="btn item"
      >
        Browse Course
      </BlockButton>
    </div>
    <div
      v-else-if="course.IsPurchased"
    >
      <div class="purchased item">
        <FontAwesomeIcon
          icon="check"
        />
        <span>Purchased</span>
      </div>
      <BlockButton
        :click="clickBuyCourse"
        class="btn item"
      >
        Continue Course
      </BlockButton>
    </div>
    <div v-else>
      <div
        v-if="!course.IsDemoPurchased"
        class="buy-buttons item"
      >
        <GemDisplay
          :size="1"
          class="flex-1"
          :text="`${course.GemDemoCost}`"
        />
        <BlockButton
          :click="clickBuyDemoCourse"
          class="btn"
        >
          Get Demo
        </BlockButton>
      </div>
      <div
        v-else
        class="buy-buttons item"
      >
        <BlockButton
          :click="clickBuyDemoCourse"
          class="btn"
          color="gray"
        >
          Start Demo
        </BlockButton>
      </div>

      <div class="buy-buttons item">
        <GemDisplay
          :size="1"
          class="flex-1"
          :text="`${course.GemCost}`"
        />
        <BlockButton
          :click="clickBuyCourse"
          :color="course.IsDemoPurchased ? 'purple' : 'gray'"
          class="btn"
        >
          Get Course
        </BlockButton>
      </div>
    </div>

    <div class="item links bottom">
      <span
        class="gray link"
        target="_blank"
        @click.stop="() => {linkClick(course.LandingPage)}"
      >More Info</span>
    </div>
  </div>
</template>

<script>
import { 
  loadAllInterests
} from '@/lib/cloudStore.js';

import GemDisplay from '@/components/GemDisplay';
import BlockButton from '@/components/BlockButton';
import Tooltip from '@/components/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    GemDisplay,
    BlockButton,
    FontAwesomeIcon,
    Tooltip
  },
  props: { 
    course: {
      type: Object,
      required: true
    },
    clickBuyDemoCourse: {
      type: Function,
      required: true
    },
    clickBuyCourse: {
      type: Function,
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
    },
    prereqs(){
      if (!this.course || !this.course.PrerequisiteCourseUUIDS){
        return [];
      }
      let prereqs = [];
      for (const uuid of this.course.PrerequisiteCourseUUIDS){
        for (const course of this.$store.getters.getCourses){
          if (course.UUID === uuid){
            prereqs.push(course.Title);
          }
        }
      }
      return prereqs;
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

.icons {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  .icon {
    &.pink {
      color: $pink-lighter;
    }
    &.purple {
      color: $purple-lighter;
    }
    &.gray {
      color: $gray-lighter;
    }
    &.gold {
      color: $gold-lighter;
    }
  }
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  color: $gold-dark;
  font-size: 1.5em;
}

.buy-buttons{
  display: flex;
  flex-direction: row;
  justify-content: center;

  .btn {
    margin-left: 1em;
    font-size: 1em;
    min-width: 150px;
  }
}

.completed {
  color: $green-light;

  span {
    margin-left: 10px;
  }
}

.purchased {
  color: $gold-lighter;

  span {
    margin-left: 10px;
  }
}

.item{
  margin: 10px 10px 0 10px;

  &.bottom{
    margin: 0 0 10px 0;
  }
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

</style>
