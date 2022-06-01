<template>
  <div>
    <!-- TODO: Word smith and create design for Insight Insert -->
  </div>
</template>
<script>
import { markSeen, seenInsightInsertKey } from "@/lib/localStorageLib";

export default {
  components: {},
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  async mounted() {
    markSeen(seenInsightInsertKey);
  },
  methods: {
    onClickDone() {
      this.onDone();
    },
  },
};
</script>

<style scoped></style>
