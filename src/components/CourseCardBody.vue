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
          :text="`Tags:\n${interests.join('\n')}`"
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
          :text="`Prerequsites:\n${prereqs.join('\n')}`"
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
            
    <span class="title item">
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
        <BlockButton
          :click="clickBuyDemoCourse"
          class="btn"
          color="gray"
        >
          <GemDisplay
            :size=".5"
            class="flex-1 margin-neg-10"        
            :text="`${course.GemDemoCost} Demo`"
            text-color="gray-lightest"
          />
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
        <BlockButton
          :click="clickBuyCourse"
          color="purple"
          class="btn"
        >
          <GemDisplay
            :size=".5"
            class="flex-1 margin-neg-10"
            text-color="gray-lightest"
            :text="`${course.GemCost}`"
          />
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
  padding: 0 1em 0 1em;
}

.title {
  color: $gold-dark;
  font-size: 1.3em;
}

.buy-buttons{
  display: flex;
  flex-direction: row;
  justify-content: center;

  .btn {
    font-size: 14px;
    width: 100%;
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
  margin: 10px 15px 0 15px;

  &.bottom{
    margin: 10px;
  }
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.margin-neg-10 {
  margin: -10px;
}

</style>
