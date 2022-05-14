<template>
  <div class="group bg-gray-800 rounded sm:p-8 p-4">
    <div v-if="title || subtitle" class="mb-2">
      <h2 v-if="title" class="text-blue-400 font-bold relative mb-2 text-3xl">
        {{ title }}
      </h2>
      <h3 v-if="subtitle" class="text-gray-300 text-lg">
        {{ subtitle }}
      </h3>
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
  },
};
</script>

<style scoped></style>
