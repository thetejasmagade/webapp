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
  faCog,
  faTrophy,
  faCamera,
  faMapMarkerAlt,
  faLink,
  faSave,
  faBackward
} from '@fortawesome/free-solid-svg-icons';

import {
  faDiscord,
  faTwitter,
  faGoogle,
  faGithub,
  faLinkedin
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
library.add(faCog);
library.add(faTrophy);
library.add(faCamera);
library.add(faDiscord);
library.add(faTwitter);
library.add(faGoogle);
library.add(faMapMarkerAlt);
library.add(faGithub);
library.add(faLink);
library.add(faLinkedin);
library.add(faSave);
library.add(faBackward);

export default {
  metaInfo() {
    const description = 'Learning computer science can be complicated. We make it simple. Unlock free content, courses, certificates and achievements as you learn.';
    return {
      meta: [
        { vmid:'description', name: 'description', content: description },

        { vmid:'og:title', property: 'og:title', content: 'Qvault' },
        { vmid:'og:description', property: 'og:description', content: description },
        { vmid:'og:image', property: 'og:image', content: 'https://qvault.io/wp-content/uploads/2020/09/Site-Social-Image-1024x576.png' },
        { vmid:'og:locale', property: 'og:locale', content: 'en_US' },
        { vmid:'og:type', property: 'og:type', content: 'website' },

        { vmid:'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { vmid:'twitter:site', name: 'twitter:site', content: '@q_vault' },
        { vmid:'twitter:creator', name: 'twitter:creator', content: '@q_vault' },
        { vmid:'twitter:title', name: 'twitter:title', content: 'Qvault' },
        { vmid:'twitter:description', property: 'twitter:description', content: description },
        { vmid:'twitter:image', name: 'twitter:image', content: 'https://qvault.io/wp-content/uploads/2020/09/Site-Social-Image-1024x576.png' }
      ]
    };
  }
};
</script>

<style lang="scss">
@import 'styles/styles.scss';
@import 'styles/colors.scss';
@import 'styles/backgrounds.scss';

#app {
  height: 100%;
  background-image: $gray-lines;
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
