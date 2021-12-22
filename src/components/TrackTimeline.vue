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

    <!-- While data is loading, render skeleton cards / placeholder data --> 

    <template v-if="!isUnitsLoaded">
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
          "
            :class="{ 'bg-gray-400': i > 0, 'bg-blue-500': i === 0}"
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
    </template>


    <!-- If data is not finished loading, render this --> 

    <template v-else>
      <div
        v-for="(unit, i) of unitCards"
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
            :class="{ 'bg-gray-400': i > 0, 'bg-blue-500': i === 0}"
          >
            <!-- create green for completed courses (check mark??)
        create blue for current course
        grey otherwise  ✔ -->
          
            <h1 class="mx-auto text-white font-semibold text-md">
              {{ i % 2 === 0 ? "←" : null }} {{ i + 1 }}
              {{ i % 2 !== 0 ? "→" : null }}
            </h1>
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
    </template>
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
    unitCards() {
      return this.units.length === 0 ? this.numSkeletonCards : this.units;
    },
    isUnitsLoaded() {
      return this.units.length > 0;
    },
    checkCompletion(course) {  
      console.log(course);
      return !this.getUnitData(course).CompletedAt;
    }
    // fakeData() {
    // javascript map (This.unitcards.map(unitcard => {
    // unitcard.CompletedAt = 123;
    //}))
    //}
  },
  methods: {
    getUnitData
  }
};
</script>

<style scoped>
</style>
