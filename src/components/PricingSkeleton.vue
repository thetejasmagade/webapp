<template>
  <div
    class="
    flex-items
    center
    justify-center"
  >
    <div
      class="group
  bg-white
  rounded-lg
  shadow-xl
  sm:p-8
  p-2"
    >
      <Skeletor
        class="
              shadow-lg
              px-6
              py-8
              rounded-lg
              bg-white
              items-center
              flex
              flex-col
              h-full
              w-full
            "
      />
    </div>
      
    <div
      class="group
  bg-white
  rounded-lg
  shadow-xl
  sm:p-8
  p-2"
    >
      <Skeletor
        class="
              shadow-lg
              px-6
              py-8
              rounded-lg
              bg-white
              items-center
              flex
              flex-col
              h-full
              w-full
            "
      />
    </div>
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
