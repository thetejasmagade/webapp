<template>
  <div>
    <div class="slider-component">
      <div class="slidecontainer">
        <input
          ref="input"
          v-model="currentValue"
          type="range"
          :min="min"
          :max="max"
          class="slider"
          @input="onInput"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  emits: [ 'update:modelValue' ],
  data(){
    return {
      currentValue: this.modelValue
    };
  },
  methods: {
    onInput() {
      // this.currentValue is a string because HTML is weird
      this.$emit('update:modelValue', parseInt(this.currentValue));
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.slider-component {
  .slidecontainer {
    width: 100%;

    .slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: $gray-lighter;
      outline: none;
      opacity: 0.7;
      -webkit-transition: .2s;
      transition: opacity .2s;

      &:hover {
        opacity: 1;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        background: $gold-mid;
        cursor: pointer;
        border-radius: 50%;
      }

      &::-moz-range-thumb {
        width: 18px;
        height: 18px;
        background: $gold-mid;
        cursor: pointer;
        border-radius: 50%;
      }
    }
  }
}
</style>
