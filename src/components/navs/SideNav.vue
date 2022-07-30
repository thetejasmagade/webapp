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
      <Radial
        class="mb-2 ml-3"
        :from-percent="getPercentXPFromUser(oldUserState)"
        :to-percent="toPercent"
        :duration="2000"
        :level="level"
        :radius="20"
        :stroke-width="7"
        :on-animation-complete="onAnimationComplete"
        :on-rollover="onRollover"
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
import Radial from "@/components/Radial.vue";
import { useRoute, useRouter } from "vue-router";

import { loadUser } from "@/lib/cloudStore.js";
import { useStore } from "vuex";

import { setLogout } from "@/lib/cloudStore.js";
import { computed, reactive, toRefs, watchEffect, onMounted } from "vue";

export default {
  components: {
    SideNavItem,
    ProfileImage,
    Tooltip,
    Radial,
  },
  setup() {
    const state = reactive({
      level: null,
      toPercent: null,
      newUserStates: [],
      oldUserState: null,
    });
    const store = useStore();
    const router = useRouter();
    const routePath = computed(() => {
      return useRoute().path;
    });
    const routeName = computed(() => {
      return useRoute().name;
    });
    const onRollover = () => {
      state.level++;
    };
    const getPercentXPFromUser = (user) => {
      if (!user) {
        return 0;
      }
      return Math.round((user.XPForLevel / user.XPTotalForLevel) * 100);
    };
    const newUserState = computed(() => {
      if (state.newUserStates.length === 0) {
        return null;
      }
      return state.newUserStates[0];
    });
    const onAnimationComplete = () => {
      if (state.newUserStates.length === 0) {
        return;
      }
      state.oldUserState = state.newUserStates.shift();
      state.level = state.oldUserState?.Level;
      state.toPercent = getPercentXPFromUser(state.oldUserState);
    };
    const logout = () => {
      setLogout(store.commit, router);
    };
    onMounted(async () => {
      await loadUser(store.commit);
    });
    watchEffect(() => {
      if (!state.oldUserState) {
        state.oldUserState = store.getters.getUser;
        state.toPercent = getPercentXPFromUser(state.oldUserState);
        state.level = state.oldUserState?.Level;
        return;
      }
      if (
        getPercentXPFromUser(state.oldUserState) ===
          getPercentXPFromUser(store.getters.getUser) &&
        state.oldUserState?.Level === store.getters.getUser?.Level
      ) {
        return;
      }
      state.newUserStates.push(store.getters.getUser);
    });
    watchEffect(() => {
      if (state.toPercent !== null) {
        return;
      }
      state.toPercent = getPercentXPFromUser(state.oldUserState);
    });
    watchEffect(async () => {
      if (!newUserState.value || !state.oldUserState) {
        return;
      }
      const levelUps = newUserState.value.Level - state.oldUserState.Level;
      state.toPercent =
        getPercentXPFromUser(newUserState.value) + levelUps * 100;
    });
    return {
      ...toRefs(state),
      routePath,
      routeName,
      onRollover,
      onAnimationComplete,
      getPercentXPFromUser,
      logout,
    };
  },
};
</script>

<style scoped></style>
