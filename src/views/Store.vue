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
        subtitle="A Pro account will make learning faster and easier. Don't hold yourself back from a high-paying tech job"
      >
        <div
          v-for="(subscriptionPlan, i) of subscriptionPlans"
          :key="i"
          class="cards"
        >
          <ImageCard
            v-for="(price, j) of subscriptionPlan.Prices"
            :key="j"
            class="card"
            :img-src="price.ImageURL"
            :click="() => { checkout(price) }"
          >
            <div class="body">
              <div class="title">
                <span> {{ price.Title }}</span>
              </div>

              <div class="price">
                <span>${{ (price.UnitAmountPerMonth / 100) }} / month </span>
              </div>

              <ul>
                <li
                  v-for="(feature, k) of subscriptionPlan.Features"
                  :key="k"
                >
                  {{ feature }}
                </li>
              </ul>

              <div
                v-if="price.MostPopular"
                class="pill"
              >
                <span class="gold">
                  Most Popular
                </span>
              </div>
            </div>
          </ImageCard>
          <ImageCard
            class="card"
            img-src="https://qvault.io/wp-content/uploads/2021/03/Basic-Plan-1.jpg"
          >
            <div class="body">
              <div class="title">
                <span> Basic Plan </span>
              </div>

              <div class="price">
                <span> Free </span>
              </div>

              <ul>
                <li>
                  Access to read all course material
                </li>
                <li>
                  Limited code sandbox for exercises
                </li>
                <li>
                  Save assignment progress
                </li>
              </ul>
            </div>
          </ImageCard>
        </div>
        <ul>
          <li>
            <a @click="$router.push({name: 'ReferralProgram'})">
              Invite friends, get 150 gems
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://qvault.io/affiliates/"
            >
              Share Qvault, earn cash
            </a>
          </li>
        </ul>
      </Section>
    </div>
  </div>
</template>

<script>
import Section from '@/components/Section';
import LoadingOverlay from '@/components/LoadingOverlay';
import ImageCard from '@/components/ImageCard';
import { 
  checkout
} from '@/lib/stripewrap.js';
import { loadUser } from '@/lib/cloudStore.js';
import { 
  gtmEventFinishCheckout
} from '@/lib/gtm.js';

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
    subscriptionPlans(){
      return this.$store.getters.getSubscriptionPlans;
    }
  },
  async mounted(){
    loadUser(this);
    if (this.$route.query.checkout === 'success'){
      this.$notify({
        type: 'success',
        text: 'Welcome to Qvault Pro!'
      });
      gtmEventFinishCheckout(null, null, 'Qvault Pro');
    }
  },
  methods: {
    async checkout(price){
      this.isLoading = true;
      try {
        await checkout(price);
      } catch (err){
        this.$notify({
          type: 'error',
          text: err
        });
      }
      this.isLoading = false;
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
  padding: 1em;

  .card{
    flex: 1;
    margin: .5em;
    max-width: 300px;
    min-width: 200px;

    .body {
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 1em;

      ul{
        text-align: left;

        li {
          margin-top: 5px;
        }
      }
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
    }
  }
}

</style>
