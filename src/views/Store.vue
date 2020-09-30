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
background-image: linear-gradient(55deg, rgba(208, 208, 208, 0.03) 0%, rgba(208, 208, 208, 0.03) 20%,rgba(55, 55, 55, 0.03) 20%, rgba(55, 55, 55, 0.03) 40%,rgba(81, 81, 81, 0.03) 40%, rgba(81, 81, 81, 0.03) 60%,rgba(208, 208, 208, 0.03) 60%, rgba(208, 208, 208, 0.03) 80%,rgba(191, 191, 191, 0.03) 80%, rgba(191, 191, 191, 0.03) 100%),linear-gradient(291deg, rgba(190, 190, 190, 0.02) 0%, rgba(190, 190, 190, 0.02) 14.286%,rgba(105, 105, 105, 0.02) 14.286%, rgba(105, 105, 105, 0.02) 28.572%,rgba(230, 230, 230, 0.02) 28.572%, rgba(230, 230, 230, 0.02) 42.858%,rgba(216, 216, 216, 0.02) 42.858%, rgba(216, 216, 216, 0.02) 57.144%,rgba(181, 181, 181, 0.02) 57.144%, rgba(181, 181, 181, 0.02) 71.42999999999999%,rgba(129, 129, 129, 0.02) 71.43%, rgba(129, 129, 129, 0.02) 85.71600000000001%,rgba(75, 75, 75, 0.02) 85.716%, rgba(75, 75, 75, 0.02) 100.002%),linear-gradient(32deg, rgba(212, 212, 212, 0.03) 0%, rgba(212, 212, 212, 0.03) 12.5%,rgba(223, 223, 223, 0.03) 12.5%, rgba(223, 223, 223, 0.03) 25%,rgba(11, 11, 11, 0.03) 25%, rgba(11, 11, 11, 0.03) 37.5%,rgba(86, 86, 86, 0.03) 37.5%, rgba(86, 86, 86, 0.03) 50%,rgba(106, 106, 106, 0.03) 50%, rgba(106, 106, 106, 0.03) 62.5%,rgba(220, 220, 220, 0.03) 62.5%, rgba(220, 220, 220, 0.03) 75%,rgba(91, 91, 91, 0.03) 75%, rgba(91, 91, 91, 0.03) 87.5%,rgba(216, 216, 216, 0.03) 87.5%, rgba(216, 216, 216, 0.03) 100%),linear-gradient(312deg, rgba(113, 113, 113, 0.01) 0%, rgba(113, 113, 113, 0.01) 14.286%,rgba(54, 54, 54, 0.01) 14.286%, rgba(54, 54, 54, 0.01) 28.572%,rgba(166, 166, 166, 0.01) 28.572%, rgba(166, 166, 166, 0.01) 42.858%,rgba(226, 226, 226, 0.01) 42.858%, rgba(226, 226, 226, 0.01) 57.144%,rgba(109, 109, 109, 0.01) 57.144%, rgba(109, 109, 109, 0.01) 71.42999999999999%,rgba(239, 239, 239, 0.01) 71.43%, rgba(239, 239, 239, 0.01) 85.71600000000001%,rgba(54, 54, 54, 0.01) 85.716%, rgba(54, 54, 54, 0.01) 100.002%),linear-gradient(22deg, rgba(77, 77, 77, 0.03) 0%, rgba(77, 77, 77, 0.03) 20%,rgba(235, 235, 235, 0.03) 20%, rgba(235, 235, 235, 0.03) 40%,rgba(215, 215, 215, 0.03) 40%, rgba(215, 215, 215, 0.03) 60%,rgba(181, 181, 181, 0.03) 60%, rgba(181, 181, 181, 0.03) 80%,rgba(193, 193, 193, 0.03) 80%, rgba(193, 193, 193, 0.03) 100%),linear-gradient(80deg, rgba(139, 139, 139, 0.02) 0%, rgba(139, 139, 139, 0.02) 14.286%,rgba(114, 114, 114, 0.02) 14.286%, rgba(114, 114, 114, 0.02) 28.572%,rgba(240, 240, 240, 0.02) 28.572%, rgba(240, 240, 240, 0.02) 42.858%,rgba(221, 221, 221, 0.02) 42.858%, rgba(221, 221, 221, 0.02) 57.144%,rgba(74, 74, 74, 0.02) 57.144%, rgba(74, 74, 74, 0.02) 71.42999999999999%,rgba(201, 201, 201, 0.02) 71.43%, rgba(201, 201, 201, 0.02) 85.71600000000001%,rgba(187, 187, 187, 0.02) 85.716%, rgba(187, 187, 187, 0.02) 100.002%),linear-gradient(257deg, rgba(72, 72, 72, 0.03) 0%, rgba(72, 72, 72, 0.03) 16.667%,rgba(138, 138, 138, 0.03) 16.667%, rgba(138, 138, 138, 0.03) 33.334%,rgba(54, 54, 54, 0.03) 33.334%, rgba(54, 54, 54, 0.03) 50.001000000000005%,rgba(161, 161, 161, 0.03) 50.001%, rgba(161, 161, 161, 0.03) 66.668%,rgba(17, 17, 17, 0.03) 66.668%, rgba(17, 17, 17, 0.03) 83.33500000000001%,rgba(230, 230, 230, 0.03) 83.335%, rgba(230, 230, 230, 0.03) 100.002%),linear-gradient(47deg, rgba(191, 191, 191, 0.01) 0%, rgba(191, 191, 191, 0.01) 16.667%,rgba(27, 27, 27, 0.01) 16.667%, rgba(27, 27, 27, 0.01) 33.334%,rgba(66, 66, 66, 0.01) 33.334%, rgba(66, 66, 66, 0.01) 50.001000000000005%,rgba(36, 36, 36, 0.01) 50.001%, rgba(36, 36, 36, 0.01) 66.668%,rgba(230, 230, 230, 0.01) 66.668%, rgba(230, 230, 230, 0.01) 83.33500000000001%,rgba(93, 93, 93, 0.01) 83.335%, rgba(93, 93, 93, 0.01) 100.002%),linear-gradient(90deg, #ffffff,#ffffff);
}

#title{
  padding: 20px;
  position: relative;
  color: $gray-dark;
  font-size: 3em;
}

#sub-title {
  text-align: center;
  color: $gray-mid;
  font-size: 1.5em;
  margin-bottom: 20px;
}

#coupon-code {
  color: $gold-mid;
  cursor: pointer;

  &:hover{
    color: $gold-darker;
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
