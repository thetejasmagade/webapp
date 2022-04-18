<template>
  <div class="overflow-y-auto w-full flex flex-col items-center bg-gray-800">
    <div class="hidden lg:block max-w-4xl">
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
      <BottomOfMarkdownTabsNav
        v-if="isLoggedIn"
        class="mb-2"
        :tabs="[
          {
            icon: 'comment',
            name: 'Report Issue',
          },
        ]"
        :uuid="uuid"
        unit-type="step"
      />
    </div>
    <div class="block lg:hidden w-full">
      <MarkdownViewer ref="viewer" :source="markdownSource" />
      <Section title="Come back on a computer">
        <p class="p-4">
          Coding is hard to do on a phone. I want you to have a great
          experience, so please hurry back on a larger device.
        </p>
      </Section>
    </div>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Section from "@/components/Section.vue";
import BottomOfMarkdownTabsNav from "@/components/navs/BottomOfMarkdownTabsNav.vue";

export default {
  components: {
    MarkdownViewer,
    BlockButton,
    FontAwesomeIcon,
    Section,
    BottomOfMarkdownTabsNav,
  },
  props: {
    markdownSource: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
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
    uuid: {
      type: String,
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
