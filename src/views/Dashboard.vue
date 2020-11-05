<template>
  <div id="dashboard">
    <TopNav />
    <div id="dashboard-container">
      <Sidebar
        :path-name="$router.currentRoute.name"
        :path-params="$router.currentRoute.params"
        class="sidebar"
      />

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
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

import {
  getRewards
} from '@/lib/cloudClient.js';

import {
  loadCourses,
  loadBalance,
  loadProducts,
  loadUser,
  loadLoggedIn
} from '@/lib/cloudStore.js';

export default {
  components: {
    Sidebar,
    TopNav
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

.sidebar {
	display: inline-block;
	vertical-align: top;
  flex-basis: 16%;
  max-width: 300px;
  min-width: 75px;
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
