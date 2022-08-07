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
    <div class="flex flex-row items-center justify-center w-full">
      <BlockButton :click="onClickTwitterShare" color="gray" class="mr-4">
        Tweet about it
      </BlockButton>
      <BlockButton
        v-if="$store.getters.getUser"
        class="m-4"
        :link="{
          name: 'Portfolio',
          params: { userHandle: $store.getters.getUser.Handle },
        }"
        color="blue"
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

import { imageURLToTwitterImageURL } from "@/lib/cloudClient.js";

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

    const onClickTwitterShare = async () => {
      const resp = await imageURLToTwitterImageURL(
        getUnitData(unit.value).ImageURL
      );
      const courseTweet = `🔥 Course Completed! 🔥
      
I just finished the '${getUnitData(unit.value).Title}' course on Boot .dev!

#Bootdev @bootdotdev ${resp.TwitterImageURL}
`;

      const projectTweet = `🔥 Project Completed! 🔥
      
I just finished the '${getUnitData(unit.value).Title}' project on Boot .dev!

#Bootdev @bootdotdev ${resp.TwitterImageURL}
`;
      if (unit.value.type === "course") {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            courseTweet
          )}`,
          "_blank"
        );
      } else {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            projectTweet
          )}`,
          "_blank"
        );
      }
    };

    onMounted(() => {
      markSeen(getSeenUnitDoneModalKey(getUnitData(unit.value).UUID));
      eventFinishCourse(getUnitData(unit.value).Title, false);
    });

    return {
      onClickTwitterShare,
    };
  },
};
</script>

<style scoped></style>
