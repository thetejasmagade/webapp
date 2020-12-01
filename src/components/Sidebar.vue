<template>
  <div>
    <div class="sidebar desktop">
      <div class="profile-box">
        <ProfileImage
          class="profile-img"
          :profile-image-u-r-l="$store.getters.getUser.ProfileImageURL"
          :editable="false"
        />
        <GemDisplay :text="`${$store.getters.getBalance}`" />
      </div>

      <div class="divider">
        <div class="divider" />
      </div>

      <MenuItemHorizontal
        class="item"
        icon="store"
        :click="() => {$router.push({name: 'Store'})}"
        text="Store"
        :current="pathName === 'Store'"
      />

      <MenuItemHorizontal
        class="item"
        icon="scroll"
        :click="() => {$router.push({name: 'Courses'}) }"
        text="Courses"
        :current="pathName === 'Courses'"
      />

      <MenuItemHorizontal
        class="item"
        icon="cog"
        :click="() => {$router.push({name: 'Settings'}) }"
        text="Settings"
        :current="pathName === 'Settings'"
      />

      <MenuItemHorizontal
        class="item"
        icon="user-tie"
        :click="() => {$router.push({name: 'Portfolio', params: {userHandle: $store.getters.getUser.Handle}}) }"
        text="Portfolio"
        :current="pathName === 'Portfolio'"
      />

      <MenuItemHorizontal
        class="item"
        icon="trophy"
        :click="() => {$router.push({name: 'Achievements'}) }"
        text="Achievements"
        :current="pathName === 'Achievements'"
      />

      <MenuItemHorizontal
        class="item"
        icon="sign-out-alt"
        :click="logout"
        text="Logout"
      />

      <div class="divider">
        <div class="divider" />
      </div>

      <MenuItemHorizontal
        v-for="(course, i) of activeCourses"
        :key="i"
        class="item"
        :text="course.Title"
        :sub-items="modulesToSubItems(course.Modules)"
        :click="() => {$router.push({name: 'Exercise', params: {courseUUID: course.UUID}}) }"
        :sub-items-tab-open="pathParams.courseUUID === course.UUID"
        :active-sub-item-u-u-i-d="$store.getters.getCurrentModuleUUID"
        :current="pathParams.courseUUID === course.UUID"
      />
    </div>

    <div class="sidebar mobile">
      <div class="profile-box">
        <GemDisplay
          :text="`${$store.getters.getBalance}`"
          vertical
        />
      </div>

      <div class="divider">
        <div class="divider" />
      </div>

      <MenuItemHorizontal
        class="item"
        icon="store"
        :click="() => {$router.push({name: 'Store'})}"
        :current="pathName === 'Store'"
      />

      <MenuItemHorizontal
        class="item"
        icon="scroll"
        :click="() => {$router.push({name: 'Courses'}) }"
        :current="pathName === 'Courses'"
      />

      <MenuItemHorizontal
        class="item"
        icon="cog"
        :click="() => {$router.push({name: 'Settings'}) }"
        :current="pathName === 'Settings'"
      />

      <MenuItemHorizontal
        class="item"
        icon="user-tie"
        :click="() => {$router.push({name: 'Portfolio', params: {userHandle: $store.getters.getUser.Handle}}) }"
        :current="pathName === 'Portfolio'"
      />

      <MenuItemHorizontal
        class="item"
        icon="trophy"
        :click="() => {$router.push({name: 'Achievements'}) }"
        :current="pathName === 'Achievements'"
      />

      <MenuItemHorizontal
        class="item"
        icon="sign-out-alt"
        :click="logout"
      />
    </div>
  </div>
</template>

<script>
import MenuItemHorizontal from '@/components/MenuItemHorizontal';
import GemDisplay from '@/components/GemDisplay';
import ProfileImage from '@/components/ProfileImage';

import {
  setLogout
} from '@/lib/cloudStore.js';

export default {
  components: {
    MenuItemHorizontal,
    GemDisplay,
    ProfileImage
  },
  props: {
    pathName: {
      type: String,
      required: true
    },
    pathParams: {
      type: Object,
      required: false,
      default: () => {return {};}
    }
  },
  computed: {
    activeCourses(){
      return this.$store.getters.getCourses.filter(
        course => (course.IsPurchased && !course.IsComplete)
      );
    }
  },
  methods: {
    modulesToSubItems(modules){
      let subItems = [];
      for (const mod of modules) {
        subItems.push({
          text: mod.Title,
          uuid: mod.UUID
        });
      }
      return subItems;
    },
    logout(){
      setLogout(this);
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.mobile {
  display: none !important;
  @media screen and (max-width: $mobile-size) {
    display: block !important;
  }
}

.desktop {
  @media screen and (max-width: $mobile-size) {
    display: none !important;
  }
}

.sidebar {
	overflow: auto;
  color: $gray-lightest;
  background-color: $gray-darker-2;
  height: 100%;

  &.desktop{
    .item {
      margin: 0 1em 0 1em;
    }
  }

  &.mobile{
    text-align: center;
    .item {
      margin: 0 .5em 0 .5em;
    }
  }

  .profile-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    .profile-img{
      width: 40%;
    }
  }

  .divider {
    display: flex;
    justify-content: center;
    margin: 5px;

    div {
      width: 80%; 
      border-bottom: 1px solid $gray-light;
    }
  } 
}
</style>
