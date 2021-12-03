<template>
  <div>
    <Skeletor height="16vw" style="min-height: 300px" class="mx-8" />
    <Skeletor height="4vw" class="m-8 my-3" />
  </div>
</template>

<script>
import { Skeletor } from "vue-skeletor";
import "vue-skeletor/dist/vue-skeletor.css";
export default {
  components: {
    Skeletor,
  },
};
</script>
