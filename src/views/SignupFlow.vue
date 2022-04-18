<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <SignupFlowCode v-if="flowIndex === 0" :on-done="onDone" />
      <SignupFlowUsername v-else-if="flowIndex === 1" :on-done="onDone" />
      <SignupFlowMethod v-else-if="flowIndex === 2" :on-done="onDone" />
      <SignupFlowCommunity v-else-if="flowIndex === 3" :on-done="onDone" />
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/navs/TopNav.vue";
import SignupFlowCode from "@/components/signupFlow/SignupFlowCode.vue";
import SignupFlowCommunity from "@/components/signupFlow/SignupFlowCommunity.vue";
import SignupFlowMethod from "@/components/signupFlow/SignupFlowMethod.vue";
import SignupFlowUsername from "@/components/signupFlow/SignupFlowUsername.vue";

import {
  eventTutorialComplete,
  eventCompleteSignupFlow,
} from "@/lib/analytics.js";
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: {
    TopNav,
    SignupFlowCode,
    SignupFlowCommunity,
    SignupFlowMethod,
    SignupFlowUsername,
  },
  setup() {
    const state = reactive({
      flowIndex: 0,
    });
    const router = useRouter();
    const route = useRoute();
    const onDone = async () => {
      eventCompleteSignupFlow(state.flowIndex);

      state.flowIndex++;
      if (state.flowIndex > 3) {
        eventTutorialComplete();
        router.push({
          name: "Courses",
          query: { redirect: route.query.redirect },
        });
        return;
      }
    };
    return {
      ...toRefs(state),
      onDone,
    };
  },
};
</script>

<style scoped></style>
