<template>
  <div
    class="root"
  >
    <LoadingOverlay
      :is-loading="isLoading" 
    />

    <div class="subcontainer">
      <Section
        title="Store"
        subtitle="Gems are the currency of Qvault. Buy some gems to unlock full courses"
      >
        <ul>
          <li>
            <a @click="$router.push({name: 'CouponCode'})">
              Got a coupon code?
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://forms.gle/j2g5edjuPUFDW3tJ9"
            >
              Take a survey to get 100 free gems
            </a>
          </li>
          <li>
            <a @click="$router.push({name: 'ReferralProgram'})">
              Invite friends, get 150 free gems
            </a>
          </li>
        </ul>
        <div class="cards">
          <ImageCard
            v-for="(product, i) of products"
            :key="i"
            class="card"
            :img-src="localImageIfExists(product.ImageURL)"
            :click="() => { checkout(product) }"
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
      </Section>
    </div>
  </div>
</template>

<script>
import { 
  gtmEventFinishCheckout
} from '@/lib/gtm.js';

import Section from '@/components/Section';
import LoadingOverlay from '@/components/LoadingOverlay';
import ImageCard from '@/components/ImageCard';
import imgGem1 from '@/img/gem-1.png';
import imgGem2 from '@/img/gem-2.png';
import imgGem3 from '@/img/gem-3.png';
import imgGem4 from '@/img/gem-4.png';
import imgGem5 from '@/img/gem-5.png';
import {
  completePayments
} from '@/lib/cloudClient.js';
import { 
  loadBalance
} from '@/lib/cloudStore.js';
import { 
  checkout
} from '@/lib/stripewrap.js';
import { loadUser } from '@/lib/cloudStore.js';

export default {
  metaInfo() {
    const title = 'Qvault - Store';
    return {
      title: title,
      meta: [
        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
  components: {
    ImageCard,
    LoadingOverlay,
    Section
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
        const completedPayments = await completePayments();
        for (const completedPayment of completedPayments){
          await loadUser(this);
          window.rewardful('convert', { email: this.$store.getters.getUser.Email });
          gtmEventFinishCheckout(
            completedPayment.UnitAmount / 100.0,
            completedPayment.ProductID,
            completedPayment.ProductName
          );
        }
        if (completedPayments.length > 0){
          loadBalance(this);
        }
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      } 
    })();
  },
  methods: {
    async checkout(product){
      this.isLoading = true;
      await checkout(product);
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
@import '@/styles/consts.scss';

.root {
  display: block;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  overflow: auto;
  min-height: calc(100vh - #{$bar-height});

  a {
    text-decoration: none;
  }
}

.cards {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;

  .card{
    flex: 1 1 calc(22% - 1em);
    margin: .5em;
    max-width: 225px;
    min-width: 200px;

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
