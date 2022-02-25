<template>
  <div class="overflow-y-auto w-full flex flex-col items-center">
    <div class="max-w-4xl">
      <div class="mt-4 w-full flex flex-row justify-end">
        <BlockButton
          v-if="$store.getters.getIsLoggedIn"
          class="btn mr-3"
          :click="doneWithStep"
        >
          I'm done with this step
        </BlockButton>

        <BlockButton :click="linkClick" color="gray">
          <FontAwesomeIcon icon="eye" />
          Cheat
        </BlockButton>
      </div>
      <MarkdownViewer ref="viewer" :source="markdownSource" />
    </div>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    MarkdownViewer,
    BlockButton,
    FontAwesomeIcon,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    projectSlug: {
      type: String,
      required: true,
    },
    stepSlug: {
      type: String,
      required: true,
    },
    doneWithStep: {
      type: Function,
      required: true,
    },
  },
  methods: {
    linkClick() {
      window.open(
        `https://github.com/qvault/projects/tree/main/projects/${this.projectSlug}/${this.stepSlug}/src`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped></style>
