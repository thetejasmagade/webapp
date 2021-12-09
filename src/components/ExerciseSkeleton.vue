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
          height="20%"
          width="40%"
          class="
        mt-5
        my-2
        ml-10"
        />
        <Skeletor 
          height="10%"
          width="70%"
          class="
        ml-10"
        />
        
        <Skeletor 
          height="10%"
          width="85%"
          class="
        ml-10
        my-2"
        />
        <Skeletor 
          height="10%"
          width="75%"
          class="
        ml-10
        my-2"
        />

        <Skeletor 
          height="45%"
          width="20%"
          class="
        mt-5
        my-2
        ml-10"
        />
      </div>
      <!-- Right side Skeleton -->
      <div> 
        <Skeletor 
          height="20%"
          width="40%"
          class="
        mt-5
        my-2
        ml-10"
        />
        <Skeletor 
          height="10%"
          width="70%"
          class="
        ml-10"
        />
        
        <Skeletor 
          height="10%"
          width="85%"
          class="
        ml-10
        my-2"
        />
        <Skeletor 
          height="10%"
          width="75%"
          class="
        ml-10
        mr-2"
        />

        <Skeletor 
          height="45%"
          width="20%"
          class="
        mt-5
        my-2
        ml-10"
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
