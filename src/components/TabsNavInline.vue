<template>
  <div class="block list-none m-0 p-0 ml-2 mr-2">
    <div
      v-for="(tab, i) of tabs"
      :key="i"
      class="py-3 px-4 rounded-t mr-2 inline-block cursor-pointer hover:bg-gray-800"
      :class="{
        'bg-gray-800': tab.name === currentTab,
        'bg-gray-750': tab.name !== currentTab,
      }"
      @click="setCurrentTab(tab.name)"
    >
      <FontAwesomeIcon :icon="tab.icon" class="md:mr-4 mx-1" />

      <span class="md:inline-block hidden text-sm">
        {{ tab.name }}
      </span>
    </div>
    <div v-if="currentTab === 'Report Issue'" class="bg-gray-800">
      <h1 class="text-2xl mb-4 ml-4 pt-4">
        What do you think of this exercise?
      </h1>
      <textarea
        v-model="commentText"
        placeholder="Let us know how to improve this page"
        class="autoexpand tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-800 rounded focus:outline-none"
        rows="4"
      />
      <BlockButton
        :click="
          () => {
            btnClick();
          }
        "
        class="mb-4 ml-4"
      >
        Submit
      </BlockButton>
      <!-- <p class="ml-4">
        If you'd rather speak to the authors and other students directly join
        our
        <a href="https://discord.gg/EEkFwbv" target="_blank"
          >Discord community instead.</a
        >
      </p> -->
    </div>
    <div v-else class="bg-gray-800">
      <HintButton
        v-if="
          !isHintPurchased && isHintAvailable && currentTab === 'Buy/View Hint'
        "
        class="bg-gray-800 pt-5 pb-5 justify-center items-center"
        :hint-cost="hintCost"
        :hint-callback="hintCallback"
        :is-hint-available="isHintAvailable"
      />
      <MarkdownViewer v-if="isHintPurchased" :source="hintMarkdownSource" />
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import HintButton from "@/components/HintButton.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";

import BlockButton from "@/components/BlockButton.vue";
import { notify } from "@/lib/notification.js";

import {
  upsertExerciseFeedback,
  upsertStepFeedback,
} from "@/lib/cloudClient.js";

export default {
  components: {
    FontAwesomeIcon,
    BlockButton,
    HintButton,
    MarkdownViewer,
  },
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    hintMarkdownSource: {
      type: String,
      required: false,
      default: null,
    },
    unitType: {
      type: String,
      required: true,
    },
    isHintPurchased: {
      type: Boolean,
      required: false,
      default: false,
    },
    hintCallback: {
      type: Function,
      required: false,
      default: null,
    },
    hintCost: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      commentText: null,
      rating: null,
      stars: 3,
      currentTab: "Report Issue",
    };
  },
  computed: {
    clearTextArea() {
      let nullText = "";
      return nullText;
    },
    isHintAvailable() {
      if (!this.hintMarkdownSource) {
        return false;
      }
      return true;
    },
  },
  methods: {
    async btnClick() {
      try {
        if (this.commentText === null || "") {
          throw "Please enter some feedback before submitting.";
        }
        if (this.unitType === "exercise") {
          await upsertExerciseFeedback(this.uuid, this.commentText);
        } else {
          await upsertStepFeedback(this.uuid, this.commentText);
        }
        notify({
          type: "success",
          text: "Thanks for your feedback!",
        });
        this.commentText = this.clearTextArea;
        this.rating = null;
        this.stars = 3;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    setCurrentTab(tab) {
      this.currentTab = tab;
    },
  },
};
</script>

<style scoped></style>
