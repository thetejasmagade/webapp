<template>
  <div
    class="flex flex-col lg:items-center overflow-x-hidden lg:overflow-x-auto"
  >
    <div
      v-if="!units || units.length === 0"
      class="flex flex-col items-center w-full"
    >
      <Skeletor
        v-for="i in 12"
        :key="i"
        height="80"
        width="75%"
        class="m-4 my-3 rounded"
      />
    </div>

    <table>
      <tbody
        class="divide-gray-500 border-gray-500 lg:divide-y lg:border border-l-8 border-l-blue-500"
      >
        <UnitTableRow
          v-for="(unit, i) of units"
          :key="i"
          :unit="unit"
          :index="i + 1"
          :is-next="i === firstIncompleteIndex"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import UnitTableRow from "@/components/UnitTableRow.vue";
import { getUnitData } from "@/lib/unit.js";
import { Skeletor } from "vue-skeletor";
import { computed, toRefs } from "vue";
import "vue-skeletor/dist/vue-skeletor.css";

export default {
  components: {
    UnitTableRow,
    Skeletor,
  },
  props: {
    units: {
      type: Array,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const { units } = toRefs(props);
    const firstIncompleteIndex = computed(() => {
      for (let i = 0; i < units.value.length; i++) {
        if (!getUnitData(units.value[i]).CompletedAt) {
          return i;
        }
      }
      return null;
    });
    return {
      getUnitData,
      firstIncompleteIndex,
    };
  },
};
</script>

<style scoped></style>
