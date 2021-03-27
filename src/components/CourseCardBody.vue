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

import Tooltip from '@/components/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon,
    Tooltip
  },
  props: { 
    course: {
      type: Object,
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
      color: $pink-mid;
    }
    &.purple {
      color: $purple-mid;
    }
    &.gray {
      color: $gray-mid;
    }
    &.gold {
      color: $gold-mid;
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

.completed {
  color: $green-mid;

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
