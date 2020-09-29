<template>
  <GoogleLogin
    id="button"
    :params="googleButtonParams"
    :on-success="onSuccess"
    :on-failure="onFailure"
  >
    <FontAwesomeIcon
      :icon="['fab', 'google']"
      class="icon"
    />
    <span>Sign in with Google</span>
  </GoogleLogin>
</template>

<script>
import { GoogleLogin } from 'vue-google-login';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    GoogleLogin,
    FontAwesomeIcon
  },
  props: {
    onSuccess: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      googleButtonParams: {
        client_id: '44792168937-cm11c7cfa2co3pov1rt7p8r4keiee9cl.apps.googleusercontent.com'
      }
    };
  },
  methods:{
    onFailure(){
      // do nothing
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
  border-radius: 30px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  white-space: nowrap;
  outline: none;
  padding: 10px 20px 10px 20px;

  .icon {
    font-size: 32px;
    color: #DB4437;
  }

  span {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.8);
  }
}
</style>
