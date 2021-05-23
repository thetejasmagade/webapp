<template>
  <Modal
    ref="proModal"
  >
    <div class="pro-modal">
      <h1> You've discovered a Pro feature! </h1>
      <p>
        Upgrade to a Pro plan to be able to check your answers,
        earn certifications, unlock achievements and support the project.
      </p>
      <BlockButton
        class="btn"
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

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.pro-modal {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .btn {
    max-width: 200px;
  }
}
</style>
