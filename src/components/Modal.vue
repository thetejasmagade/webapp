<template>
  <div>
    <transition v-if="showModal" name="modal">
      <div
        class="bg-opacity fixed z-40 inset-0 w-full h-full flex flex-col justify-center transition-opacity duration-300"
        @click.stop="hide"
      >
        <div class="flex justify-center">
          <div
            class="flex-1 max-w-xl p-6 bg-gray-700 text-gray-200 rounded"
            @click.stop=""
          >
            <div class="flex flex-col">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    onClose: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
      this.onClose();
    },
  },
};
</script>

<style scoped>
.bg-opacity {
  background-color: rgba(0, 0, 0, 0.75);
}

.modal-default-button {
  float: right;
}
</style>
