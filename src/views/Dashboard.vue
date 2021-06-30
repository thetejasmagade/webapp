<template>
  <div id="dashboard">
    <TopNav />
    <div id="dashboard-container">
      <Sidebar
        :path-name="routeName"
        class="sidebar w-20"
      />

      <div id="content">
        <div class="inner-content">
          <router-view
            :key="routePath"
            class="router-view"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue';
import Sidebar from '@/components/Sidebar.vue';
import { useRoute } from 'vue-router';

import {
  getRewards
} from '@/lib/cloudClient.js';
import { notify } from '@/lib/notification.js';

import {
  loadProgramCS,
  loadBalance,
  loadUser
} from '@/lib/cloudStore.js';

export default {
  components: {
    Sidebar,
    TopNav
  },
  computed: {
    routePath(){
      return useRoute().path;
    },
    routeName(){
      return useRoute().name;
    },
    routeQuery(){
      return useRoute().query.redirect;
    }
  },
  async mounted(){
    if (this.routeQuery){
      this.$router.push({path: this.routeQuery});
    }

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
          notify({
            type: 'success',
            text: `${reward.Message} 💎x${reward.GemCredit}`
          });
        }
      } catch (err) {
        notify({
          type: 'danger',
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
