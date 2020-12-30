<template>
  <div class="profile-img">
    <div class="img-box">
      <img
        :src="profileImageURLWithDefault"
        alt="user avatar"
      >
    </div>
    <form
      v-if="editable"
      enctype="multipart/form-data"
    >
      <input
        id="profileImage"
        type="file"
        accept="image/*"
        @change="editProfileImage"
      >
      <label
        for="profileImage"
        class="updateIcon"
      >
        <FontAwesomeIcon
          icon="camera"
        />
      </label>
    </form>
  </div>
</template>

<script>
import { 
  updateUserProfileImage
} from '@/lib/cloudClient.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { 
  sleep
} from '@/lib/sleep.js';

export default {
  components: {
    FontAwesomeIcon
  },
  props: { 
    click:{
      type: Function,
      required: false,
      default: () =>{}
    },
    profileImageURL:{
      type: String,
      required: false,
      default: null
    },
    editable:{
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    profileImageURLWithDefault(){
      if (this.profileImageURL){
        return this.profileImageURL;
      }
      return 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png';
    }
  },
  methods: {
    async editProfileImage(e){
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length){
        return;
      }
      const formData = new FormData();
      formData.append('profileImage', files[0]);
      try {
        await updateUserProfileImage(formData);

        // let the upload REALLY complete - kinda janky
        await sleep(1000);

        // cache break to reload image
        const user = this.$store.getters.getUser;
        user.ProfileImageURL += '?' + Date.now();
        this.$store.commit('setUser', user);
        
        this.$notify({
          type: 'success',
          text: 'Profile image updated successfully'
        });
      } catch (err){
        this.$notify({
          type: 'error',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.profile-img {
  position: relative;

  .img-box {
    position: relative;

    &::after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }

    img {
      border-radius: 50%;
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  form {
    input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  }

  .updateIcon {
    position: absolute;
    left: 75%;
    bottom: 8%;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    cursor: pointer;
    border: 0;
    box-shadow: 0 0 9px 1px $gray-light;
    background-color: $gray-lightest;
    font-size: 18px;
    color: $gray-darkest;
    display: flex;
    align-items: center;
    justify-content: center;

    &:focus {
      outline: 0;
    }
  }
}

</style>
