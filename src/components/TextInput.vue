<template>
  <input
    class="outline-none border-b border-gray-500 pb-px focus:outline-none focus:border-white"
    :placeholder="placeholder"
    :type="type"
    :value="modelValue"
    style="background: transparent"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },
    placeholder: {
      type: String,
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: false,
      default: "text",
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style scoped></style>
