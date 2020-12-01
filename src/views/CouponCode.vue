<template>
  <div class="subcontainer">
    <Section
      title="Coupon Code"
      class="section"
    >
      <div class="body">
        <form
          class="active-form"
          @submit.prevent="submit"
        >
          <TextInput
            v-model="couponCode"
            placeholder="Enter Your Code Here"
            type="text"
            class="item"
          />
          <BlockButton class="btn item">
            Claim
          </BlockButton>
        </form>
      </div>
    </Section>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton';
import TextInput from '@/components/TextInput';
import Section from '@/components/Section';
import {
  useCouponCode
} from '@/lib/cloudClient.js';

import { 
  loadBalance
} from '@/lib/cloudStore.js';


export default {
  components: {
    BlockButton,
    TextInput,
    Section
  },
  data() {
    return {
      couponCode: null
    };
  },
  methods: {
    async submit(){
      try{
        this.isLoading = true;
        const credit = await useCouponCode(this.couponCode);
        this.$notify({
          type: 'success',
          text: `${credit.Message} 💎x${credit.GemCredit}`
        });
        loadBalance(this);
      } catch (err){
        this.$notify({
          type: 'error',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.subcontainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  .section {
    max-width: 800px;

    .body {
      text-align: center;
    }
  }
}

.active-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 4em;

  .item {
    margin-bottom: 2em;
    width: 100%;
    color: $gray-lightest;
  }

  .btn {
    margin-bottom: 2em;
    width: 50%;
    min-width: 250px;
  }
}

</style>
