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
    <div
      v-for="(unit, i) of unitCards"
      :key="i"
    >
      <div
        class="flex justify-center items-center w-full left-timeline"
        :class="{
          'left-timeline': i % 2 === 0,
          'right-timeline': i % 2 !== 0,
          'flex-row-reverse': i % 2 === 0,
          'lg:-mt-48': i > 0,
        }"
      >
        <div class="order-1 w-1/3 hidden lg:block" />
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
          "
          :class="{ 'bg-gray-400': i > 0, 'bg-blue-500': i === 0 }"
        >
          <h1 class="mx-auto text-white font-semibold text-md">
            {{ i % 2 === 0 ? "←" : null }} {{ i + 1 }}
            {{ i % 2 !== 0 ? "→" : null }}
          </h1>
        </div>
        <div class="order-1 lg:w-1/3 sm:w-full items-center">
          <ImageCardSkeleton v-if="!isUnitsLoaded" />
          <ImageCard
            v-else
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
    }
  },
  methods: {
    getUnitData
  }
};
</script>

<style scoped>
</style>
