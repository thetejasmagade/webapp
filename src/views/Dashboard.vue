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
          <router-view
            :key="$route.fullPath"
            class="router-view"
          />
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
  loadProgramCS,
  loadBalance,
  loadSubscriptionPlans,
  loadUser,
  loadLoggedIn
} from '@/lib/cloudStore.js';

export default {
  metaInfo() {
    const title = 'Qvault - Dashboard';
    return {
      title: title,
      meta: [
        { vmid:'og:title', property: 'og:title', content: title },
        { vmid:'twitter:title', name: 'twitter:title', content: title }
      ]
    };
  },
  components: {
    Sidebar,
    TopNav
  },
  async mounted(){
    loadLoggedIn(this);
    await loadSubscriptionPlans(this); 
    loadProgramCS(this);
    if (!this.$store.getters.getUser){
      loadUser(this);
    }

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

  .inner-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}
</style>
