<template>
  <div class="group bg-gray-800 rounded sm:p-8 p-4">
    <div v-if="title || subtitle" class="mb-2">
      <div v-if="title">
        <h1 v-if="h1" class="text-blue-400 font-bold relative mb-2 text-3xl">
          {{ title }}
        </h1>
        <h2 v-else class="text-blue-400 font-bold relative mb-2 text-3xl">
          {{ title }}
        </h2>
      </div>
      <div v-if="subtitle">
        <h2 v-if="h1" class="text-gray-300 text-lg">
          {{ subtitle }}
        </h2>
        <h3 v-else class="text-gray-300 text-lg">
          {{ subtitle }}
        </h3>
      </div>
    </div>
    <div class="rounded-full bg-blue-400 h-1.5 w-1/5" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    subtitle: {
      type: String,
      required: false,
      default: null,
    },
    h1: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped></style>
