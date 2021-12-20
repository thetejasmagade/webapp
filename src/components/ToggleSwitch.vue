<template>
  <div>
    <span
      class="
        inline-block
        relative
        cursor-pointer
        w-8
        h-4
        rounded-full	
        focus:outline-none
      "
      role="checkbox"
      :aria-checked="modelValue.toString()"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span
        class="
          toggle-background
          inline-block
          rounded-full
          h-full
          w-full
          shadow-inset
          transition-colors
        "
        :class="backgroundStyles"
      />
      <span
        class="
          absolute
          h-3
          w-3
          inset-0.5	
          bg-white
          rounded-full
          shadow
          transition-transform
          duration-500
        "
        :style="indicatorStyles" 
      />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue:{
      type: Boolean,
      required: true
    }
  },
  emits: [ 'update:modelValue' ],
  computed: {
    backgroundStyles() {
      return {
        'bg-gold-500': this.modelValue,
        'bg-gray-300': !this.modelValue
      };
    },
    indicatorStyles() {
      return { transform: this.modelValue ? 'translateX(16px)' : 'translateX(0)' };
    }
  },
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue);
    }
  }
};
</script>

<style scoped>
.shadow-inset {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
