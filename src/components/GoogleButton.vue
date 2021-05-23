<template>
  <div
    id="button"
    @click="onClick"
  >
    <FontAwesomeIcon
      :icon="['fab', 'google']"
      class="icon"
    />
    <span>Sign in with Google</span>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { notify } from '@/lib/notification.js';

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    onSuccess: {
      type: Function,
      required: true
    }
  },
  methods: {
    onClick(){
      try {
        this.$gAuth.signIn(this.onSuccess, this.onFailure);
      } catch (err){
        notify({
          type: 'danger',
          text: err
        });
      }
    },
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
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  white-space: nowrap;
  outline: none;
  padding: 0 18px 0 0;

  .icon {
    font-size: 32px;
    color: #DB4437;
    margin: 10px 20px 10px 20px;
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
