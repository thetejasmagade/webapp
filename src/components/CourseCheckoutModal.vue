<template>
  <div>
    <Modal
      ref="modal"
      :on-close="onClose"
    >
      <div class="body">
        <h2> Unlock {{ course.Title }} </h2>
        <GemDisplay
          :size="1"
          class="item"
          :text="`${$store.getters.getBalance} / ${course.GemCost}`"
        />
        <p>
          <span class="emphasis">You need {{ course.GemCost - $store.getters.getBalance }} more gems</span>
          to unlock {{ course.Title }}. Don't worry, you can buy some right now, and they never expire!
          Get them in bulk to save on multiple courses.
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
              :click="() => {checkout(product)}"
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
    <Modal
      ref="surveyModal"
    >
      <div class="body">
        <p />
        <h2>Sorry you're not interested!</h2>
        <p>
          As a first time student, we want to provide
          the courses you need to achieve your goals!
          <a
            target="_blank"
            href="https://forms.gle/j2g5edjuPUFDW3tJ9"
          >Please take this survey to earn some free Gems
          </a>
          and let us know how we can improve the platform for you.
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import BlockButton from '@/components/BlockButton';
import GemDisplay from '@/components/GemDisplay';

import { 
  startProductCheckout
} from '@/lib/cloudClient.js';

import { 
  gtmEventBeginCheckout
} from '@/lib/gtm.js';
import { 
  sleep
} from '@/lib/sleep.js';

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
    },
    userHasAlreadyBoughtCourses: {
      type: Boolean,
      required: true
    }
  },
  methods:{
    onClose(){
      if (this.userHasAlreadyBoughtCourses){
        return;
      }
      this.$refs.surveyModal.show();
    },
    show(){
      this.$refs.modal.show();
    },
    async checkout(product){
      this.isLoading = true;
      gtmEventBeginCheckout(product.Price.UnitAmount / 100, product.ID, product.Name);
      await sleep(250);
      const checkoutSession = await startProductCheckout(product.ID);
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

.emphasis {
  color: $purple-lighter;
}

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

  .item {
    margin: 0em 1em 1em 1em;
  }

  .btn {
    min-width: 90%;
    font-size: 1em;
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
