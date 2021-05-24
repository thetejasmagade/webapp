<template>
  <Modal
    ref="proModal"
  >
    <div>
      <h1 class="text-2xl text-gold-600 mb-4">
        You've discovered a Pro feature!
      </h1>
      <p class="text-gray-600 mb-4">
        Upgrade to a Pro plan to be able to check your answers,
        earn certifications, unlock achievements and support the project.
      </p>
      <BlockButton
        :click="() => {btnClick()}"
        color="purple"
      >
        View Plans
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import BlockButton from '@/components/BlockButton.vue';

import { gtmEventOpenProModal } from '@/lib/gtm';

export default {
  components:{
    Modal,
    BlockButton
  },
  methods:{
    show(){
      gtmEventOpenProModal();
      this.$refs.proModal.show();
    },
    hide(){
      this.$refs.proModal.hide();
    },
    btnClick(){
      this.$router.push({name: 'Pricing'});
      this.hide();
    }
  }
};
</script>

<style scoped>

</style>
