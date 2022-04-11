<template>
  <div>
    <form v-if="editable" enctype="multipart/form-data">
      <input
        id="profileImage"
        type="file"
        accept="image/*"
        class="opacity-0 overflow-hidden absolute z-0 h-px w-px"
        @change="editProfileImage"
      />
      <label for="profileImage">
        <img
          loading="lazy"
          :src="profileImageURLWithDefault"
          alt="user avatar"
          class="rounded w-full h-full cover hover:opacity-75"
          :class="{ 'cursor-pointer': editable }"
        />
      </label>
    </form>
    <img
      v-else
      loading="lazy"
      :src="profileImageURLWithDefault"
      alt="user avatar"
      class="rounded w-full h-full cover"
      :class="{ 'cursor-pointer': editable }"
    />
  </div>
</template>

<script>
import { updateUserProfileImage } from "@/lib/cloudClient.js";

import { sleep } from "@/lib/sleep.js";
import { notify } from "@/lib/notification.js";

export default {
  props: {
    profileImageURL: {
      type: String,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    profileImageURLWithDefault() {
      if (this.profileImageURL) {
        return this.profileImageURL;
      }
      return "https://orbitermag.com/wp-content/uploads/2017/03/default-user-image-300x300.png";
    },
  },
  methods: {
    async editProfileImage(e) {
      if (!this.editable) {
        return;
      }

      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const formData = new FormData();
      formData.append("profileImage", files[0]);
      try {
        await updateUserProfileImage(formData);

        // let the upload REALLY complete - kinda janky
        await sleep(1000);

        // cache break to reload image
        const user = this.$store.getters.getUser;
        user.ProfileImageURL += "?" + Date.now();
        this.$store.commit("setUser", user);

        notify({
          type: "success",
          text: "Profile image updated successfully",
        });
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
  },
};
</script>

<style scoped></style>
