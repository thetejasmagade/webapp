<template>
  <div class="flex flex-row">
    <div class="mr-4 flex-2 flex items-center">
      <img
        width="150"
        class="rounded-full"
        loading="lazy"
        :src="profileImageURL"
      />
    </div>
    <div class="flex-1">
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
