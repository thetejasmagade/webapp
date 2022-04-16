<template>
  <div class="overflow-y-auto w-full flex flex-col items-center bg-gray-800">
    <div class="max-w-4xl">
      <MarkdownViewer ref="viewer" :source="markdownSource" />
      <div class="p-4">
        <BottomOfMarkdownTabsNav
          v-if="isLoggedIn"
          class="mb-2"
          :tabs="[
            {
              route: 'cs-track',
              componentName: 'CSTrack',
              icon: 'comment',
              name: 'Report Issue',
            },
          ]"
          :uuid="uuid"
          unit-type="exercise"
        />
      </div>
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
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import Section from "@/components/Section.vue";
import BottomOfMarkdownTabsNav from "@/components/BottomOfMarkdownTabsNav.vue";

export default {
  components: {
    MarkdownViewer,
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
    uuid: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
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
