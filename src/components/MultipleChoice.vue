<template>
  <div class="flex flex-col items-center">
    <div
      class="
        rounded
        w-4/5
        max-w-md
        bg-blue-800
        text-gray-200
        my-8
      "
    >
      <h2 class="my-4 text-lg px-4 max-w-xl">
        {{ question }}
      </h2>
    </div>
    <BlockButton
      v-for="(answer, i) of answers"
      :key="i"
      class="text-lg w-4/5 mb-2 max-w-md"
      color="blue-light"
      :click="() => {callback(answer)}"
      :disabled="locked"
    >
      <span>{{ answer }}</span>
    </BlockButton>
    <BlockButton
      v-if="locked"
      class="text-lg w-4/5 m-4 max-w-md"
      :click="() => {$router.push({name: 'Pricing'});}"
      color="gold"
    >
      <span>Get quiz access</span>
    </BlockButton>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue';

export default {
  components: {
    BlockButton
  },
  props: {
    callback: {
      type: Function,
      required: true
    },
    question: {
      type: String,
      required: false,
      default: ''
    },
    locked: {
      type: Boolean,
      required: false,
      default: false
    },
    answers: {
      type: Array,
      required: false,
      default: () => []
    }
  }
};
</script>

<style scoped>

</style>
