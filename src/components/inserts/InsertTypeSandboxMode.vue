<template>
  <div>
    <SandboxModeModalInfo :on-done="onDone" />
  </div>
</template>

<script>
import SandboxModeModalInfo from "@/components/SandboxModeModalInfo.vue";

export default {
  components: {
    SandboxModeModalInfo,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup() {},
};
</script>

<style scoped></style>
