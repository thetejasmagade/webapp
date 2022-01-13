<template>
  <Modal
    ref="pricingModal"
  >
    <div>
      <h1 class="text-2xl text-gold-600 mb-4">
        Become a patron to continue enjoying premium features
      </h1>
      <p class="text-gray-600 mb-4">
        If you want to continue to verify your answers and get credit for
        assignments,
        <b>you'll need to become a patron</b>
      </p>
      <p class="text-gray-600 mb-4">
        That said, you can continue the course in
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
