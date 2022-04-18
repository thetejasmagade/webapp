<template>
  <div>
    <div
      class="hover:bg-gray-700 cursor-pointer rounded-lg text-lg h-12 flex flex-col justify-center items-center"
      @click="click"
    >
      <FontAwesomeIcon :icon="['fas', icon]" class="mx-2" />
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    FontAwesomeIcon,
  },
  props: {
    click: {
      type: Function,
      required: false,
      default: () => {},
    },
    icon: {
      type: String,
      required: true,
    },
    current: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped></style>
