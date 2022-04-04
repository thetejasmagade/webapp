<template>
  <div class="grid sm:grid-cols-[150px_minmax(0,_1fr)] xs:grid-cols-1 gap-4">
    <div class="flex items-center justify-center">
      <img width="150" class="rounded" loading="lazy" :src="profileImageURL" />
    </div>
    <div class="">
      <h2 class="text-xl mb-4 text-blue-400">
        {{ title }}
      </h2>
      <p class="mb-4">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profileImageURL: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
