<template>
  <div
    class="flex flex-col justify-between"
  >
    <div class="flex flex-row justify-end mb-2">
      <div class="text-red-500 mr-5">
        <Tooltip
          :text="`Difficulty ${unitData.Difficulty}%`"
          color="red"
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
        >
          <FontAwesomeIcon
            icon="school"
          />
        </Tooltip>
      </div>
      <div class="text-gray-500 mr-5">
        <Tooltip
          :text="durationText"
          color="gray"
        >
          <FontAwesomeIcon
            icon="hourglass"
          />
        </Tooltip>
      </div>
    </div>
            
    <p class="mb-4 text-gray-500 text-sm">
      {{ unitData.Description }}
    </p>

    <div
      v-if="unitData.CompletedAt"
    >
      <div class="text-green-700 text-center">
        <FontAwesomeIcon
          icon="check"
          class="mr-2"
        />
        <span>Complete</span>
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getUnitData, unitTypeCourse } from '@/lib/unit.js';

export default {
  components: {
    FontAwesomeIcon,
    Tooltip
  },
  props: { 
    unit: {
      type: Object,
      required: true
    }
  },
  computed: {
    durationText(){
      if (this.unit.type === unitTypeCourse){
        return `~${this.unitData.Modules.length * 6} Hours`;
      }
      return `~${this.unitData.Steps.length} Hours`;
    },
    unitData(){
      return getUnitData(this.unit);
    },
    interests(){
      if (!this.unit){
        return [];
      }
      if (this.unitData.Interests){
        return [];
      }
      let interests = [];
      for (const [ interestUUID ]  of Object.entries(this.unitData.Interests)){
        for (const interest of this.$store.getters.getAllInterests){
          if (interestUUID === interest.UUID){
            interests.push(interest.Title);
          }
        }
      }
      return interests;
    },
    prereqs(){
      if (!this.unitData || !this.unitData.PrerequisiteCourseUUIDS){
        return [];
      }
      let prereqs = [];
      for (const uuid of this.unitData.PrerequisiteCourseUUIDS){
        for (const course of this.$store.getters.getCourses){
          if (course.UUID === uuid){
            prereqs.push(course.Title);
          }
        }
      }
      return prereqs;
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped>

</style>
