<template>
  <tr class="hover:bg-gray-750">
    <td class="whitespace-nowrap hidden lg:table-cell text-center">
      <router-link
        :to="
          $store.getters.getIsLoggedIn
            ? getUnitLink(unit)
            : getUnitLinkLanding(unit)
        "
        class="p-4 block"
      >
        <div class="flex items-center justify-center">
          <Radial
            :from-percent="0"
            :to-percent="calcPercent"
            :checkmark="calcPercent === 100"
          />
        </div>
      </router-link>
    </td>

    <td class="whitespace-nowrap hidden lg:table-cell">
      <router-link
        :to="
          $store.getters.getIsLoggedIn
            ? getUnitLink(unit)
            : getUnitLinkLanding(unit)
        "
        class="p-4 block"
      >
        <div class="flex items-center justify-center mr-8">
          <span
            v-if="isNext"
            class="inline-flex text-4xl font-bold items-center text-blue-400 animate-bounceHorizontal"
          >
            <FontAwesomeIcon icon="arrow-right" class="ml-2" />
          </span>

          <span v-else class="text-3xl text-gray-300">{{ index }}</span>
        </div>
      </router-link>
    </td>

    <td class="whitespace-nowrap text-md hidden lg:table-cell">
      <router-link
        :to="
          $store.getters.getIsLoggedIn
            ? getUnitLink(unit)
            : getUnitLinkLanding(unit)
        "
        class="p-4 block"
      >
        <div class="flex flex-row">
          <div class="text-4xl">
            <img class="h-12 w-12 rounded" :src="iconUrl" />
          </div>
        </div>
      </router-link>
    </td>

    <td class="whitespace-nowrap">
      <router-link
        :to="
          $store.getters.getIsLoggedIn
            ? getUnitLink(unit)
            : getUnitLinkLanding(unit)
        "
        class="p-2 lg:p-4 block"
      >
        <div class="flex items-center">
          <div class="ml-4">
            <div
              class="text-md lg:text-2xl underline font-medium mb-2 text-blue-400"
            >
              {{ unitData.Title }}
            </div>
            <div class="text-gray-400">
              <FontAwesomeIcon :icon="unit.project ? 'tools' : 'book'" />
              {{ unitData.EstimatedCompletionTimeHours }} hour
              {{ unit.project ? "project" : "course" }}
            </div>
          </div>
        </div>
      </router-link>
    </td>
  </tr>
</template>

<script>
import { getUnitData, getUnitLink, getUnitLinkLanding } from "@/lib/unit.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getUnitsProgress } from "@/lib/cloudClient.js";
import Radial from "@/components/Radial.vue";

export default {
  components: {
    FontAwesomeIcon,
    Radial,
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
