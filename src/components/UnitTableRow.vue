<template>
  <tr>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center">
        <div class="flex-shrink-0 h-10 w-10 items-center rounded-full">
          <svg class="w-20 h-20">
            <circle
              class="text-gray-300"
              stroke-width="5"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="33"
              cy="23"
            />
            <circle
              class="text-gold-600"
              stroke-width="5"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="offset"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="20"
              cx="33"
              cy="23"
            />
            <!-- comment this text tag out to remove the inner number -->
            <text
              x="41%"
              y="30%"
              stroke="black"
              stroke-width=".6px"
              dy=".3em"
              font-size="12"
              text-anchor="middle"
            >
              {{ calcPercent }}%
            </text>
          </svg>
        </div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <router-link :to="getUnitLink(unit)">
        <div class="flex items-center hover:opacity-50">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded" :src="iconUrl" />
          </div>
          <div class="ml-4">
            <div class="text-md font-medium text-gold-600">
              {{ unitData.Title }}
            </div>
            <div class="text-sm text-gray-500">
              {{ unit.project ? "Personal Project" : "Guided Course" }}
            </div>
          </div>
        </div>
      </router-link>
    </td>
    <td class="px-6 py-4 text-ellipsis max-w-md hidden md:table-cell">
      <div class="text-sm text-gray-500">{{ unitData.Description }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
      <span
        class="px-3 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-200 text-blue-700"
      >
        {{ `${unitData.Difficulty}%` }}
      </span>
    </td>
    <td
      class="px-6 py-4 whitespace-nowrap text-md text-gray-500 hidden md:table-cell"
    >
      <FontAwesomeIcon icon="hourglass" /> {{ durationText }}
    </td>
  </tr>
</template>

<script>
import { getUnitData, unitTypeCourse, getUnitLink } from "@/lib/unit.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getUnitsProgress } from "@/lib/cloudClient.js";

export default {
  components: {
    FontAwesomeIcon,
  },
  props: {
    unit: {
      type: Object,
      required: true,
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
        return "https://styles.redditmedia.com/t5_2rc7j/styles/communityIcon_wy4riduoe9k11.png";
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
      if (!this.unit || !this.unitProgress) {
        return 0;
      }
      let progress = this.unitProgress;
      if (this.unit.type === "project") {
        let project = this.unit.project.UUID;
        if (!progress[project]) return 0;
        return Math.round(
          (progress[project].NumDone / progress[project].NumMax) * 100
        );
      } else {
        let course = this.unit.course.UUID;
        if (!progress[course]) return 0;
        return Math.round(
          (progress[course].NumDone / progress[course].NumMax) * 100
        );
      }
    },
    circumference() {
      return 20 * 2 * Math.PI;
    },
    offset() {
      return this.calcOffset();
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
