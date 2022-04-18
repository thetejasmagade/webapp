<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Writing real code is the only way to learn"
        subtitle="Run the code to move on"
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
          <BlockButton
            :disabled="!done"
            :link="{
              name: 'SignupFlowMethod',
              query: { redirect: $route.query.redirect },
            }"
          >
            Continue
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/navs/TopNav.vue";
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
const expectedOutput = "videos bore me to death!";

export default {
  components: {
    TopNav,
    Section,
    CodeEditor,
    BlockButton,
  },
  setup() {
    const state = reactive({
      code: getCode(),
      done: false,
    });

    const setCode = () => {
      state.code = getCode(state.lang);
    };

    const runCode = ({ output }) => {
      if (output !== expectedOutput) {
        notify({
          type: "danger",
          text: "Try again!",
        });
        return;
      }
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
