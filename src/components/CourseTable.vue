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
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Progress
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Difficulty
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Avg Completion Time
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <UnitTableRow
                  v-for="(unit, i) of units"
                  :key="i"
                  :unit="unit"
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
  methods: {
    getUnitData,
  },
};
</script>

<style scoped></style>
