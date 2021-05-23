<template>
  <div>
    <div class="active-form">
      <form
        class="active-form"
        @submit.prevent="submitLogin"
      >
        <TextInput
          v-model="email"
          placeholder="email"
          type="email"
          required
          name="email"
          class="item"
        />
        <TextInput
          v-model="password"
          placeholder="password"
          type="password"
          required
          class="item"
        />
        <BlockButton class="btn item">
          Login
        </BlockButton>
      </form>
    </div>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue';
import TextInput from '@/components/TextInput.vue';

import {
  loginManual
} from '@/lib/cloudClient.js';

import {
  loadLoggedIn
} from '@/lib/cloudStore.js';
import { notify } from '@/lib/notification.js';

export default {
  components: {
    BlockButton,
    TextInput
  },
  data(){
    return {
      email: null,
      password: null
    };
  },
  methods: {
    async submitLogin(){
      try {
        await loginManual(this.email, this.password);
        loadLoggedIn(this);
        this.$router.push({name: 'Courses', query: { redirect: this.$route.query.redirect}});
      } catch (err){
        notify({
          type: 'danger',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.active-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;

  .item {
    margin-bottom: 2em;
    width: 100%;
  }

  .btn {
    margin-bottom: 2em;
    width: 50%;
    min-width: 250px;
  }
}
</style>
