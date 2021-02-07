<template>
  <div class="signup-flow-portfolio">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Your path to success"
        subtitle="Share your free Qvault portfolio with future employers"
        class="section"
      >
        <div class="body">
          <img
            width="250"
            class="img"
            src="https://qvault.io/wp-content/uploads/2020/12/undraw_interview_rmcf.png"
          >
          <p>
            The point of learning to code and improving your CS skills is to land a high-paying job and achieve the professional lifestyle you've always wanted.
          </p>
          <p> 
            We provide 100% free certificates for each course you've completed on your public portfolio page.
            Share the link to your portfolio with potential employers!
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

export default {
  components: {
    BlockButton,
    TopNav,
    Section
  },
  methods:{
    async done(){
      this.$router.push({name: 'SignupFlowGems' });
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';
@import '@/styles/backgrounds.scss';

.img {
  margin: 1em;
  border-radius: 50%;
}

.signup-flow-portfolio {
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
