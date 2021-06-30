<template>
  <div>
    <ProModal ref="proModal" />

    <div class="sidebar text-gray-200 bg-gray-800 h-full text-center">
      <div class="profile-box flex flex-col items-center">
        <ProfileImage
          class="profile-img my-4 w-3/5"
          :profile-image-u-r-l="$store.getters.getUser ? $store.getters.getUser.ProfileImageURL : null"
          editable
        />
      </div>

      <div class="flex justify-center mb-2">
        <div class="w-4/5 border-b-2 border-gray-500" />
      </div>

      <GemDisplay
        :size=".5"
        :text="`${$store.getters.getBalance}`"
        vertical
        class="mb-4"
      />

      <div class="flex justify-center mb-2">
        <div class="w-4/5 border-b-2 border-gray-500" />
      </div>

      <Tooltip
        v-if="$store.getters.getUser ? $store.getters.getUser.IsRecruiter : false"
        :text="`Recruiters`"
        position="right"
        class="mx-4"
        color="gold"
      >
        <MenuItemHorizontal
          icon="search"
          :click="() => {$router.push({name: 'Recruiters'}) }"
          :current="pathName === 'Recruiters'"
        />
      </Tooltip>

      <Tooltip
        :text="`Courses`"
        position="right"
        class="mx-4"
        color="gold"
      >
        <MenuItemHorizontal
          icon="scroll"
          :click="() => {$router.push({name: 'Courses'}) }"
          :current="pathName === 'Courses'"
        />
      </Tooltip>

      <Tooltip
        :text="`Settings`"
        position="right"
        class="mx-4"
        color="gold"
      >
        <MenuItemHorizontal
          icon="cog"
          :click="() => {$router.push({name: 'Settings'}) }"
          :current="pathName === 'Settings'"
        />
      </Tooltip>

      <Tooltip
        :text="`Portfolio`"
        position="right"
        :color="isSubscribed ? 'gold' : 'red'"
      >
        <MenuItemHorizontal
          class="mx-4"
          icon="user-tie"
          :color="isSubscribed ? 'gold' : 'red'"
          :click="() => {clickPortfolio()}"
          :current="pathName === 'Portfolio'"
        />
      </Tooltip>

      <Tooltip
        :text="`Achievements`"
        position="right"
        color="gold"
      >
        <MenuItemHorizontal
          class="mx-4"
          icon="trophy"
          :click="() => {$router.push({name: 'Achievements'}) }"
          :current="pathName === 'Achievements'"
        />
      </Tooltip>

      <Tooltip
        :text="`Logout`"
        position="right"
        color="gold"
      >
        <MenuItemHorizontal
          class="mx-4"
          icon="sign-out-alt"
          :click="logout"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script>
import ProModal from '@/components/ProModal.vue';
import MenuItemHorizontal from '@/components/MenuItemHorizontal.vue';
import GemDisplay from '@/components/GemDisplay.vue';
import ProfileImage from '@/components/ProfileImage.vue';
import Tooltip from '@/components/Tooltip.vue';

import {
  setLogout
} from '@/lib/cloudStore.js';

export default {
  components: {
    MenuItemHorizontal,
    GemDisplay,
    ProfileImage,
    ProModal,
    Tooltip
  },
  props: {
    pathName: {
      type: String,
      required: true
    }
  },
  computed: {
    isSubscribed(){
      return this.$store.getters.getUserIsSubscribed;
    }
  },
  methods: {
    clickPortfolio(){
      if (this.isSubscribed){
        this.$router.push({name: 'Portfolio', params: {userHandle: this.$store.getters.getUser.Handle}});
        return;
      }
      this.$refs.proModal.show();
    },
    logout(){
      setLogout(this);
    }
  }
};
</script>

<style scoped>

</style>
