<template>
  <tr>
    <td class="px-2 py-4 whitespace-nowrap hidden lg:table-cell">
      <span
        v-if="isNext"
        class="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-500 text-gray-100"
      >
        Next →
      </span>
    </td>
    <td class="py-4 whitespace-nowrap hidden lg:table-cell">
      <div class="flex items-center">
        <span v-if="index" class="text-3xl text-gray-300">{{ index }}</span>
      </div>
    </td>
    <td class="py-4 whitespace-nowrap hidden lg:table-cell text-center">
      <ProgressRadial :percent="calcPercent" />
    </td>
    <td class="py-4 whitespace-nowrap">
      <router-link
        :to="
          $store.getters.getIsLoggedIn
            ? getUnitLink(unit)
            : getUnitLinkLanding(unit)
        "
      >
        <div class="flex items-center hover:opacity-50">
          <div class="flex-shrink-0 h-10 w-10 mx-2">
            <img class="h-10 w-10 rounded" :src="iconUrl" />
          </div>
          <div class="ml-4">
            <div class="text-md lg:text-xl underline font-medium text-blue-400">
              {{ unitData.Title }}
            </div>
          </div>
        </div>
      </router-link>
    </td>
    <td class="py-4 whitespace-nowrap text-md hidden lg:table-cell">
      <div class="text-xl text-gray-300">
        <FontAwesomeIcon :icon="unit.project ? 'tools' : 'book'" />
        {{ unit.project ? "Project" : "Course" }}
      </div>
    </td>
    <td
      class="py-4 text-gray-300 whitespace-nowrap text-xl hidden lg:table-cell"
    >
      <FontAwesomeIcon icon="hourglass" />
      {{ unitData.EstimatedCompletionTimeHours }} hours
    </td>
  </tr>
</template>

<script>
import { getUnitData, getUnitLink, getUnitLinkLanding } from "@/lib/unit.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getUnitsProgress } from "@/lib/cloudClient.js";
import ProgressRadial from "@/components/ProgressRadial.vue";

export default {
  components: {
    FontAwesomeIcon,
    ProgressRadial,
  },
  props: {
    unit: {
      type: Object,
      required: true,
    },
    isNext: {
      type: Boolean,
      required: false,
      default: false,
    },
    index: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      unitProgress: null,
      percent: null,
    };
  },
  computed: {
    iconUrl() {
      if (this.interests.includes("Python")) {
        return "https://richstone.github.io/assets/images/logos/python-logo-small.png";
      }
      if (this.interests.includes("JavaScript")) {
        return "https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png";
      }
      if (this.interests.includes("Golang")) {
        return "https://user-images.githubusercontent.com/19890545/150690287-d7a7a4c0-ce89-4c49-8043-5af0348e615e.png";
      }
      return "https://cdn.iconscout.com/icon/free/png-256/code-280-460136.png";
    },
    unitData() {
      return getUnitData(this.unit);
    },
    interests() {
      if (!this.unit) {
        return [];
      }
      let interests = [];
      for (const [interestUUID] of Object.entries(this.unitData.Interests)) {
        for (const interest of this.$store.getters.getAllInterests) {
          if (interestUUID === interest.UUID) {
            interests.push(interest.Title);
          }
        }
      }
      return interests;
    },
    calcPercent() {
      if (!this.unitProgress) {
        return 0;
      }
      const unitData = getUnitData(this.unit);
      unitData.UUID;
      if (!this.unitProgress[unitData.UUID]) {
        return 0;
      }
      return (
        (this.unitProgress[unitData.UUID].NumDone /
          this.unitProgress[unitData.UUID].NumMax) *
        100
      );
    },
  },
  async mounted() {
    this.unitProgress = this.getUnitsProgressIfLoggedIn();
  },
  methods: {
    getUnitLink,
    getUnitLinkLanding,
    async getUnitsProgressIfLoggedIn() {
      if (!this.$store.getters.getIsLoggedIn) {
        return;
      }
      try {
        this.unitProgress = await getUnitsProgress();
      } catch (err) {
        console.log(err);
      }
    },
    calcOffset() {
      return this.circumference - (this.calcPercent / 100) * this.circumference;
    },
  },
};
</script>

<style scoped></style>
