<template>
  <div>
    <div class="block list-none m-0 p-0">
      <router-link
        v-for="(tab, i) of tabs"
        :key="i"
        class="py-3 px-4 rounded-t mr-2 inline-block cursor-pointer hover:bg-gray-800"
        :class="{
          'bg-gray-800': routePath.includes(tab.route),
          'bg-gray-750': !routePath.includes(tab.route),
        }"
        :to="{ path: tab.route }"
      >
        <FontAwesomeIcon :icon="tab.icon" class="md:mr-4 mx-1" />
        <span class="md:inline-block hidden text-sm"> {{ tab.name }} </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  components: {
    FontAwesomeIcon,
  },
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const routePath = computed(() => {
      return useRoute().path;
    });
    const routeName = computed(() => {
      return useRoute().name;
    });

    return {
      routePath,
      routeName,
    };
  },
};
</script>

<style scoped></style>
