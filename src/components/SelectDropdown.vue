<template>
  <div class="flex items-center justify-center">
    <div class="relative inline-block text-left dropdown cursor-pointer">
      <span
        class="rounded-md shadow-sm"
      >
        <button
          :class="getColor(selected.color)"
          class="
            inline-flex
            justify-center
            w-full
            px-4
            py-2
            leading-6
            text-gray-800
            transition
            duration-150
            ease-in-out
            bg-white border
            border-gray-300
            rounded-md
            hover:text-gray-400
            focus:outline-none
          " 
          type="button"
          aria-haspopup="true"
          aria-expanded="true"
          aria-controls="headlessui-menu-items-117"
        >
          <span>{{ selected.text }}</span>
          <svg
            class="w-5 h-6 ml-2 -mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
      <div class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-left -translate-y-2 scale-95">
        <div
          id="headlessui-menu-items-117"
          class="absolute left-0 w-56 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none overflow-y-auto max-h-56"
          aria-labelledby="headlessui-menu-button-1"
          role="menu"
        >
          <div
            v-for="(option, i) of options"
            :key="i"
            href="javascript:void(0)"
            tabindex="0"
            class="
              text-gray-800
              hover:text-gray-300
              flex
              justify-between
              w-full
              px-4
              py-2
              text-sm
              leading-5
              text-left
            "
            :class="getColor(option.color)"
            role="menuitem"
            @click="selected=option; $emit('update:modelValue', option)"
          >
            {{ option.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    options: {
      type: Array,
      required: true
    },
    default: {
      type: Object,
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
      selected: this.getSelectionFromDefault(this.default)

    };
  },
  watch: {
    default(newDefault){
      this.selected = this.getSelectionFromDefault(newDefault);
    }
  },
  methods: {
    getColor(colorName){
      return{
        'bg-green-400': colorName === 'green',
        'hover:text-gray-600': colorName = 'green'
      };
    },
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
.dropdown:focus-within .dropdown-menu {
  opacity:1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
