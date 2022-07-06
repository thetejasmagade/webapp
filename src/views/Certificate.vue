<template>
  <div class="h-full bg-gray-900 flex flex-col items-center">
    <div class="cert flex justify-center p-8">
      <div
        id="cert"
        class="flex justify-center p-4 w-11/12 bg-gray-700 text-gray-200"
      >
        <div
          class="inner-content border-gray-500 border-2 p-4 w-full text-center rounded"
        >
          <h1 class="text-6xl mt-4 text-blue-400 font-light">
            CERTIFICATE OF COMPLETION
          </h1>
          <p class="text-lg border-blue-400 border-b-2 pb-2 font-thin">
            FROM BOOT.DEV IN THE AREA OF COMPUTER SCIENCE
          </p>
          <div class="border-blue-400 border-b-2 pb-2 mb-8" />
          <p class="text-xl mb-2 font-light">
            This Certificate Is Proudly Presented To
          </p>
          <p class="text-6xl mb-8 text-blue-400 font-bold">
            {{ user.FirstName }} {{ user.LastName }}
          </p>
          <p class="text-xl mb-2 font-light">Who Has Completed Boot.dev's</p>
          <p class="text-4xl mb-8 font-bold">{{ course.Title }} Course</p>
          <p class="text-2xl font-light">On {{ computedDate }}</p>
          <div class="flex justify-around p-8">
            <img
              loading="lazy"
              alt="Boot.dev logo"
              src="/src/img/boot_dev_logo_full_256.png"
              class="align-middle w-24 h-24 ml-2"
            />
          </div>
        </div>
      </div>
    </div>
    <BlockButton :click="download" color="blue" class="mb-4">
      <FontAwesomeIcon icon="download" />
      Download
    </BlockButton>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getComputedMeta } from "@/lib/meta.js";
import { computed, reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import BlockButton from "@/components/BlockButton.vue";
import { toPng } from "html-to-image";
import { useMeta } from "vue-meta";

import { getCoursesPublic, getUserPublic } from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";

export default {
  components: {
    FontAwesomeIcon,
    BlockButton,
  },
  setup() {
    const state = reactive({
      user: {},
      course: {},
    });

    const computedDate = computed(() => {
      if (!state.course || !state.course.CompletedAt) {
        return null;
      }
      const today = new Date(state.course.CompletedAt);
      return today.toDateString();
    });

    onMounted(async () => {
      const route = useRoute();
      try {
        state.user = await getUserPublic(route.params.userHandle);
        const courses = await getCoursesPublic(route.params.userHandle);
        state.course = courses.find(
          (course) => course.UUID === route.params.courseUUID
        );
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    });

    const download = async () => {
      var node = document.getElementById("cert");
      const dataUrl = await toPng(node);

      function downloadURI(uri, name) {
        const link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      downloadURI(dataUrl, "bootdev_certificate.png");
    };

    const computedMeta = computed(() => {
      return getComputedMeta({
        title: `${state.user.FirstName}'s Certificate of Completion`,
        description: `Check out ${state.user.FirstName} ${state.user.LastName}'s coding accomplishments on Boot.dev`,
        featuredImageURL: state.user.ProfileImageURL,
      });
    });
    useMeta(computedMeta);

    return {
      ...toRefs(state),
      computedDate,
      download,
    };
  },
};
</script>

<style scoped>
.cert {
  width: 1080px;
}
</style>
