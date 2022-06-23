<template>
  <div>
    <Radial
      :fill="percent"
      :radius="24"
      :max-fill="100"
      :stroke-width="5"
      :checkmark="isComplete"
    />
  </div>
</template>

<script>
import Radial from "@/components/radials/Radial.vue";

export default {
  components: {
    Radial,
  },
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isComplete() {
      const maxPercent = 100;
      if (this.percent >= maxPercent) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped></style>
