<template>
  <div>
    <h1 v-if="unit.type === 'course'" class="text-2xl text-blue-400 mb-4">
      Congratulations! You've completed the course!
    </h1>
    <h1 v-else class="text-2xl text-blue-400 mb-4">
      Congratulations! You've completed the project!
    </h1>
    <p v-if="unit.type === 'course'" class="mb-4">
      Check out the new certificate on your portfolio then start your next
      course
    </p>
    <div class="flex justify-center">
      <img loading="lazy" class="rounded" src="/src/img/gatsby_toast.webp" />
    </div>
    <div class="flex justify-center">
      <BlockButton class="m-4" :link="{ name: 'Tracks' }">
        Next Course
      </BlockButton>
      <BlockButton
        class="m-4"
        :link="{
          name: 'Portfolio',
          params: { userHandle: $store.getters.getUser.Handle },
        }"
        color="gray"
      >
        View Portfolio
      </BlockButton>
    </div>
  </div>
</template>

<script>
import BlockButton from "@/components/BlockButton.vue";

import { markSeen, getSeenUnitDoneModalKey } from "@/lib/localStorageLib";

import { eventFinishCourse } from "@/lib/analytics.js";

import { getUnitData } from "@/lib/unit.js";
import { onMounted, toRefs } from "@vue/runtime-core";

export default {
  components: {
    BlockButton,
  },
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { unit } = toRefs(props);
    onMounted(() => {
      markSeen(getSeenUnitDoneModalKey(getUnitData(unit.value).UUID));
      eventFinishCourse(getUnitData(unit.value).Title, false);
    });
  },
};
</script>

<style scoped></style>
