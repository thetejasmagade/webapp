<template>
  <div>
    <Skeletor
      height="16vw"
      width="21.5vw"
      style="min-height: 300px"
      class="mx-4 rounded"
    />
    <Skeletor
      height="4vw"
      width="21.5vw"
      class="m-4 my-3 rounded"
    />
  </div>
</template>

<script>
import { Skeletor } from 'vue-skeletor';
import 'vue-skeletor/dist/vue-skeletor.css';
export default {
  components: {
    Skeletor
  }
};
</script>
