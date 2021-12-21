<template>
  <div
    class="
      group 
      bg-white
      rounded-lg
      shadow-xl
      sm:p-8
      p-2
      text-gray-700
    "
  >
    <div
      v-if="title || subtitle"
    >
      <div
        v-if="title"
        class="
          text-gold-600
          font-bold
          relative
          mb-2
          text-2xl
        "
      >
        {{ title }}
      </div>
      <div
        v-if="subtitle"
        class="text-gray-500"
      >
        {{ subtitle }}
      </div>
    </div>
    <div
      class="
        rounded-full
        bg-blue-400
        h-1.5
        w-1/6
        group-hover:w-1/5
        mt-2
        transition-[width]
        ease-in-out
        duration-300
      "
    />
    <slot />
  </div>
</template>

<script>
export default {
  props: { 
    title: {
      type: String,
      required: false,
      default: null
    },
    subtitle: {
      type: String,
      required: false,
      default: null
    }
  }
};
</script>

<style scoped>
</style>
