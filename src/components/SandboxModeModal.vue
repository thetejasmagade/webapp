<template>
  <Modal
    ref="sandboxModeModal"
  >
    <div>
      <h1 class="text-2xl text-gold-600 mb-4">
        {{ headingText }}
      </h1>
      <p class="text-gray-600 mb-4">
        You're in sandbox mode! You can read instructions and run code,
        but to complete assignments,
        unlock gems, and take quizzes you'll need to become a patron.
      </p>
      <BlockButton
        :click="btnClick"
      >
        Become a patron
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import BlockButton from '@/components/BlockButton.vue';

import { eventOpenSandboxModeModal } from '@/lib/analytics.js';

export default {
  components:{
    Modal,
    BlockButton
  },
  computed: {
    headingText(){
      if (this.$store.getters.getIsLoggedIn){
        return 'Become a patron for full access';
      }
      return 'Login for full access';
    },
    buttonText(){
      if (this.$store.getters.getIsLoggedIn){
        return 'Become a patron';
      }
      return 'Login';
    }
  },
  methods:{
    show(){
      eventOpenSandboxModeModal();
      this.$refs.sandboxModeModal.show();
    },
    hide(){
      this.$refs.sandboxModeModal.hide();
    },
    btnClick(){
      if (this.$store.getters.getIsLoggedIn){
        this.$router.push({name: 'Pricing'});
        this.hide();
        return;
      }
      this.$router.push({name: 'Login'});
      this.hide();
      return;
    }
  }
};
</script>

<style scoped>
</style>
