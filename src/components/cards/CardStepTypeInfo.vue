<template>
  <div class="overflow-y-auto w-full flex flex-col items-center">
    <div class="max-w-4xl">
      <MarkdownViewer ref="viewer" :source="markdownSource" />
      <TabsNavInline
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
import TabsNavInline from "@/components/TabsNavInline.vue";

export default {
  components: {
    MarkdownViewer,
    Section,
    TabsNavInline,
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
    uuid: {
      type: String,
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
