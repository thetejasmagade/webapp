<template>
  <Modal ref="confirmModal">
    <div>
      <h1 class="text-2xl text-blue-400 mb-4">
        {{ heading }}
      </h1>
      <p class="mb-4">
        {{ text }}
      </p>
      <BlockButton
        :click="
          () => {
            onConfirm();
            hide();
          }
        "
        color="blue"
        class="mr-4"
      >
        Confirm
      </BlockButton>
      <BlockButton
        :click="
          () => {
            hide();
          }
        "
        color="gray"
      >
        Cancel
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import BlockButton from "@/components/BlockButton.vue";

export default {
  components: {
    Modal,
    BlockButton,
  },
  props: {
    heading: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
      default: null,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
  },
  methods: {
    show() {
      this.$refs.confirmModal.show();
    },
    hide() {
      this.$refs.confirmModal.hide();
    },
  },
};
</script>

<style scoped></style>
