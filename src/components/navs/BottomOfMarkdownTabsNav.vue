<template>
  <div class="block list-none m-0 p-0 ml-2 mr-2">
    <div
      v-for="(tab, i) of tabs"
      :key="i"
      class="py-3 px-4 rounded-t mr-2 inline-block cursor-pointer hover:bg-gray-750"
      :class="{
        'bg-gray-750': i === currentTabIndex,
        'bg-gray-700': i !== currentTabIndex,
      }"
      @click="setCurrentTabindex(i)"
    >
      <FontAwesomeIcon :icon="tab.icon" class="md:mr-4 mx-1" />

      <span class="md:inline-block hidden text-sm">
        {{ tab.name }}
      </span>
    </div>
    <div class="bg-gray-750 p-4 rounded-r rounded-b">
      <InsightView v-if="currentTabIndex === 0" :exercise-u-u-i-d="uuid" />
      <div v-if="currentTabIndex === 1 && isHintAvailable">
        <HintButton
          v-if="!isHintPurchased && isHintAvailable"
          class="pt-5 pb-5 justify-center items-center"
          :hint-cost="hintCost"
          :hint-callback="hintCallback"
          :is-hint-available="isHintAvailable"
        />
        <MarkdownViewer v-if="isHintPurchased" :source="hintMarkdownSource" />
      </div>
      <div
        v-if="
          currentTabIndex === 2 || (currentTabIndex === 1 && !isHintAvailable)
        "
      >
        <h1 class="text-lg mb-4 ml-4 pt-4">
          Is there something we can do to make this exercise better?
        </h1>
        <textarea
          v-model="commentText"
          placeholder="Let us know how to improve this page"
          class="autoexpand tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-700 rounded focus:outline-none"
          rows="4"
        />
        <BlockButton :click="btnClick" class="mb-4 ml-4"> Submit </BlockButton>
        <p class="ml-4">
          If you'd rather have a conversation with the authors and other
          students directly join our
          <a
            href="https://discord.gg/EEkFwbv"
            target="_blank"
            class="underline text-blue-400 hover:text-blue-300"
            >Discord community instead.</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import HintButton from "@/components/HintButton.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import InsightView from "@/components/InsightView.vue";

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
    InsightView,
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
      currentTabIndex: 0,
    };
  },
  computed: {
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
        this.commentText = null;
        this.rating = null;
        this.stars = 3;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    setCurrentTabindex(i) {
      this.currentTabIndex = i;
    },
  },
};
</script>

<style scoped></style>
