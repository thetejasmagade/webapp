<template>
  <div
    class="flex flex-col justify-between"
  >
    <div class="flex flex-row justify-end mb-2">
      <div class="text-red-500 mr-5">
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
        class="text-green-500 mr-5"
      >
        <Tooltip
          :text="interests.join('\n')"
          color="green"
        >
          <FontAwesomeIcon
            icon="tags"
          />
        </Tooltip>
      </div>
      <div
        v-if="prereqs.length > 0 "
        class="text-blue-500 mr-5"
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
      <div class="text-gray-500 mr-5">
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

    <h2 class="text-xl underline mb-4">
      <a @click="() => { goToCourse(course) }">{{ course.Title }}</a>
    </h2>
            
    <p class="mb-4 text-gray-500 text-sm">
      {{ course.Description }}
    </p>

    <div
      v-if="course.IsComplete"
    >
      <div class="text-green-700 text-center">
        <FontAwesomeIcon
          icon="check"
          class="mr-2"
        />
        <span>Complete</span>
      </div>
    </div>

    <div class="flex flex-row justify-end">
      <span
        class="gray link"
        target="_blank"
        @click.stop="() => {linkClick(course.LandingPage)}"
      >
        More Info
      </span>
    </div>
  </div>
</template>

<script>
import { 
  loadAllInterests
} from '@/lib/cloudStore.js';

import Tooltip from '@/components/Tooltip.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { 
  gtmEventSelectCourse
} from '@/lib/gtm.js';

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
    },
    goToCourse(course){
      gtmEventSelectCourse(course.UUID, course.Title);
      this.$router.push({name: 'Exercise', params: {courseUUID: course.UUID}});
    }
  }
};
</script>

<style scoped>

</style>
