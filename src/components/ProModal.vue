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
      >
        View Plans
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import BlockButton from '@/components/BlockButton.vue';

import { eventOpenProModal } from '@/lib/analytics.js';

export default {
  components:{
    Modal,
    BlockButton
  },
  methods:{
    show(){
      eventOpenProModal();
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
