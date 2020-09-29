<template>
  <div id="app">
    <notifications
      :duration="3000"
      classes="custom-notification"
    />
    <router-view />
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowRight,
  faArrowLeft,
  faUserTie,
  faScroll,
  faSignOutAlt,
  faPlay,
  faCheck,
  faStore,
  faTimes,
  faUndo,
  faBars,
  faTrophy,
  faCamera,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

import {
  faDiscord,
  faTwitter,
  faGoogle
} from '@fortawesome/free-brands-svg-icons';

library.add(faArrowRight);
library.add(faArrowLeft);
library.add(faUserTie);
library.add(faScroll);
library.add(faSignOutAlt);
library.add(faPlay);
library.add(faCheck);
library.add(faStore);
library.add(faTimes);
library.add(faUndo);
library.add(faBars);
library.add(faTrophy);
library.add(faCamera);
library.add(faDiscord);
library.add(faTwitter);
library.add(faGoogle);
library.add(faMapMarkerAlt);

export default {
  metaInfo() {
    return {
      meta: [
        { vmid:'description', name: 'description', content: 'Learn to program. Move at your own pace. Earn content by doing well. Get started for free!' },

        { vmid:'og:title', property: 'og:title', content: 'Qvault' },
        { vmid:'og:description', property: 'og:description', content: 'Learn to program. Move at your own pace. Earn content by doing well. Get started for free!' },
        { vmid:'og:image', property: 'og:image', content: 'https://qvault.io/wp-content/uploads/2020/09/Site-Social-Image-1024x576.png' },
        { vmid:'og:locale', property: 'og:locale', content: 'en_US' },
        { vmid:'og:type', property: 'og:type', content: 'website' },

        { vmid:'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { vmid:'twitter:site', name: 'twitter:site', content: '@q_vault' },
        { vmid:'twitter:creator', name: 'twitter:creator', content: '@q_vault' },
        { vmid:'twitter:title', name: 'twitter:title', content: 'Qvault' },
        { vmid:'twitter:description', property: 'twitter:description', content: 'Learn to program. Move at your own pace. Earn content by doing well. Get started for free!' },
        { vmid:'twitter:image', name: 'twitter:image', content: 'https://qvault.io/wp-content/uploads/2020/09/Site-Social-Image-1024x576.png' }
      ]
    };
  }
};
</script>

<style lang="scss">
@import 'styles/styles.scss';
@import 'styles/colors.scss';

#app {
  height: 100%;
}

.vue-notification-group {
  margin: 60px 10px 0 0;
}

.custom-notification {
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;

  font-size: 1em;

  color: $white;
  background: $purple-mid !important;
  border-right: 5px solid $gray-darker;

  &.warn {
    background: $gold-mid !important;
  }

  &.error {
    background: $pink-mid !important;
  }

  &.success {
    background: $green-dark !important;
  }
}
</style>
