<template>
  <div class="flex flex-row justify-between bg-gray-300 text-gray-700 whitespace-nowrap">
    <div>
      <BlockButton
        :click="goBack"
        :disabled="!canGoBack"
        :color="canGoBack ? 'green' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-left"
        />
      </BlockButton>
      <BlockButton
        :disabled="!canGoForward"
        class="ml-3"
        :click="goForward"
        :color="canGoForward ? 'green' : 'gray'"
      >
        <FontAwesomeIcon
          icon="arrow-right"
        />
      </BlockButton>
    </div>

    <div
      class="px-10 flex-1 flex items-center justify-center"
      :class="{'text-green-700': isComplete}"
    >
      <SelectDropdown
        v-if="moduleNames && currentModuleIndex !== null"
        :options="moduleNames"
        :default="moduleNames[currentModuleIndex]"
        @update:modelValue="selectModule"
      />
      <SelectDropdown
        v-if="exerciseNames && currentExerciseIndex !== null"
        class="ml-3"
        :options="exerciseNames"
        :default="exerciseNames[currentExerciseIndex]"
        @update:modelValue="selectExercise"
      />
      <FontAwesomeIcon
        v-if="isComplete"
        class="ml-3"
        icon="check"
      />
      <FontAwesomeIcon
        v-else-if="locked"
        class="ml-3 text-red-600"
        icon="lock"
      />
    </div>

    <div class="flex flex-row flex-end">
      <Tooltip
        :text="`Leave Feedback`"
        position="bottom"
      >
        <BlockButton
          :click="clickComment"
          color="gray"
          class="mr-4"
        >
          <FontAwesomeIcon
            icon="comment"
          />
        </BlockButton>
      </Tooltip>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue';
import BlockButton from '@/components/BlockButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SelectDropdown from '@/components/SelectDropdown.vue';


export default {
  components: {
    BlockButton,
    FontAwesomeIcon,
    Tooltip,
    SelectDropdown
  },
  props: {
    modules: {
      type: Array,
      required: false,
      default: null
    },
    exercises: {
      type: Array,
      required: false,
      default: null
    },
    courseUUID: {
      type: String,
      required: false,
      default: null
    },
    currentModuleIndex: {
      type: Number,
      required: false,
      default: null
    },
    currentExerciseIndex: {
      type: Number,
      required: false,
      default: null
    },
    locked: {
      type: Boolean,
      required: false,
      default: false
    },
    isComplete: {
      type: Boolean,
      required: false,
      default: false
    },
    goBack:{
      type: Function,
      required: true
    },
    goForward:{
      type: Function,
      required: true
    },
    canGoBack:{
      type: Boolean,
      required: false,
      default: true
    },
    canGoForward:{
      type: Boolean,
      required: false,
      default: true
    },
    clickComment:{
      type: Function,
      required: false,
      default: null
    }
  },
  computed: {
    moduleNames() {
      if (!this.modules){
        return null;
      }
      let i = 1;
      return this.modules.map(
        module => {
          const name = `${i}. ${module.Title}`;
          i++;
          return name;
        }
      );
    },
    exerciseNames() {
      if (!this.exercises){
        return null;
      }
      const names = [];
      for (let i = 1; i < this.exercises.length +1;i++){
        names.push(`${i}/${this.exercises.length}`);
      }
      return names;
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    },
    selectModule(moduleName){
      let modUUID = null;
      for (const mod of this.modules){
        if (moduleName.includes(mod.Title)){
          modUUID = mod.UUID;
        }
      }
      if (!modUUID){
        return; 
      }
      this.$router.push({
        name: 'Exercise',
        params: {
          courseUUID: this.courseUUID,
          moduleUUID: modUUID
        }
      });
    },
    selectExercise(exerciseName){
      let exerciseIndex = null;
      let i = 0;
      for (const exName of this.exerciseNames){
        if (exerciseName === exName){
          exerciseIndex = i;
          break;
        }
        i++;
      }
      if (!exerciseIndex){
        return; 
      }
      this.$router.push({
        name: 'Exercise',
        params: {
          courseUUID: this.courseUUID,
          moduleUUID: this.modules[this.currentModuleIndex].UUID,
          exerciseUUID: this.exercises[exerciseIndex].UUID
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
