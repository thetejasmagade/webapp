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
      <label for="profileImage" class="square-container">
        <img
          loading="lazy"
          :src="profileImageURLWithDefault"
          alt="user avatar"
          class="rounded absolute w-full h-full object-cover hover:opacity-75"
          :class="{ 'cursor-pointer': editable }"
        />
      </label>
    </form>
    <div v-else class="square-container">
      <img
        loading="lazy"
        :src="profileImageURLWithDefault"
        alt="user avatar"
        class="rounded absolute w-full h-full object-cover"
        :class="{ 'cursor-pointer': editable }"
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfileImage } from "@/lib/cloudClient.js";

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
        const newUser = await updateUserProfileImage(formData);
        this.$store.commit("setUser", newUser);
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

<style scoped>
.square-container {
  position: relative;
}

.square-container::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
</style>
