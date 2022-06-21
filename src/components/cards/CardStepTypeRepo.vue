<template>
  <div class="overflow-y-auto w-full flex flex-col items-center bg-gray-800">
    <div class="hidden lg:block max-w-4xl">
      <div class="mt-4 w-full flex flex-row justify-end">
        <TextInput
          v-model="repoLink"
          class="w-full"
          placeholder="paste a link to your git repository here"
          type="text"
        />
        <BlockButton
          v-if="$store.getters.getIsLoggedIn"
          class="btn ml-3"
          :click="() => doneWithStep(repoLink)"
          :disabled="!(repoLink?.length > 0)"
        >
          Submit
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
import Section from "@/components/Section.vue";
import BottomOfMarkdownTabsNav from "@/components/navs/BottomOfMarkdownTabsNav.vue";
import { reactive, toRefs } from "@vue/reactivity";
import TextInput from "@/components/TextInput.vue";

export default {
  components: {
    MarkdownViewer,
    BlockButton,
    Section,
    BottomOfMarkdownTabsNav,
    TextInput,
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
  setup() {
    const state = reactive({
      repoLink: null,
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped></style>
