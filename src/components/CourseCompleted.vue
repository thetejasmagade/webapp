<template>
  <div class="subcontainer">
    <Section
      :title="`Congragulations! You've completed the course`"
      subtitle="Check out the new certificate on your profile then start your next course"
      class="section"
    >
      <div class="body">
        <img
          src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
        >
        <div class="btns">
          <BlockButton
            class="btn"
            :click="() => {this.$router.push({ name: 'Courses' })}"
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
import BlockButton from '@/components/BlockButton';
import Section from '@/components/Section';

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
