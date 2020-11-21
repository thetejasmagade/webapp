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
          <img
            width="250"
            src="../img/gem-3.png"
          >
          <p>
            At university, courses cost thousands of dollars.
            With us, courses cost about the same as dinner and a movie,
            and with our gem system you can save even more!
          </p>
          <p> 
            Within Qvault, gems are used to buy courses.
            Buy some gems to get started,
            and as you complete assignments we'll award you with free bonus gems!
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
