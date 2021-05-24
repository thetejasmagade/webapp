<template>
  <div>
    <div class="flex flex-col">
      <label
        v-for="(option, i) of options"
        :key="i"
        class="inline-flex items-center mt-3"
      >
        <input
          :id="option"
          v-model="checked"
          :value="option"
          type="checkbox"
          class="form-checkbox h-5 w-5 text-gold-500 rounded-sm border-none bg-gray-400 focus:ring-gold-600"
          @change="onChange"
        ><span class="ml-2 text-gray-700"> {{ option }}</span>
      </label>
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

<style scoped>

</style>
