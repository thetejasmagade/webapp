<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Writing real code is the only way to learn"
        subtitle="Run the code to move forward"
        class="max-w-2xl w-full"
      >
        <div class="flex flex-col p-4">
          <CodeEditor
            v-model="code"
            class="h-full flex flex-col flex-1 overflow-auto rounded"
            :run-callback="runCode"
            :reset-callback="setCode"
            prog-lang="js"
            :canvas-enabled="false"
          />
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav.vue";
import Section from "@/components/Section.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { reactive } from "vue";
import { notify } from "@/lib/notification.js";
import { useRouter, useRoute } from "vue-router";

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
  },
  setup() {
    const state = reactive({
      code: getCode(),
      done: false,
    });

    state.setCode = () => {
      state.code = getCode(state.lang);
    };

    const router = useRouter();
    const route = useRoute();
    state.runCode = ({ output }) => {
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
      setTimeout(() => {
        router.push({
          name: "SignupFlowUsername",
          query: { redirect: route.query.redirect },
        });
      }, 3000);
    };

    return state;
  },
};
</script>

<style scoped></style>
