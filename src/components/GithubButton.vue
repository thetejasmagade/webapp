<template>
  <div
    id="button"
    @click="click"
  >
    <FontAwesomeIcon
      :icon="['fab', 'github']"
      class="icon"
    />
    <span>Sign in with Github</span>
  </div>
</template>

<script>
import {
  getLoginWithGithubURL
} from '@/lib/cloudClient.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    isSubscribedNews: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    click() {
      window.location.replace(getLoginWithGithubURL(this.isSubscribedNews));
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

#button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 220px;
  background: $white;
  color: $gray-mid;
  border: 0;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  white-space: nowrap;
  outline: none;

  .icon {
    font-size: 32px;
    color: #000;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  span {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    margin-right: 20px
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.8);
  }
}
</style>
