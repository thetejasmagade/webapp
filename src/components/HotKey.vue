<template>
  <div>
    <hotkeys
      v-if="this.$route.name == 'Course'"
      :shortcuts="['P', 'A']"
      :debug="false"
      @triggered="gotoPreviousPage"
    />
    <hotkeys
      v-if="this.$route.name == 'Course'"
      :shortcuts="['D', 'M']"
      :debug="false"
      @triggered="gotoNextPage"
    />
  </div>
</template>

<script>
import Hotkeys from "vue-hotkeys-rt";

export default {
  components: {
    Hotkeys,
  },
  props: {
    backLink: {
      type: Object,
      required: false,
      default: null,
    },
    forwardLink: {
      type: Object,
      required: false,
      default: null,
    },
  },
  methods: {
    gotoPreviousPage() {
      if (this.$route.name == "Course") {
        this.$router.push(this.backLink);
      }
    },
    gotoNextPage() {
      if (this.$route.name == "Course") {
        this.$router.push(this.forwardLink);
      }
    },
  },
};
</script>

<style></style>
