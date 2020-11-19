<template>
  <div class="signup-flow-gems">
    <TopNav title="Getting Started" />

    <div class="subcontainer">
      <Section
        title="Unlocking Courses"
        subtitle="Gems are the currency of Qvault. Use gems to purchase courses."
        class="section"
      >
        <div class="body">
          <p>
            At university, courses cost thousands of dollars.
            On Qvault, courses cost about the same as dinner and a movie,
            and with our gem system you can save even more!
          </p>
          <img
            width="250"
            src="../img/gem-3.png"
          >
          <p> 
            Within Qvault, gems are used as a way to buy courses.
            Since you're new, you'll need to buy some gems to get started,
            but as you complete assignments we'll award you with bonus gems!
          </p>
          <BlockButton
            :click="done"
          >
            <span> Let's Get Going </span>
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
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: $gray-lines;
  
  .subcontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    .section {
      max-width: 800px;

      .body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
