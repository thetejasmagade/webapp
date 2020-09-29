<template>
  <div
    class="custom-select"
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      class="selected"
      :class="{open: open}"
      @click="open = !open"
    >
      {{ selected }}
    </div>
    <div
      class="items"
      :class="{selectHide: !open}"
    >
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="selected=option; open=false; $emit('input', option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    options:{
      type: Array,
      required: true
    },
    default: {
      type: String,
      required: false,
      default: null
    },
    tabindex:{
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      selected: this.default ? this.default : (this.options.length > 0 ? this.options[0] : null),
      open: false
    };
  },
  mounted(){
    this.$emit('input', this.selected);
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.custom-select {
  position: relative;
  width: 100%;
	text-align: left;
  outline: none;
  height: 47px;
  line-height: 47px;

  .selected {
    background-color: $gray-darkest;
    border-radius: 6px;
    border: 1px solid $gray-mid;
    color: $white;
    padding-left: 1em;
    cursor: pointer;
    user-select: none;

    &.open{
      border: 1px solid $gold-dark;
      border-radius: 6px 6px 0px 0px;
    }

    &:after {
      position: absolute;
      content: "";
      top: 22px;
      right: 1em;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-color: $white transparent transparent transparent;
    }
  }

  .items {
    color: $white;
    border-radius: 0px 0px 6px 6px;
    overflow: hidden;
    border-right: 1px solid $gold-dark;
    border-left: 1px solid $gold-dark;
    border-bottom: 1px solid $gold-dark;
    position: absolute;
    background-color: $gray-darkest;
    left: 0;
    right: 0;
    z-index: 1;

    div{
      color: $white;
      padding-left: 1em;
      cursor: pointer;
      user-select: none;
      &:hover{
        background-color: $gold-dark;
      }
    }
  }
}

.selectHide {
  display: none;
}
</style>
