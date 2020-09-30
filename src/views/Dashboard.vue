<template>
  <div id="dashboard">
    <TopNav />
    <div id="dashboard-container">
      <div id="sidebar">
        <div class="profile-box">
          <ProfileImage
            class="profile-img"
            :profile-image-u-r-l="$store.getters.getUser.ProfileImageURL"
            :editable="false"
          />
          <GemDisplay :cost="$store.getters.getBalance" />
        </div>

        <div class="divider">
          <div class="divider" />
        </div>

        <MenuItemHorizontal
          class="item"
          icon="store"
          :click="() => {$router.push({name: 'Store'})}"
          text="Store"
          :current="$router.currentRoute.name === 'Store'"
        />

        <MenuItemHorizontal
          class="item"
          icon="scroll"
          :click="() => {$router.push({name: 'Courses'}) }"
          text="Courses"
          :current="$router.currentRoute.name === 'Courses'"
        />

        <MenuItemHorizontal
          class="item"
          icon="user-tie"
          :click="() => {$router.push({name: 'Profile'}) }"
          text="Profile"
          :current="$router.currentRoute.name === 'Profile'"
        />

        <MenuItemHorizontal
          class="item"
          icon="trophy"
          :click="() => {$router.push({name: 'Portfolio', params: {userHandle: $store.getters.getUser.Handle}}) }"
          text="Portfolio"
          :current="$router.currentRoute.name === 'Portfolio'"
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
          :sub-items-tab-open="$router.currentRoute.params.courseUUID === course.UUID"
          :active-sub-item-u-u-i-d="$store.getters.getCurrentModuleUUID"
          :current="$router.currentRoute.params.courseUUID === course.UUID"
        />
      </div>

      <div id="content">
        <div class="inner-content">
          <div class="panel">
            <router-view class="router-view" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuItemHorizontal from '@/components/MenuItemHorizontal';
import GemDisplay from '@/components/GemDisplay';
import TopNav from '@/components/TopNav';
import ProfileImage from '@/components/ProfileImage';

import {
  getRewards
} from '@/lib/cloudClient.js';

import {
  loadCourses,
  loadBalance,
  loadProducts,
  loadUser,
  loadLoggedIn,
  setLogout
} from '@/lib/cloudStore.js';

export default {
  components: {
    MenuItemHorizontal,
    GemDisplay,
    TopNav,
    ProfileImage
  },
  computed: {
    activeCourses(){
      return this.$store.getters.getCourses.filter(
        course => (course.IsPurchased && !course.IsComplete)
      );
    }
  },
  async mounted(){
    loadLoggedIn(this);  
    loadCourses(this);
    loadProducts(this);
    loadUser(this);

    await this.loadRewards();
    loadBalance(this);
  },
  methods: {
    async loadRewards(){
      try {
        const rewards = await getRewards();
        for (const reward of rewards.Rewards){
          this.$notify({
            type: 'success',
            text: `${reward.Message} 💎x${reward.GemCredit}`
          });
        }
      } catch (err) {
        this.$notify({
          type: 'error',
          text: err
        });
      }
    },
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

#dashboard {
  #dashboard-container {
    display: flex;
    height: calc(100vh - #{$bar-height});
  }
}

#sidebar {
	display: inline-block;
	vertical-align: top;
  flex-basis: 16%;
  min-width: 200px;
	overflow: auto;
  color: $gray-lightest;
  background-color: $gray-darker-2;

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

#content {
	display: inline-block;
	vertical-align: top;
	height: 100%;
	overflow: auto;
  flex: 1;
  background-color: $gray-mid;

  .inner-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .panel{
      background-color: $gray-lightest;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
