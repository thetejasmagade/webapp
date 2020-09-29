<template>
  <div>
    <div id="root">
      <p>{{ question }}</p>
      <BlockButton
        v-for="(answer, i) of answers"
        :key="i"
        class="btn"
        color="green"
        :click="() => {callback(question, answer)}"
      >
        <span>{{ answer }}</span>
      </BlockButton>
    </div>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton';

export default {
  components: {
    BlockButton
  },
  props: {
    callback: {
      type: Function,
      required: true
    },
    question: {
      type: String,
      required: false,
      default: ''
    },
    answers: {
      type: Array,
      required: false,
      default: () => []
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  p {
    margin-top: 25px;
    font-size: 2em;
    padding: 20px;
  }

  .btn {
    font-size: 18px;
    width: 80%;
    margin: 10px;
  }
}

</style>
