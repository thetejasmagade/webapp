<template>
  <div>
    <div class="flex flex-col justify-evenly w-full items-center">
      <form
        class="flex flex-col justify-evenly w-full items-center"
        @submit.prevent="submitLogin"
      >
        <TextInput
          v-model="email"
          placeholder="email"
          type="email"
          required
          name="email"
          class="mb-4 w-full"
        />
        <TextInput
          v-model="password"
          placeholder="password"
          type="password"
          required
          class="mb-4 w-full"
        />
        <BlockButton class="mb-4 md:w-1/2 w-full">
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

<style scoped>
</style>
