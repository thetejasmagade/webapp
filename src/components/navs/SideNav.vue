<template>
  <div>
    <div
      class="text-gray-200 bg-gray-800 border-gray-600 h-full text-center border-r relative z-10"
    >
      <router-link
        v-if="$store.getters.getUser"
        class="profile-box flex flex-col items-center"
        :to="{
          name: 'Portfolio',
          params: { userHandle: $store.getters.getUser.Handle },
        }"
      >
        <ProfileImage
          class="profile-img my-3 w-3/5 hover:opacity-75"
          :profile-image-u-r-l="
            $store.getters.getUser
              ? $store.getters.getUser.ProfileImageURL
              : null
          "
        />
      </router-link>
      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>
      <XPRadial class="mb-2" />
      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>

      <Tooltip
        :text="`Settings`"
        position="right"
        class="mx-4 mb-2"
        color="gray"
      >
        <SideNavItem
          icon="cog"
          :click="
            () => {
              $router.push({ name: 'Settings' });
            }
          "
          :current="routeName === 'Settings'"
        />
      </Tooltip>

      <Tooltip
        :text="`Achievements`"
        position="right"
        class="mx-4 mb-2"
        color="gray"
      >
        <SideNavItem
          icon="trophy"
          :click="
            () => {
              $router.push({ name: 'Achievements' });
            }
          "
          :current="routeName === 'Achievements'"
        />
      </Tooltip>

      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>

      <Tooltip :text="`Logout`" position="right" class="mx-4 mb-2" color="gray">
        <SideNavItem icon="sign-out-alt" :click="logout" />
      </Tooltip>
    </div>
  </div>
</template>

<script>
import SideNavItem from "@/components/navs/SideNav/SideNavItem.vue";
import ProfileImage from "@/components/ProfileImage.vue";
import Tooltip from "@/components/Tooltip.vue";
import { useRoute, useRouter } from "vue-router";
import XPRadial from "@/components/XPRadial.vue";

import { setLogout } from "@/lib/cloudStore.js";
import { useStore } from "vuex";

import { computed } from "vue";

export default {
  components: {
    SideNavItem,
    ProfileImage,
    Tooltip,
    XPRadial,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const routePath = computed(() => {
      return useRoute().path;
    });
    const routeName = computed(() => {
      return useRoute().name;
    });
    const logout = () => {
      setLogout(store.commit, router);
    };
    return {
      routePath,
      routeName,
      logout,
    };
  },
};
</script>

<style scoped></style>
