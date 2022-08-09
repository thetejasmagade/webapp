<template>
  <div class="h-screen text-gray-200 bg-gray-700">
    <metainfo>
      <template #title="{ content }">
        {{ content ? `${content} | Boot.dev` : `Boot.dev` }}
      </template>
    </metainfo>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
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
  faPencil,
  faTrash,
  faX,
  faExclamationTriangle,
  faBook,
  faTools,
  faHand,
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

library.add(faArrowRight);
library.add(faX);
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
library.add(faPencil);
library.add(faTrash);
library.add(faExclamationTriangle);
library.add(faBook);
library.add(faTools);
library.add(faHand);

export default {
  setup() {
    const computedMeta = getComputedMeta({
      title: "Coding Courses",
      description:
        "Learning computer science can be complicated. We make it simple. Unlock free content, courses, certificates and achievements as you learn.",
      featuredImageURL: "/src/img/the_modern_cs_bootcamp-boot.png",
    });
    useMeta(computedMeta);
  },
  created() {
    loadLoggedIn(this.$store.commit);
  },
};
</script>

<style>
@import "styles/index.css";

:root {
  --red-500: #ed4245;
  --red-700: #cd1316;

  --yellow-600: #fee034;
  --yellow-800: #dfbe01;

  --blue-300: #b4baf8;
  --blue-400: #8d96f6;

  --green-600: #41f179;
  --green-700: #1bee5e;
  --green-800: #10d14d;

  --pink-700: #cb1576;
  --pink-800: #a61161;

  --gray-200: #e5e5e5;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;

  --top-nav-bar-height: 60px;
}

body {
  font-family: Helvetica Neue, Helvetica, sans-serif;
  margin: 0;
  height: 100%;
}

.h-full-minus-bar {
  height: calc(100vh - var(--top-nav-bar-height) - 1px);
}
.top-nav-bar-height {
  height: var(--top-nav-bar-height);
}
</style>
