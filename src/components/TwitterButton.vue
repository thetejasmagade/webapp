<template>
  <div
    id="button"
    @click="click"
  >
    <FontAwesomeIcon
      :icon="['fab', 'twitter']"
      class="icon"
    />
    <span>Sign in with Twitter</span>
  </div>
</template>

<script>
import {
  getLoginWithTwitterURL
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
      window.location.replace(getLoginWithTwitterURL(this.isSubscribedNews, this.$route.query.ruid));
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
    color: #00acee;
    margin: 10px 20px 10px 20px;
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
