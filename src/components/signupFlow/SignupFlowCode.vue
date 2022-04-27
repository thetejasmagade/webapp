<template>
  <Section
    title='Click the "Run" button to move on'
    subtitle="Writing real code is the only way to learn"
    class="max-w-2xl w-full"
  >
    <div class="flex flex-col p-4 items-center" style="min-height: 500px">
      <CodeEditor
        v-model="code"
        class="flex flex-col flex-1 overflow-auto rounded border-2 border-gray-500 mb-4"
        :run-callback="runCode"
        :reset-callback="setCode"
        prog-lang="js"
        :canvas-enabled="false"
      />
      <BlockButton v-if="done" :click="onDone"> Continue </BlockButton>
    </div>
  </Section>
</template>

<script>
import Section from "@/components/Section.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import BlockButton from "@/components/BlockButton.vue";
import { reactive, toRefs } from "vue";
import { notify } from "@/lib/notification.js";

function getCode() {
  return `const words = ['videos', 'bore', 'me', 'to', 'death']

function speakTruth(){
  const sentence = words.join(' ')
  console.log(\`\${sentence}!\`)
}

speakTruth()
`;
}
export default {
  components: {
    Section,
    CodeEditor,
    BlockButton,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const state = reactive({
      code: getCode(),
      done: false,
    });

    const setCode = () => {
      state.code = getCode(state.lang);
    };

    const runCode = () => {
      state.done = true;
      notify({
        type: "success",
        text: "Great work!",
      });
    };

    return {
      ...toRefs(state),
      setCode,
      runCode,
    };
  },
};
</script>

<style scoped></style>
