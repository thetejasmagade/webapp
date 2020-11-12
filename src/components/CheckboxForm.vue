<template>
  <div>
    <div class="checkbox-form">
      <p>{{ question }}</p>
      <div class="answers">
        <div
          v-for="(answer, i) of answers"
          :key="i"
        >
          <input
            :id="answer"
            v-model="checked"
            type="checkbox"
            :value="answer"
          >
          <label :for="answer">{{ answer }}</label>
        </div>
      </div>
      <BlockButton
        class="btn"
        color="purple"
        :click="() => {callback(checked)}"
        :disabled="checked.length < minChecked || checked.length > maxChecked"
      >
        <span>Submit</span>
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
    },
    minChecked: {
      type: Number,
      required: false,
      default: 1
    },
    maxChecked: {
      type: Number,
      required: false,
      default: Number.MAX_SAFE_INTEGER
    }
  },
  data(){
    return {
      checked: []
    };
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.checkbox-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  .answers {
    display: flex;
    flex-direction: column;
    align-items: left;
    min-width: 75%;
  }

  label {
    margin-left: 1em;
  }

  p {
    font-size: 1.5em;
  }

  .btn {
    font-size: 18px;
    margin: 1em;
  }
}

</style>
