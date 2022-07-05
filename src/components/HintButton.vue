<template>
  <div class="flex justify-center">
    <BlockButton class="blue" :click="callback">
      <font-awesome-icon icon="eye" class="mr-2" />
      View Hint
    </BlockButton>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    FontAwesomeIcon,
    BlockButton,
  },
  props: {
    callback: {
      type: Function,
      required: false,
      default: null,
    },
  },
};
</script>

<style scoped></style>
