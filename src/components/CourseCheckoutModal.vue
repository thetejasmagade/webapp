<template>
  <Modal
    ref="modal"
  >
    <div class="body">
      <h2> Unlock {{ course.Title }} </h2>
      <GemDisplay
        :size="1"
        class="item"
        :text="`${$store.getters.getBalance} / ${course.GemCost}`"
      />
      <p>
        You need {{ course.GemCost }} gems
        to unlock {{ course.Title }}.
        Don't worry, you can buy some right now, and they never expire!
        Get them in bulk if you'll be taking multiple courses.
      </p>
      <div class="row">
        <div class="col">
          <img
            :src="course.ImageURL"
            class="item img"
          >
        </div>
        <div class="col">
          <BlockButton
            v-for="(product, i) of course.products"
            :key="i"
            class="item btn"
            :click="() => {checkout(product.ID)}"
            :color=" i === 0 ? 'gold' : 'gray'"
          >
            Get {{ product.GemAmount }}
            Gems -
            ${{ product.Price.UnitAmount / 100 }}
            <span
              v-if="product.DiscountDollars"
              class="strikethrough"
            >
              ${{ (product.Price.UnitAmount / 100) + product.DiscountDollars }}
            </span>
          </BlockButton>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal';
import BlockButton from '@/components/BlockButton';
import GemDisplay from '@/components/GemDisplay';

import { 
  startProductCheckout
} from '@/lib/cloudClient.js';

import { loadStripe } from '@stripe/stripe-js';
import { publicKey } from '@/lib/stripeConsts';

export default {
  components: {
    BlockButton,
    GemDisplay,
    Modal
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  methods:{
    show(){
      this.$refs.modal.show();
    },
    async checkout(productID){
      this.isLoading = true;
      const checkoutSession = await startProductCheckout(productID);
      const stripe = await loadStripe(publicKey);
      await stripe.redirectToCheckout({
        sessionId: checkoutSession.id
      });
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .item{
    margin: 0em 1em 1em 1em;
  }

  .btn {
    min-width: 90%;
  }

  .img {
    max-width: 200px;
    display: block;
    border-radius: 5px;
    border: solid 1px $gray-lighter;
  }

  .strikethrough {
    position: relative;
    &:before {
      position: absolute;
      content: "";
      left: 0;
      top: 50%;
      right: 0;
      border-top: 1px solid;
      border-color: inherit;

      -webkit-transform:rotate(-10deg);
      -moz-transform:rotate(-10deg);
      -ms-transform:rotate(-10deg);
      -o-transform:rotate(-10deg);
      transform:rotate(-10deg);
    }
  }
}
</style>
