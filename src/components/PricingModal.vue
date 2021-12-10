<template>
  <Modal
    ref="pricingModal"
  >
    <div>
      <h1 class="text-2xl text-gold-600 mb-4">
        Upgrade for continued pro access
      </h1>
      <p class="text-gray-600 mb-4">
        If you want to continue to verify your answers and get credit for
        assignments,
        <b>you'll need to upgrade to a pro account.</b>
      </p>
      <p class="text-gray-600 mb-4">
        That said, click outside this pop-up to continue the course in
        read-only mode, its free to audit!
      </p>
      <BlockButton
        class="btn"
        :click="
          () => {modalButtonClick()}
        "
      >
        View Plans
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import BlockButton from '@/components/BlockButton.vue';

import { eventOpenPricingModal } from '@/lib/analytics.js';

export default {
  components:{
    Modal,
    BlockButton
  },
  data() {
    return {
      commentText: null,
      rating: null,
      stars: 3
    };
  },
  methods:{
    modalButtonClick() {
      this.$router.push({ name: 'Pricing' });
      this.$refs.pricingModal.hide();
    },
    show(){
      eventOpenPricingModal();
      this.$refs.pricingModal.show();
    },
    hide(){
      this.$refs.pricingModal.hide();
    }
  }
};
</script>

<style scoped>

</style>
