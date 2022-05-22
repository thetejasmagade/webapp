<template>
  <div>
    <div v-if="!units || units.length === 0" class="flex flex-col">
      <Skeletor
        v-for="i in 12"
        :key="i"
        height="60"
        width="100%"
        class="m-4 my-3 rounded"
      />
    </div>

    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-400">
              <thead class="text-gray-400">
                <tr>
                  <th
                    scope="col"
                    class="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  ></th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  ></th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    Difficulty
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    Avg Time
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-400">
                <UnitTableRow
                  v-for="(unit, i) of units"
                  :key="i"
                  :unit="unit"
                  :index="isOrdered ? i + 1 : null"
                  :is-next="isOrdered ? i === firstIncompleteIndex : null"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
    isOrdered: {
      type: Boolean,
      required: false,
      default: false,
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
