<template>
  <div class="flex items-center justify-center">
    <div class="relative inline-block text-left dropdown cursor-pointer">
      <span class="rounded-md shadow-sm">
        <button
          class="inline-flex justify-center w-full px-4 py-2 leading-6 transition duration-150 ease-in-out rounded-md focus:outline-none"
          :class="{
            'hover:text-gray-400': selected.color !== 'blue',
            'text-gray-800': selected.color !== 'blue',
            'bg-gray-200': selected.color !== 'blue',
            'hover:bg-blue-400': selected.color === 'blue',
            'text-gray-200': selected.color === 'blue',
            'bg-blue-500': selected.color === 'blue',
          }"
          type="button"
          aria-haspopup="true"
          aria-expanded="true"
          aria-controls="headlessui-menu-items-117"
          @click="toggleMenuOpen"
          @blur="closeMenu"
        >
          <span>{{ selected.name }}</span>
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
      <div
        class="transition-all duration-300 transform origin-top-left -translate-y-2 scale-95"
        :class="{
          'menu-closed': !menuIsOpen,
          'menu-open': menuIsOpen,
        }"
      >
        <div
          id="headlessui-menu-items-117"
          class="absolute left-0 w-56 mt-2 origin-top-left bg-gray-700 border-gray-200 divide-y divide-gray-300 rounded-md shadow-lg outline-none overflow-y-auto max-h-56"
          aria-labelledby="headlessui-menu-button-1"
          role="menu"
        >
          <div
            v-for="(option, i) of options"
            :key="i"
            href="javascript:void(0)"
            tabindex="0"
            class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
            :class="{
              'hover:text-gray-400': option.color !== 'blue',
              'text-gray-800': option.color !== 'blue',
              'bg-gray-200': option.color !== 'blue',
              'hover:bg-blue-400': option.color === 'blue',
              'text-gray-200': option.color === 'blue',
              'bg-blue-500': option.color === 'blue',
            }"
            role="menuitem"
            @click="
              selected = option;
              $emit('update:modelValue', option);
            "
          >
            {{ option.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: Object,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selected: this.getSelectionFromDefault(this.default),
      menuIsOpen: false,
    };
  },
  watch: {
    default(newDefault) {
      this.selected = this.getSelectionFromDefault(newDefault);
    },
  },
  methods: {
    getSelectionFromDefault(def) {
      if (this.options.length === 0) {
        return null;
      }
      if (!def) {
        return this.options[0];
      }
      return def;
    },
    toggleMenuOpen() {
      this.menuIsOpen = !this.menuIsOpen;
    },
    closeMenu() {
      this.menuIsOpen = false;
    },
  },
};
</script>

<style scoped>
.menu-open {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
.menu-closed {
  opacity: 0;
  transform: translate(0) scale(1);
  visibility: hidden;
}
</style>
