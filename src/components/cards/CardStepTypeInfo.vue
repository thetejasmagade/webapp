<template>
  <div
    class="overflow-y-auto w-full flex flex-col items-center bg-gray-800 h-full"
  >
    <div class="max-w-4xl">
      <div class="mt-4 w-full flex flex-row justify-end">
        <BlockButton
          v-if="$store.getters.getIsLoggedIn && !isStepComplete"
          class="btn mr-3"
          :click="doneWithStep"
        >
          I'm done with this step
        </BlockButton>
      </div>
      <MarkdownViewer ref="viewer" :source="markdownSource" />
      <div class="border-b mx-4 mb-8"></div>
      <BottomOfMarkdownTabsNav
        v-if="isLoggedIn"
        class="mb-4"
        :tabs="[
          { icon: 'hand', name: 'Help' },
          { icon: 'exclamation-triangle', name: 'Report Issue' },
        ]"
        :uuid="uuid"
        unit-type="step"
      />
    </div>
    <Section class="block lg:hidden" title="Come back on a computer">
      <p class="p-4">
        Coding is hard to do on a phone. I want you to have a great experience,
        so please hurry back on a larger device.
      </p>
    </Section>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import Section from "@/components/Section.vue";
import BottomOfMarkdownTabsNav from "@/components/navs/BottomOfMarkdownTabsNav.vue";

export default {
  components: {
    MarkdownViewer,
    Section,
    BottomOfMarkdownTabsNav,
    BlockButton,
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
    isStepComplete: {
      type: Boolean,
      required: true,
    },
  },
  async mounted() {
    this.scrollMarkdownToTop();
  },
  methods: {
    scrollMarkdownToTop() {
      requestAnimationFrame(() => {
        if (this.$refs.viewer && this.$refs.viewer.$el) {
          this.$refs.viewer.$el.scrollTop = 0;
        }
      });
    },
  },
};
</script>

<style scoped></style>
