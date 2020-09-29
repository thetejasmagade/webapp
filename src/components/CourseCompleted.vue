<template>
  <div
    class="container"
  >
    <img
      src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
    >
    <p> 
      Congragulations! You've completed this course 
    </p>
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
</template>

<script>
import BlockButton from '@/components/BlockButton';

export default {
  components: {
    BlockButton
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

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

p {
  font-size: 2em;
}

.btn {
  font-size: 1.5em;
  margin: 1em;
}
</style>
