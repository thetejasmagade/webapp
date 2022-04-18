<template>
  <div>
    <div
      class="text-gray-200 bg-gray-800 border-gray-600 h-full text-center border-r relative z-10"
    >
      <div class="profile-box flex flex-col items-center">
        <ProfileImage
          class="profile-img my-3 w-3/5"
          :profile-image-u-r-l="
            $store.getters.getUser
              ? $store.getters.getUser.ProfileImageURL
              : null
          "
          editable
        />
      </div>

      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>

      <GemDisplay
        :size="0.5"
        :text="`${$store.getters.getBalance}`"
        vertical
        class="mb-3"
      />

      <div class="flex justify-center mb-2">
        <div class="w-3/5 border-b border-gray-300" />
      </div>

      <Tooltip
        :text="`Settings`"
        position="right"
        class="mx-4 mb-2"
        color="gray"
      >
        <SidebarItem
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
        :text="`Portfolio`"
        position="right"
        class="mx-4 mb-2"
        color="gray"
      >
        <SidebarItem
          icon="user-tie"
          :click="
            () =>
              $router.push({
                name: 'Portfolio',
                params: { userHandle: $store.getters.getUser.Handle },
              })
          "
          :current="routeName === 'Portfolio'"
        />
      </Tooltip>

      <Tooltip
        :text="`Achievements`"
        position="right"
        class="mx-4 mb-2"
        color="gray"
      >
        <SidebarItem
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
        <SidebarItem icon="sign-out-alt" :click="logout" />
      </Tooltip>
    </div>
  </div>
</template>

<script>
import SidebarItem from "@/components/SidebarItem.vue";
import GemDisplay from "@/components/GemDisplay.vue";
import ProfileImage from "@/components/ProfileImage.vue";
import Tooltip from "@/components/Tooltip.vue";
import { useRoute } from "vue-router";

import { loadBalance, loadUser } from "@/lib/cloudStore.js";

import { setLogout } from "@/lib/cloudStore.js";

export default {
  components: {
    SidebarItem,
    GemDisplay,
    ProfileImage,
    Tooltip,
  },
  computed: {
    routePath() {
      return useRoute().path;
    },
    routeName() {
      return useRoute().name;
    },
  },
  async mounted() {
    if (!this.$store.getters.getUser) {
      loadUser(this.$store.commit);
    }
    loadBalance(this.$store.commit);
  },
  methods: {
    logout() {
      setLogout(this);
    },
  },
};
</script>

<style scoped></style>
