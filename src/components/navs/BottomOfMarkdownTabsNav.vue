<template>
  <div class="block list-none m-0 p-0 ml-2 mr-2">
    <div
      v-for="(tab, i) of tabs"
      :key="i"
      class="py-3 px-4 rounded-t mr-2 inline-block cursor-pointer hover:bg-gray-750"
      :class="{
        'bg-gray-750': tab.name === currentTabName,
        'bg-gray-700': tab.name !== currentTabName,
      }"
      @click="setCurrentTabName(tab.name)"
    >
      <FontAwesomeIcon :icon="tab.icon" class="md:mr-4 mx-1" />

      <span class="md:inline-block hidden text-sm">
        {{ tab.name }}
      </span>
    </div>
    <div class="bg-gray-750 p-4 rounded-r rounded-b">
      <div v-if="currentTabName === 'Help'">
        <h3 class="text-lg mb-4 ml-4 pt-4">Stuck or need help?</h3>
        <p class="ml-4">
          Join our
          <a
            href="https://discord.gg/EEkFwbv"
            target="_blank"
            class="underline text-blue-400 hover:text-blue-300"
            >Discord community</a
          >
          and post a question in the #course-help or #project-help channel.
        </p>
      </div>
      <div v-if="currentTabName === 'Report Issue'">
        <h3 class="text-lg mb-4 ml-4 pt-4">
          How can we improve this exercise?
        </h3>
        <textarea
          v-model="commentText"
          placeholder="If there's something wrong with this assignment, or something we can do to make it better, let us know here."
          class="autoexpand tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-700 rounded focus:outline-none"
          rows="4"
        />
        <BlockButton
          :disabled="!commentText"
          :click="btnClick"
          class="mb-4 ml-4"
        >
          Submit
        </BlockButton>
        <p class="ml-4">
          If you would rather chat directly with this courses's authors join the
          <a
            href="https://discord.gg/EEkFwbv"
            target="_blank"
            class="underline text-blue-400 hover:text-blue-300"
            >Discord community.</a
          >
        </p>
      </div>
      <div v-if="currentTabName === 'Hint' && isHintAvailable">
        <HintButton
          v-if="!didUserHint && isHintAvailable"
          class="pt-5 pb-5 justify-center items-center"
          :hint-callback="hintCallback"
          :is-hint-available="isHintAvailable"
        />
        <MarkdownViewer v-if="didUserHint" :source="hintMarkdownSource" />
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import HintButton from "@/components/HintButton.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";

import BlockButton from "@/components/BlockButton.vue";
import { notify } from "@/lib/notification.js";

import { toRefs, reactive, computed } from "vue";

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
    didUserHint: {
      type: Boolean,
      required: false,
      default: false,
    },
    hintCallback: {
      type: Function,
      required: false,
      default: null,
    },
    isExerciseComplete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { tabs, uuid, hintMarkdownSource, unitType } = toRefs(props);

    const state = reactive({
      commentText: null,
      currentTabName: tabs.value[0]?.name,
    });

    const isHintAvailable = computed(() => {
      return hintMarkdownSource.value !== null;
    });

    const btnClick = async () => {
      try {
        if (!state.commentText === null) {
          throw "Please enter some feedback before submitting.";
        }
        if (unitType.value === "exercise") {
          await upsertExerciseFeedback(uuid.value, state.commentText);
        } else {
          await upsertStepFeedback(uuid.value, state.commentText);
        }
        notify({
          type: "success",
          text: "Thanks for your feedback!",
        });
        state.commentText = null;
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    };

    const setCurrentTabName = (name) => {
      state.currentTabName = name;
    };

    return {
      ...toRefs(state),
      setCurrentTabName,
      btnClick,
      isHintAvailable,
    };
  },
};
</script>

<style scoped></style>
