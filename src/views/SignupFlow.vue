<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav />

    <div class="flex flex-col justify-center items-center flex-1">
      <SignupFlowUser v-if="flowIndex === 0" :on-done="onDone" />
      <SignupFlowMethod v-else-if="flowIndex === 1" :on-done="onDone" />
      <SignupFlowCommunity v-else-if="flowIndex === 2" :on-done="onDone" />
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/navs/TopNav.vue";
import SignupFlowCommunity from "@/components/signupFlow/SignupFlowCommunity.vue";
import SignupFlowMethod from "@/components/signupFlow/SignupFlowMethod.vue";
import SignupFlowUser from "@/components/signupFlow/SignupFlowUser.vue";

import {
  eventTutorialComplete,
  eventCompleteSignupFlow,
} from "@/lib/analytics.js";
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: {
    TopNav,
    SignupFlowCommunity,
    SignupFlowMethod,
    SignupFlowUser,
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
      if (state.flowIndex > 2) {
        eventTutorialComplete();
        router.push({
          name: "Tracks",
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
