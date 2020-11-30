<template>
  <div>
    <div class="multiple-choice">
      <h2>{{ question }}</h2>
      <BlockButton
        v-for="(answer, i) of answers"
        :key="i"
        class="btn"
        color="gold"
        :click="() => {callback(answer)}"
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

.multiple-choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  h2 {
    margin-top: 1em;
    font-size: 2em;
    padding: 0 1em 0 1em;
  }

  .btn {
    font-size: 18px;
    width: 80%;
    margin: 10px;
    max-width: 400px;
  }
}

</style>
