<template>
  <div>
    <div class="text-gray-700 bg-white h-full text-center shadow relative z-40">
      <div class="profile-box flex flex-col items-center">
        <ProfileImage
          class="profile-img my-3 w-3/5"
          :profile-image-u-r-l="$store.getters.getUser ? $store.getters.getUser.ProfileImageURL : null"
          editable
        />
      </div>

      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>

      <GemDisplay
        :size=".5"
        :text="`${$store.getters.getBalance}`"
        vertical
        class="mb-3"
      />

      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>
      
      <Tooltip
        :text="`Courses`"
        position="right"
        class="mx-4 mb-2"
        color="gold"
      >
        <MenuItemHorizontal
          icon="scroll"
          :click="() => {$router.push({name: 'Courses'}) }"
          :current="routePath.includes('courses')"
        />
      </Tooltip>

      <Tooltip
        :text="`Settings`"
        position="right"
        class="mx-4 mb-2"
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
        class="mx-4 mb-2"
        color="gold"
      >
        <MenuItemHorizontal
          icon="user-tie"
          :click="() => $router.push({name: 'Portfolio', params: {userHandle: $store.getters.getUser.Handle}})"
          :current="pathName === 'Portfolio'"
        />
      </Tooltip>

      <Tooltip
        :text="`Achievements`"
        position="right"
        class="mx-4 mb-2"
        color="gold"
      >
        <MenuItemHorizontal
          icon="trophy"
          :click="() => {$router.push({name: 'Achievements'}) }"
          :current="pathName === 'Achievements'"
        />
      </Tooltip>

      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>

      <Tooltip
        :text="`Logout`"
        position="right"
        class="mx-4 mb-2"
        color="gold"
      >
        <MenuItemHorizontal
          icon="sign-out-alt"
          :click="logout"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script>
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
    Tooltip
  },
  props: {
    pathName: {
      type: String,
      required: true
    },
    routePath: {
      type: String,
      required: true
    }
  },
  methods: {
    logout(){
      setLogout(this);
    }
  }
};
</script>

<style scoped>

</style>
