<template>
  <div class="root">
    <LoadingOverlay :is-loading="isLoading" />

    <div class="subcontainer">
      <Section
        class="section"
        title="Pro Pricing"
        subtitle="Upgrading to pro makes learning faster and easier, and unlocks certificates to show off to employers"
      >
        <div class="section-body">
          <h2 v-if="$store.getters.getUserIsSubscribed">
            You're already subscribed. Go take some courses!
          </h2>
          <h2 v-else>
            Thanks for supporting the project! All purchases have a 7-day free trial and a 30-day money-back guarantee
          </h2>
          <div
            v-for="(subscriptionPlan, i) of subscriptionPlans"
            :key="i"
            class="cards"
          >
            <ImageCard
              v-for="(price, j) of subscriptionPlan.Prices"
              :key="j"
              class="card"
              :class="{'popular': price.MostPopular}"
              theme="light"
              :img-src="price.ImageURL"
              :click=" $store.getters.getUserIsSubscribed ? null :
                () => {
                  checkout(price);
                }
              "
            >
              <div class="body">
                <div class="title">
                  <span> {{ price.Title }}</span>
                </div>

                <div class="price">
                  <span>${{ price.UnitAmountPerMonth / 100 }} / month </span>
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
                  <span class="gold"> Most Popular </span>
                </div>
              </div>
            </ImageCard>
            <ImageCard
              class="card"
              theme="light"
              img-src="https://qvault.io/wp-content/uploads/2021/03/promonthly-300x169.jpg"
            >
              <div class="body">
                <div class="title">
                  <span> Basic Plan </span>
                </div>

                <div class="price gray">
                  <span> Free </span>
                </div>

                <ul>
                  <li>Access to read all course material</li>
                  <li>Limited code sandbox for exercises</li>
                </ul>
              </div>
            </ImageCard>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import Section from '@/components/Section.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import ImageCard from '@/components/ImageCard.vue';
import { checkout } from '@/lib/stripewrap.js';
import { loadUser } from '@/lib/cloudStore.js';

export default {
  metaInfo() {
    const title = 'Qvault - Pro Pricing';
    return {
      title: title,
      meta: [
        { vmid: 'og:title', property: 'og:title', content: title },
        { vmid: 'twitter:title', name: 'twitter:title', content: title }
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
    subscriptionPlans() {
      return this.$store.getters.getSubscriptionPlans;
    }
  },
  async mounted() {
    loadUser(this);
  },
  methods: {
    async checkout(price) {
      this.isLoading = true;
      try {
        await checkout(price);
      } catch (err) {
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
@import "@/styles/colors.scss";
@import "@/styles/consts.scss";

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

  .card {
    flex: 1;
    margin: 0.5em;
    max-width: 300px;
    min-width: 200px;
    
    &.popular{
      box-shadow: 0 10px 20px 0 $purple-darker;
      border: none;
    }

    .body {
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 1em;

      ul {
        text-align: left;

        li {
          margin-top: 5px;
        }
      }
    }

    .pill {
      span {
        padding: 5px 20px 5px 20px;
        color: $white;
        font-size: 1em;
        border-radius: 16px;

        &.gold {
          background-color: $purple-mid;
        }
      }
      margin-bottom: 1em;
    }

    .title {
      color: $purple-mid;
      font-size: 1.5em;
      margin-bottom: 0.5em;

      span {
        margin-left: 10px;
      }
    }

    .price {
      font-size: 1.25em;
      color: $green-mid;
      margin-bottom: 0.5em;

      &.gray {
        color: $gray-mid;
      }
    }
  }
}

.section-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: $gold-dark;
  }
}

.speech-bubble {
  border: 1px solid $gray-light;
  border-radius: 5px;
  max-width: 700px;
  background-color: $white;
  margin: 1em 0 0 0;
}
</style>
