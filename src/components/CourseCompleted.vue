<template>
  <div class="subcontainer">
    <Section
      :title="`Congragulations! You've completed the course`"
      subtitle="Check out the new certificate on your portfolio then start your next course"
      class="section"
    >
      <div class="body">
        <img
          src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
        >
        <div class="btns">
          <BlockButton
            class="btn"
            :click="clickNextCourse"
          >
            Next Course
          </BlockButton>
          <BlockButton
            class="btn"
            :click="() => {$router.push({name: 'Portfolio', params: {userHandle: $store.getters.getUser.Handle}}) }"
            color="gray"
          >
            View Portfolio
          </BlockButton>
          <BlockButton
            class="btn"
            :click="restartCallback"
            color="gray"
          >
            Restart
          </BlockButton>
        </div>
      </div>
    </Section>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue';
import Section from '@/components/Section.vue';

import {
  loadProgramCS
} from '@/lib/cloudStore.js';

export default {
  components: {
    BlockButton,
    Section
  },
  props: { 
    restartCallback: {
      type: Function,
      required: true
    }
  },
  methods: {
    async clickNextCourse(){
      await loadProgramCS(this);
      this.$router.push({ name: 'Courses'});
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.subcontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .section {
    max-width: 800px;

    .body {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .btns {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .btn {
        margin: 5px;
      }

      img {
        margin: 1em;
      }
    }
  }
}
</style>
