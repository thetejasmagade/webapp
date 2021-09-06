<template>
  <div class="page h-full">
    <BlockButton
      :click="download"
      color="gold"
      class="absolute top-4 left-4"
    >
      <FontAwesomeIcon
        icon="download"
      />
      Download
    </BlockButton>
    <div class="page h-full flex items-center justify-center">
      <div
        class="cert flex justify-center p-8"
      >
        <div
          id="cert"
          class="flex justify-center p-4 w-11/12 bg-gray-200 border-gold-500 border-2"
        >
          <div class="inner-content border-gold-500 border-2 p-4 w-full text-center">
            <h1 class="text-6xl mt-4 text-gold-600 font-light">
              CERTIFICATE OF COMPLETION
            </h1>
            <p class="text-lg border-gold-500 border-b-2 pb-2 text-gray-800 font-thin">
              FROM QVAULT.IO IN THE AREA OF COMPUTER SCIENCE
            </p>
            <div class="border-gold-500 border-b-2 pb-2 mb-8" />
            <p class="text-xl mb-2 font-light">
              This Certificate Is Proudly Presented To
            </p>
            <p class="text-6xl mb-8 text-blue-700 font-bold">
              {{ user.FirstName }} {{ user.LastName }}
            </p>
            <p class="text-xl mb-2 font-light">
              Who Has Completed
            </p>
            <p class="text-4xl mb-8 font-bold text-gray-600">
              Qvault's {{ course.Title }} Course
            </p>
            <p class="text-2xl font-light">
              On {{ computedDate }}
            </p>
            <div class="flex justify-around p-8">
              <img
                alt="Qvault logo"
                src="../img/qvault-icon-250.png"
                class="align-middle w-24 h-24 ml-2"
              >
              <FontAwesomeIcon
                icon="ribbon"
                class="text-gold-500 text-8xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useMeta } from 'vue-meta';
import { computed, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BlockButton from '@/components/BlockButton.vue';
import { toPng } from 'html-to-image';

import {
  getCoursesPublic,
  getUserPublic
} from '@/lib/cloudClient.js';
import { notify } from '@/lib/notification.js';

export default {
  components: {
    FontAwesomeIcon,
    BlockButton
  },
  setup(){
    const state = reactive({
      user: {},
      course: {}
    });

    const computedMeta = computed(() => {
      const title = `${state.user.FirstName}'s Certificate of Completion`;
      const description = `Check out ${state.user.FirstName} ${state.user.LastName}'s coding accomplishments on Qvault`;
      return {
        title,
        meta: [
          { vmid:'description', name: 'description', content: description},

          { vmid:'og:title', property: 'og:title', content: title},
          { vmid:'og:description', property: 'og:description', content: description},
          { vmid:'og:image', property: 'og:image', content: state.user.ProfileImageURL },

          { vmid:'twitter:title', name: 'twitter:title', content: title },
          { vmid:'twitter:description', property: 'twitter:description', content: description },
          { vmid:'twitter:image', name: 'twitter:image', content: state.user.ProfileImageURL }
        ]
      };
    });

    state.computedDate = computed(() => {
      if (!state.course || !state.course.CompletedAt){
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
        state.course = courses.find(course => course.UUID === route.params.courseUUID);
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    });

    state.download = async () => {
      var node = document.getElementById('cert');
      const dataUrl = await toPng(node);

      function downloadURI(uri, name) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      downloadURI(dataUrl, 'qvault_certificate.png');
    };

    useMeta(computedMeta);
    return state;
  }
};
</script>

<style scoped>
.page {
  background-image: linear-gradient(67.5deg, rgb(6, 6, 6) 0%, rgb(6, 6, 6) 6%,rgb(29, 29, 29) 6%, rgb(29, 29, 29) 57%,rgb(52, 52, 52) 57%, rgb(52, 52, 52) 58%,rgb(75, 75, 75) 58%, rgb(75, 75, 75) 79%,rgb(97, 97, 97) 79%, rgb(97, 97, 97) 93%,rgb(120, 120, 120) 93%, rgb(120, 120, 120) 95%,rgb(143, 143, 143) 95%, rgb(143, 143, 143) 100%),linear-gradient(90deg, rgb(6, 6, 6) 0%, rgb(6, 6, 6) 6%,rgb(29, 29, 29) 6%, rgb(29, 29, 29) 57%,rgb(52, 52, 52) 57%, rgb(52, 52, 52) 58%,rgb(75, 75, 75) 58%, rgb(75, 75, 75) 79%,rgb(97, 97, 97) 79%, rgb(97, 97, 97) 93%,rgb(120, 120, 120) 93%, rgb(120, 120, 120) 95%,rgb(143, 143, 143) 95%, rgb(143, 143, 143) 100%),linear-gradient(135deg, rgb(6, 6, 6) 0%, rgb(6, 6, 6) 6%,rgb(29, 29, 29) 6%, rgb(29, 29, 29) 57%,rgb(52, 52, 52) 57%, rgb(52, 52, 52) 58%,rgb(75, 75, 75) 58%, rgb(75, 75, 75) 79%,rgb(97, 97, 97) 79%, rgb(97, 97, 97) 93%,rgb(120, 120, 120) 93%, rgb(120, 120, 120) 95%,rgb(143, 143, 143) 95%, rgb(143, 143, 143) 100%),linear-gradient(0deg, rgb(6, 6, 6) 0%, rgb(6, 6, 6) 6%,rgb(29, 29, 29) 6%, rgb(29, 29, 29) 57%,rgb(52, 52, 52) 57%, rgb(52, 52, 52) 58%,rgb(75, 75, 75) 58%, rgb(75, 75, 75) 79%,rgb(97, 97, 97) 79%, rgb(97, 97, 97) 93%,rgb(120, 120, 120) 93%, rgb(120, 120, 120) 95%,rgb(143, 143, 143) 95%, rgb(143, 143, 143) 100%),linear-gradient(90deg, rgb(8, 8, 8),rgb(221, 221, 221)); background-blend-mode:overlay,overlay,overlay,overlay,normal;
}

.cert {
  width: 1080px;
}
</style>
