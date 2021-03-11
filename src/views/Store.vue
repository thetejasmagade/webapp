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
            :click="() => { checkout(subscriptionPlan, price) }"
          >
            <div class="body">
              <div
                v-if="price.MostPopular"
                class="pill"
              >
                <span class="gold">
                  Most Popular
                </span>
              </div>
              <div class="title">
                <span> {{ price.Title }}</span>
              </div>
              <div class="price">
                <span>${{ (price.UnitAmountPerMonth / 100) }} / month </span>
              </div>
            </div>
          </ImageCard>
        </div>
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
  },
  methods: {
    async checkout(subscriptionPlan, price){
      this.isLoading = true;
      try {
        await checkout(subscriptionPlan, price);
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
