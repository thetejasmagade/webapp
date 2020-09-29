<template>
  <div
    id="container"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />

    <div id="title">
      <span>
        Store
      </span>
    </div>

    <div id="sub-title">
      <span>
        Jumpstart your coding career. Grab some gems to unlock courses
      </span>
    </div>

    <div id="coupon-code">
      <span @click="$router.push({name: 'CouponCode'})">
        Coupon Code?
      </span>
    </div>

    <div id="cards">
      <ImageCard
        v-for="(product, i) of products"
        :key="i"
        class="card"
        :img-src="localImageIfExists(product.ImageURL)"
        :click="() => { checkout(product.ID) }"
      >
        <div class="body">
          <div
            v-if="product.MostPopular"
            class="pill"
          >
            <span class="gold">
              Most Popular
            </span>
          </div>
          <div
            v-if="product.BestDeal"
            class="pill"
          >
            <span class="green">
              Best Deal
            </span>
          </div>
          <div class="title">
            <span> Get {{ product.GemAmount }} Gems</span>
          </div>
          <div class="price">
            <span
              v-if="product.DiscountDollars !== 0"
              class="original"
            >${{ (product.Price.UnitAmount / 100) + product.DiscountDollars }}</span>
            <span>${{ (product.Price.UnitAmount / 100) }}</span>
          </div>
        </div>
      </ImageCard>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import 'vue-loading-overlay/dist/vue-loading.css';

import { publicKey } from '@/lib/stripeConsts';
import LoadingOverlay from '@/components/LoadingOverlay';
import ImageCard from '@/components/ImageCard';
import imgGem1 from '@/img/gem-1.png';
import imgGem2 from '@/img/gem-2.png';
import imgGem3 from '@/img/gem-3.png';
import imgGem4 from '@/img/gem-4.png';
import imgGem5 from '@/img/gem-5.png';
import {
  startProductCheckout,
  completePayments,
  getLastGemTransaction
} from '@/lib/cloudClient.js';

export default {
  components: {
    ImageCard,
    LoadingOverlay
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    products(){
      let products = this.$store.getters.getProducts;
      return products;
    }
  },
  async mounted(){
    (async () => {
      try {
        await completePayments();
        const lastGemTransaction = await getLastGemTransaction();
        this.$store.commit('setBalance', lastGemTransaction.Balance);
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      } 
    })();
  },
  methods: {
    async checkout(productID){
      this.isLoading = true;
      const checkoutSession = await startProductCheckout(productID);
      const stripe = await loadStripe(publicKey);
      await stripe.redirectToCheckout({
        sessionId: checkoutSession.id
      });
      this.isLoading = false;
    },
    localImageIfExists(url){
      const imageMap = {
        'https://files.stripe.com/links/fl_live_6ssyPWe0N1x2tnPpkqueyvix': imgGem1,
        'https://files.stripe.com/links/fl_live_4LuaQKie1yZvkPBVh4Otq23s': imgGem2,
        'https://files.stripe.com/links/fl_live_vHKJH47wkrSPyE3OjM3wj8dZ': imgGem3,
        'https://files.stripe.com/links/fl_live_i04SKUo4zTtxi5Cw9x8SGYS7': imgGem4,
        'https://files.stripe.com/links/fl_live_62wRlMFYz1iocbKsEZ3QLnrT': imgGem5
      };
      return imageMap[url] ? imageMap[url] : url;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#container {
  display: block;
  flex-direction: column;
  text-align: center;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  background-image: radial-gradient(circle at 92% 0%, hsla(281,0%,88%,0.07) 0%, hsla(281,0%,88%,0.07) 63%,transparent 63%, transparent 79%,transparent 79%, transparent 100%),radial-gradient(circle at 41% 56%, hsla(281,0%,88%,0.07) 0%, hsla(281,0%,88%,0.07) 77%,transparent 77%, transparent 80%,transparent 80%, transparent 100%),radial-gradient(circle at 51% 47%, hsla(281,0%,88%,0.07) 0%, hsla(281,0%,88%,0.07) 69%,transparent 69%, transparent 93%,transparent 93%, transparent 100%),radial-gradient(circle at 74% 84%, hsla(281,0%,88%,0.07) 0%, hsla(281,0%,88%,0.07) 49%,transparent 49%, transparent 66%,transparent 66%, transparent 100%),radial-gradient(circle at 37% 72%, hsla(281,0%,88%,0.07) 0%, hsla(281,0%,88%,0.07) 56%,transparent 56%, transparent 74%,transparent 74%, transparent 100%),linear-gradient(45deg, rgb(118, 32, 183),rgb(112, 83, 142));
}

#title{
  padding: 10px;
  position: relative;
  color: $white;
  font-size: 3em;
}

#sub-title {
  text-align: center;
  color: $gray-lightest;
  font-size: 1.5em;
  margin-bottom: 20px;
}

#coupon-code {
  color: $gold-lighter;
  cursor: pointer;

  &:hover{
    color: $gold-mid;
    text-decoration: underline;
  }
}

#cards {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;

  .card{
    flex: 1 1 calc(22% - 1em);
    margin: .5em;
    max-width: 250px;
    min-width: 150px;

    .body {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .pill{
      span {
        padding: 5px 20px 5px 20px;
        color: $white;
        font-size: 1em;
        border-radius: 16px;

        &.gold {
          background-color: $gold-dark;
        }

        &.green {
          background-color: $green-dark;
        }
      }
      margin-bottom: 1em;
    }

    .title {
      color: $purple-lightest;
      font-size: 1.5em;
      margin-bottom: .5em;

      span {
        margin-left: 10px;
      }
    }

    .price {
      font-size: 1.25em;
      color: $green-mid;
      margin-bottom: .5em;

      .original {
        color: $gray-mid;
        margin-right: 1em;
        background: linear-gradient(to left bottom, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%);
      }
    }
  }
}

</style>
