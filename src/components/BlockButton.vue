<template>
  <router-link
    v-if="link"
    :to="link"
    class="disabled:cursor-not-allowed focus:outline-none py-2 px-4 rounded active-scale-103 shadow"
    :class="colors"
    :disabled="disabled"
    :style="{
      cursor: disabled ? 'not-allowed' : 'pointer',
    }"
  >
    <slot />
  </router-link>

  <button
    v-else
    type="submit"
    class="disabled:cursor-not-allowed focus:outline-none py-2 px-4 rounded active-scale-103 shadow"
    :class="colors"
    :disabled="disabled"
    :style="{
      cursor: disabled ? 'not-allowed' : 'pointer',
    }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    click: {
      type: Function,
      required: false,
      default: () => {},
    },
    color: {
      type: String,
      required: false,
      default: "blue",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    link: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    colors() {
      return {
        "text-white": this.color !== "white",

        "bg-gray-500": this.color === "gray",
        "hover:bg-gray-700": this.color === "gray",
        "disabled:bg-gray-500": this.color === "gray",

        "bg-gray-400": this.color === "gray-light",
        "hover:bg-gray-300": this.color === "gray-light",
        "disabled:bg-gray-300": this.color === "gray-light",

        "bg-green-700": this.color === "green",
        "hover:bg-green-800": this.color === "green",
        "disabled:bg-green-600": this.color === "green",

        "bg-blue-500": this.color === "blue",
        "hover:bg-blue-600": this.color === "blue",
        "disabled:bg-blue-400": this.color === "blue",

        "bg-blue-400": this.color === "blue-light",
        "hover:bg-blue-300": this.color === "blue-light",
        "disabled:bg-blue-300": this.color === "blue-light",

        "bg-gold-500": this.color === "gold",
        "hover:bg-gold-600": this.color === "gold",
        "disabled:bg-gold-400": this.color === "gold",

        "bg-red-500": this.color === "red",
        "hover:bg-red-600": this.color === "red",
        "disabled:bg-red-400": this.color === "red",

        "text-blue-600": this.color === "white",
        "bg-white": this.color === "white",
        "hover:bg-gray-200": this.color === "white",
        "disabled:bg-gray-200": this.color === "white",
      };
    },
  },
};
</script>

<style scoped>
.active-scale-103:hover {
  transform: scale(1.03);
}
</style>
