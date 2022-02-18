<template>
  <div>
    <Section
      class="section"
      title="All courses and projects"
      subtitle="Looking for recommendations? We can help you out in the Discord"
    >
      <div
        v-if="!isUnitsLoaded"
        class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4"
      >
        <BrowseCardSkeleton
          v-for="i in numSkeletonCards"
          :key="i"
          class="h-full"
        />
      </div>

      <div
        v-else
        class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4"
      >
        <div v-for="(unit, i) of units" :key="i">
          <ImageCard
            class="h-full"
            :img-src="getUnitData(unit).ImageURL"
            :link="getUnitLink(unit)"
          >
            <UnitCardBody :unit="unit" />
          </ImageCard>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import ImageCard from "@/components/ImageCard.vue";
import UnitCardBody from "@/components/UnitCardBody.vue";
import BrowseCardSkeleton from "@/components/BrowseCardSkeleton.vue";
import { getUnitLink, getUnitData } from "@/lib/unit.js";

export default {
  components: {
    Section,
    ImageCard,
    UnitCardBody,
    BrowseCardSkeleton,
  },
  data() {
    return {
      isLoading: false,
      initialTabIndex: 0,
      numSkeletonCards: 8,
    };
  },
  computed: {
    units() {
      let units = this.$store.getters.getUnits;
      units.sort((unit1, unit2) => {
        return getUnitData(unit1).Difficulty < getUnitData(unit2).Difficulty
          ? -1
          : 1;
      });
      return units;
    },
    isUnitsLoaded() {
      return this.units.length > 0;
    },
  },
  methods: {
    getUnitData,
    getUnitLink,
  },
};
</script>

<style scoped>
.section {
  border-radius: 0 0.5rem 0.5rem 0.5rem;
}
</style>
