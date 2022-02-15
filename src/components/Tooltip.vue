<template>
  <div class="tooltip-box relative xs:hidden sm:block">
    <div>
      <slot />
    </div>
    <div
      class="tooltip text-white text-center p-2 rounded w-32 opacity-0 absolute invisible z-50 transition-opacity duration-500"
      :class="{
        'bg-gray-500': color === 'gray',
        'bg-red-500': color === 'red',
        'bg-gold-600': color === 'gold',
        'bg-blue-500': color === 'blue',
        'bg-green-500': color === 'green',
        top: position === 'top',
        right: position === 'right',
        bottom: position === 'bottom',
        left: position === 'left',
      }"
    >
      <div v-for="(line, i) of lines" :key="i">
        <span class="text">
          {{ line }}
        </span>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "gray",
    },
    position: {
      type: String,
      required: false,
      default: "top",
    },
    itemMargin: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    lines() {
      return this.text.split("\n");
    },
  },
};
</script>

<style scoped>
.tooltip-box:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.top {
  bottom: calc(100% + 5px);
  left: 50%;
  margin-left: -60px;
}

.bottom {
  top: calc(100% + 5px);
  left: 50%;
  margin-left: -60px;
}

.right {
  top: 50%;
  left: calc(100% + 10px);
  transform: translate(0, -50%);
}

.left {
  top: 50%;
  right: calc(100% + 10px);
  transform: translate(0, -50%);
}
</style>
