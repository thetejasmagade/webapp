<template>
  <div class="relative wrap overflow-hidden p-10 h-full">
    <div
      class="
        border-2-2
        absolute
        border-opacity-20 border-gray-700
        h-full
        border
        hidden
        lg:block
      "
      style="left: 50%"
    />

    <div v-if="!isUnitsLoaded">
      <div
        v-for="(unit, i) of numSkeletonCards"
        :key="i"
      >
        <div
          class="flex justify-center items-center w-full"
          :class="{
            'flex-row-reverse': i % 2 === 0,
            'lg:-mt-48': i > 0,
          }"
        >
          <div
            class="order-1 w-1/3 lg:w-2/5 hidden lg:block max-w-md"
          />

          <div
            class="
            z-20
            items-center
            order-1
            shadow-xl
            w-12
            h-12
            rounded-full
            hidden
            lg:flex
            justify-center
            bg-gray-400
          "
          >
            <h1 class="mx-auto text-white font-semibold text-md">
              {{ i % 2 === 0 ? "←" : null }} {{ i + 1 }}
              {{ i % 2 !== 0 ? "→" : null }}
            </h1>
          </div>
          <div class="order-1 md:w-1/3 lg:w-2/5 w-full items-center max-w-md flex-1">
            <ImageCardSkeleton v-if="!isUnitsLoaded" />
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div
      
        v-for="(unit, i) of units"
        :key="i"
      >
        <div
          class="flex justify-center items-center w-full"
          :class="{
            'flex-row-reverse': i % 2 === 0,
            'lg:-mt-48': i > 0,
          }"
        >
          <div
            class="order-1 w-1/3 lg:w-2/5 hidden lg:block max-w-md"
          />

          <div
            class="
            z-20
            items-center
            order-1
            shadow-xl
            w-12
            h-12
            rounded-full
            hidden
            lg:flex
            justify-center
          "
          
            :class="{ 'bg-blue-400': i === firstIncompleteIndex, 
                      'bg-green-500': isComplete(unit),
                      'bg-gray-400': !isComplete(unit)}"
          >
            <h1
              v-if="isComplete(unit)"
              
              class="
              mx-auto
              text-white
              font-semibold
              text-md"
            >
              {{ "✔" }} 
            </h1>
            
            <h1
              v-else-if="i === firstIncompleteIndex"
              class="mx-auto text-white font-semibold text-md"
            >
              {{ i % 2 === 0 ? "←" : null }} {{ i + 1 }}
              {{ i % 2 !== 0 ? "→" : null }}
            </h1>

            <h2
              v-else-if="!isComplete(unit)"
              class="mx-auto text-white font-semibold text-md"
            >
              {{ i + 1 }}
            </h2>
          </div>
          <div class="order-1 md:w-1/3 lg:w-2/5 w-full items-center max-w-md flex-1">
            <ImageCard
              :img-src="getUnitData(unit).ImageURL"
              :click="() => clickCallback(unit)"
              class="lg:mx-8"
            >
              <UnitCardBody :unit="unit" />
            </ImageCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ImageCard from '@/components/ImageCard.vue';
import UnitCardBody from '@/components/UnitCardBody.vue';
import { getUnitData } from '@/lib/unit.js';
import ImageCardSkeleton from '@/components/ImageCardSkeleton.vue';

export default {
  components: {
    ImageCard,
    UnitCardBody,
    ImageCardSkeleton
  },
  props: {
    clickCallback: {
      type: Function,
      required: false,
      default: () => {}
    },
    numSkeletonCards: {
      type: Number,
      required: false,
      default: 5
    },
    units: {
      type: Array,
      required: true
    }
  },
  computed: {
    isUnitsLoaded() {
      return this.units.length > 0;
    },
    firstIncompleteIndex() {
      for (let i = 0; i < this.units.length; i++) {
        if (!this.units[i].course.CompletedAt) {
          return i;
        }  
        else if(!this.units[i].project.CompletedAt)
          return i;
      }
      return null;
    }
  },
  methods: {
    getUnitData,
    isComplete(unit) {
      return getUnitData(unit).CompletedAt;
    }
  }
};
</script>

<style scoped>
</style>
