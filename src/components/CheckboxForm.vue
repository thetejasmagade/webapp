<template>
  <div>
    <div class="checkbox-form">
      <p>{{ question }}</p>
      <div class="answers">
        <label
          v-for="(answer, i) of answers"
          :key="i"
          class="item"
        >
          <span :for="answer">{{ answer }}</span>
          <input
            :id="answer"
            v-model="checked"
            type="checkbox"
            :value="answer"
          >
          <span class="checkmark" />
        </label>
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

  $item-height: 25px;

  .item {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 1em;
    height: $item-height;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: flex;
    align-items: center;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: $item-height;
    width: $item-height;
    background-color: $gray-lighter;
  }

  /* On mouse-over, add a grey background color */
  .item:hover input ~ .checkmark {
    background-color: $gray-light;
  }

  /* When the checkbox is checked, add a blue background */
  .item input:checked ~ .checkmark {
    background-color: $gold-mid;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .item input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .item .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}

</style>
