<template>
  <div
    class="
      relative
      outline-none
      h-10
      leading-10
    "
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      class="
        selected
        bg-white
        rounded-md
        border
        border-gray-500
        text-gray-800
        cursor-pointer
        pr-8
        pl-6
      "
      :class="{open: open}"
      @click="open = !open"
    >
      {{ selected }}
      <div
        class="
          arrow
          absolute
          top-5
          right-3
          h-0
          border-4
        "
      />
    </div>
    <div
      class="
        text-gray-100
        overflow-auto
        position-absolute
        left-0
        right-0
        bg-gray-300
        rounded-b-md
        border-gray-500
        border-l
        border-r
        border-b
        z-10
        max-h-80
      "
      :class="{selectHide: !open}"
    >
      <div
        v-for="(option, i) of options"
        :key="i"
        class="
          text-gray-800
          px-4
          cursor-pointer
          hover:bg-gold-400
        "
        @click="selected=option; open=false; $emit('update:modelValue', option)"
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
  emits: [ 'update:modelValue' ],
  data() {
    return {
      selected: this.getSelectionFromDefault(this.default),
      open: false
    };
  },
  watch: {
    default(newDefault){
      this.selected = this.getSelectionFromDefault(newDefault);
    }
  },
  methods: {
    getSelectionFromDefault(def){
      if (this.options.length === 0) {
        return null;
      }
      if (!def) {
        return this.options[0];
      }
      return def;
    }
  }
};
</script>

<style scoped>

.open {
  border-radius: 6px 6px 0px 0px;
}

.arrow {
  border-color: black transparent transparent transparent;
}

.selectHide {
  display: none;
}
</style>
