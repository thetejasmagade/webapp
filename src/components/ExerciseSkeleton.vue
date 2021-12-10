<template>
  <div
    grid 
    gap-4 
    grid-cols-2
  >
    <Skeletor 
      height="70"
      width="100%"
      class="
      grid
      gap-4
      grid-cols-2"
    />
    <!-- Left side skeleton -->
    <div
      class="
    grid
    gap-4
    grid-cols-2"
    >
      <div>
        <Skeletor 
          height="60"
          width="40%"
          class="
            rounded
            mt-5
            my-2
            ml-10
          "
        />
        <Skeletor
          v-for="i in 12"
          :key="i"
          height="20"
          width="75%"
          :class="{'mt-5': i === 1}"
          class="
            rounded
            my-2
            ml-10
          "
        />     

        <Skeletor 
          height="50"
          width="60%"
          class="
            mt-5
            my-2
            ml-10
          "
        />
      </div>
      <!-- Right side Skeleton -->
      <div>
        <Skeletor 
          height="60"
          width="40%"
          class="
            rounded
            mt-5
            my-2
            ml-10
          "
        />
        <Skeletor
          v-for="i in 12"
          :key="i"
          height="20"
          width="75%"
          :class="{'mt-5': i === 1}"
          class="
            rounded
            my-2
            ml-10
          "
        />     

        <Skeletor 
          height="50"
          width="60%"
          class="
            mt-5
            my-2
            ml-10
          "
        />
      </div>
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
