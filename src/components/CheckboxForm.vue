<template>
  <div>
    <div class="checkbox-form">
      <div class="answers">
        <label
          v-for="(option, i) of options"
          :key="i"
          class="item"
        >
          <span :for="option">{{ option }}</span>
          <input
            :id="option"
            v-model="checked"
            :value="option"
            type="checkbox"
            @change="onChange"
          >
          <span class="checkmark" />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  emits: [ 'update:modelValue' ],
  data(){
    return {
      checked: []
    };
  },
  methods: {
    onChange() {
      this.$emit('update:modelValue', this.checked);
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.checkbox-form {
  display: flex;
  flex-direction: column;
  align-items: center;

  .answers {
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%;
  }

  label {
    margin-left: 1em;
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

  .item:hover input ~ .checkmark {
    background-color: $gray-light;
  }

  .item input:checked ~ .checkmark {
    background-color: $gold-mid;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .item input:checked ~ .checkmark:after {
    display: block;
  }

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
