<template>
  <Modal ref="sandboxModeModal">
    <div>
      <SandboxModeModalInfo :on-done="() => {}" />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modals/Modal.vue";
import SandboxModeModalInfo from "@/components/SandboxModeModalInfo.vue";

import {
  seenSandboxModalLoginKey,
  seenSandboxModalPatronKey,
  hasSeen,
} from "@/lib/localStorageLib";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    Modal,
    SandboxModeModalInfo,
  },
  setup() {
    const sandboxModeModal = ref(null);
    const store = useStore();

    const show = () => {
      sandboxModeModal.value?.show();
    };

    const showWithCache = () => {
      if (store.getters.getIsLoggedIn && hasSeen(seenSandboxModalPatronKey)) {
        return;
      }
      if (!store.getters.getIsLoggedIn && hasSeen(seenSandboxModalLoginKey)) {
        return;
      }
      this.show();
    };

    const hide = () => {
      sandboxModeModal.value?.hide();
    };

    return {
      sandboxModeModal,
      show,
      showWithCache,
      hide,
    };
  },
};
</script>

<style scoped></style>
