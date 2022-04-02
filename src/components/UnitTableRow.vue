<template>
  <tr>
    <td class="px-2 py-4 whitespace-nowrap hidden lg:table-cell">
      <span
        v-if="isNext"
        class="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-900 text-blue-100"
      >
        Next →
      </span>
    </td>
    <td class="px-4 py-4 whitespace-nowrap hidden lg:table-cell text-center">
      <ProgressRadial :percent="calcPercent" />
    </td>
    <td class="px-4 py-4 whitespace-nowrap">
      <router-link :to="getUnitLink(unit)">
        <div class="flex items-center hover:opacity-50">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded" :src="iconUrl" />
          </div>
          <div class="ml-4">
            <div class="text-md font-medium text-blue-400">
              {{ unitData.Title }}
            </div>
            <div class="text-sm text-gray-400">
              {{ unit.project ? "Personal Project" : "Guided Course" }}
            </div>
          </div>
        </div>
      </router-link>
    </td>
    <td class="px-4 py-4 hidden lg:table-cell">
      <div class="text-sm">{{ unitData.Description }}</div>
    </td>
    <td class="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
      <span
        class="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-900 text-blue-100"
      >
        {{ `${unitData.Difficulty}%` }}
      </span>
    </td>
    <td class="px-4 py-4 whitespace-nowrap text-md hidden lg:table-cell">
      <FontAwesomeIcon icon="hourglass" /> {{ durationText }}
    </td>
  </tr>
</template>

<script>
import { getUnitData, unitTypeCourse, getUnitLink } from "@/lib/unit.js";
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
      return null;
    },
    durationText() {
      if (this.unit.type === unitTypeCourse) {
        return `~${this.unitData.Modules.length * 6} Hours`;
      }
      return `~${this.unitData.Steps.length} Hours`;
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
