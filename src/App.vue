<template>
  <div class="h-screen text-gray-700 bg-gray-200">
    <metainfo>
      <template #title="{ content }">
        {{ content ? `${content} | Qvault` : `Qvault` }}
      </template>
    </metainfo>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRight,
  faArrowLeft,
  faUserTie,
  faSignOutAlt,
  faPlay,
  faCheck,
  faTimes,
  faUndo,
  faBars,
  faCog,
  faTrophy,
  faCamera,
  faMapMarkerAlt,
  faLink,
  faSave,
  faBackward,
  faSignal,
  faTags,
  faSchool,
  faHourglass,
  faSearch,
  faStar,
  faGraduationCap,
  faLock,
  faLevelUpAlt,
  faEye,
  faComment,
  faUpload,
  faRibbon,
  faDownload,
  faPuzzlePiece,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

import {
  faTwitter,
  faGoogle,
  faGithub,
  faLinkedin,
  faPython,
  faGolang,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";

import { loadLoggedIn } from "@/lib/cloudStore.js";
import { useMeta } from "vue-meta";

library.add(faArrowRight);
library.add(faArrowLeft);
library.add(faUserTie);
library.add(faSignOutAlt);
library.add(faPlay);
library.add(faCheck);
library.add(faTimes);
library.add(faUndo);
library.add(faBars);
library.add(faCog);
library.add(faTrophy);
library.add(faCamera);
library.add(faTwitter);
library.add(faGoogle);
library.add(faMapMarkerAlt);
library.add(faGithub);
library.add(faLink);
library.add(faLinkedin);
library.add(faSave);
library.add(faBackward);
library.add(faSignal);
library.add(faTags);
library.add(faSchool);
library.add(faHourglass);
library.add(faSearch);
library.add(faStar);
library.add(faGraduationCap);
library.add(faLock);
library.add(faLevelUpAlt);
library.add(faEye);
library.add(faComment);
library.add(faUpload);
library.add(faRibbon);
library.add(faDownload);
library.add(faPuzzlePiece);
library.add(faServer);
library.add(faPython);
library.add(faGolang);
library.add(faDiscord);

export default {
  setup() {
    const description =
      "Learning computer science can be complicated. We make it simple. Unlock free content, courses, certificates and achievements as you learn.";
    useMeta({
      title: "Coding Courses",
      description,
      meta: [
        { vmid: "description", name: "description", content: description },

        { vmid: "og:title", property: "og:title", content: "Qvault" },
        {
          vmid: "og:description",
          property: "og:description",
          content: description,
        },
        {
          vmid: "og:image",
          property: "og:image",
          content:
            "https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner.jpg",
        },
        { vmid: "og:locale", property: "og:locale", content: "en_US" },
        { vmid: "og:type", property: "og:type", content: "website" },

        {
          vmid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        },
        { vmid: "twitter:site", name: "twitter:site", content: "@q_vault" },
        {
          vmid: "twitter:creator",
          name: "twitter:creator",
          content: "@q_vault",
        },
        { vmid: "twitter:title", name: "twitter:title", content: "Qvault" },
        {
          vmid: "twitter:description",
          property: "twitter:description",
          content: description,
        },
        {
          vmid: "twitter:image",
          name: "twitter:image",
          content:
            "https://qvault.io/wp-content/uploads/2021/04/qvault-social-banner.jpg",
        },
      ],
    });
  },
  created() {
    loadLoggedIn(this);
  },
};
</script>

<style>
@import "styles/index.css";

:root {
  --red-500: #c05460;

  --gold-600: #9e713a;
  --gold-800: #48331b;

  --gray-750: #292929;

  --top-nav-bar-height: 60px;
}

body {
  font-family: Apercu, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  margin: 0;
  height: 100%;
  color: var(--gray-750);
}

.h-full-minus-bar {
  height: calc(100vh - var(--top-nav-bar-height));
}
</style>
