<template>
  <div class="signup-flow-gems">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Achievements and gems"
        subtitle="Unlock rewards as you go, gems might be valuable someday"
        class="section"
      >
        <div class="body">
          <img
            width="250"
            src="../img/gem-3.png"
          >
          <p>
            With a pro account you'll earn gems and unlock achivements as you complete
            assignments and courses. Those rewards and certificates will be proudly 
            displayed on your public developer portfolio. Utilize your portfolio in your
            job application process to make landing that dream job a piece of cake.
          </p>
          <BlockButton
            :click="done"
          >
            <span> Get Started </span>
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav';
import BlockButton from '@/components/BlockButton';
import Section from '@/components/Section';

import { 
  gtmEventTutorialComplete
} from '@/lib/gtm.js';

export default {
  components: {
    BlockButton,
    TopNav,
    Section
  },
  methods:{
    async done(){
      gtmEventTutorialComplete();
      this.$router.push({name: 'Courses' });
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';
@import '@/styles/backgrounds.scss';

.signup-flow-gems {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  height: 100%;
  
  .subcontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    .section {
      max-width: 600px;

      .body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
    }
  }
}
</style>
