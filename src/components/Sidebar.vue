<template>
  <div>
    <div class="sidebar desktop">
      <div class="profile-box">
        <ProfileImage
          class="profile-img"
          :profile-image-u-r-l="$store.getters.getUser ? $store.getters.getUser.ProfileImageURL : null"
          editable
        />
        <GemDisplay :text="`${$store.getters.getBalance}`" />
      </div>

      <div class="divider">
        <div class="divider" />
      </div>

      <MenuItemHorizontal
        class="item"
        icon="store"
        :click="() => {$router.push({name: 'Pricing'})}"
        text="Pricing"
        :current="pathName === 'Pricing'"
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
        :icon="$store.getters.getUserIsSubscribed ? 'user-tie' : 'lock'"
        :click="() => {clickPortfolio()}"
        text="Portfolio"
        :current="pathName === 'Portfolio'"
      />

      <MenuItemHorizontal
        class="item"
        :icon="$store.getters.getUserIsSubscribed ? 'trophy' : 'lock'"
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

      <div
        v-if="activeCourse"
        class="divider"
      >
        <div class="divider" />
      </div>

      <MenuItemHorizontal
        v-if="activeCourse"
        class="item"
        :text="activeCourse.Title"
        :sub-items="modulesToSubItems(activeCourse.Modules)"
        :click="() => {}"
        :sub-items-tab-open="true"
        :active-sub-item-u-u-i-d="$store.getters.getCurrentModuleUUID"
        :current="true"
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
        :click="() => {$router.push({name: 'Pricing'})}"
        :current="pathName === 'Pricing'"
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
        :icon="$store.getters.getUserIsSubscribed ? 'user-tie' : 'lock'"
        :click="() => {clickPortfolio()}"
        :current="pathName === 'Portfolio'"
      />

      <MenuItemHorizontal
        class="item"
        :icon="$store.getters.getUserIsSubscribed ? 'trophy' : 'lock'"
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
import MenuItemHorizontal from '@/components/MenuItemHorizontal.vue';
import GemDisplay from '@/components/GemDisplay.vue';
import ProfileImage from '@/components/ProfileImage.vue';

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
    activeCourse(){
      for (const course of this.$store.getters.getCourses){
        if (course.UUID === this.pathParams.courseUUID){
          return course;
        }
      }
      return null;
    }
  },
  methods: {
    clickPortfolio(){
      if (this.$store.getters.getUserIsSubscribed){
        this.$router.push({name: 'Portfolio', params: {userHandle: this.$store.getters.getUser.Handle}});
        return;
      }
      this.$proModal.show();
    },
    modulesToSubItems(modules){
      let subItems = [];
      for (const mod of modules) {
        subItems.push({
          thisComponent: this,
          text: mod.Title,
          uuid: mod.UUID,
          async click() {
            this.thisComponent.$router.push({
              name: 'Exercise',
              params: {
                courseUUID: this.thisComponent.activeCourse.UUID,
                moduleUUID: this.uuid
              }
            });
          }
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
      margin-top: 1em;
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
