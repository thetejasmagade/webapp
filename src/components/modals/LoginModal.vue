<template>
  <Modal ref="loginModal">
    <div class="p-4 flex flex-col items-center">
      <h2 class="text-4xl text-blue-400 mb-4 font-bold">Sign in to Boot.dev</h2>

      <div v-if="state === 'integration'">
        <IntegrationLoginForm />
        <div class="text-center">
          <p>
            Don't like integrations?
            <a
              class="underline cursor-pointer text-blue-400 hover:text-blue-300"
              @click="state = 'register'"
            >
              Use a magic link
            </a>
          </p>
        </div>
      </div>

      <div v-if="state === 'register'">
        <MagicLinkRegister />
        <div class="text-center">
          <p>
            Have an integration?
            <a
              class="underline cursor-pointer text-blue-400 hover:text-blue-300"
              @click="state = 'integration'"
            >
              Sign in with a third party
            </a>
          </p>
          <p>
            Have an account?
            <a
              class="underline cursor-pointer text-blue-400 hover:text-blue-300"
              @click="state = 'login'"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      <div v-if="state === 'login'">
        <MagicLinkLogin />
        <div class="text-center">
          <p>
            Need an account?
            <a
              class="underline cursor-pointer text-blue-400 hover:text-blue-300"
              @click="state = 'register'"
            >
              Sign up free
            </a>
          </p>
          <p>
            Have an integrated account?
            <a
              class="underline cursor-pointer text-blue-400 hover:text-blue-300"
              @click="state = 'integration'"
            >
              Sign in with a third party
            </a>
          </p>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modals/Modal.vue";
import IntegrationLoginForm from "@/components/IntegrationLoginForm.vue";
import MagicLinkRegister from "@/components/MagicLinkRegister.vue";
import MagicLinkLogin from "@/components/MagicLinkLogin.vue";

import { reactive, ref, toRefs } from "vue";

export default {
  components: {
    Modal,
    IntegrationLoginForm,
    MagicLinkRegister,
    MagicLinkLogin,
  },
  props: {},
  setup() {
    const loginModal = ref(null);

    const state = reactive({
      state: "integration",
    });

    const show = () => {
      loginModal.value?.show();
    };
    const hide = () => {
      loginModal.value?.hide();
    };

    return {
      ...toRefs(state),
      show,
      hide,
      loginModal,
    };
  },
};
</script>

<style scoped></style>
