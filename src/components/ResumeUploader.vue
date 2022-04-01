<template>
  <div class="relative">
    <form enctype="multipart/form-data" class="flex flex-row">
      <input
        id="resume"
        type="file"
        accept="application/pdf"
        class="opacity-0 overflow-hidden absolute z-0 h-px w-px"
        @change="editResume"
      />
      <label
        for="resume"
        class="cursor-pointer border-none text-xl flex text-blue-500 items-center justify-center focus:outline-none"
      >
        <FontAwesomeIcon icon="upload" />
      </label>
      <span class="ml-3"> Upload Resume (.pdf) </span>
      <a
        v-if="currentResume"
        class="ml-3"
        :href="currentResume"
        target="_blank"
      >
        {{ currentUserFirstName }}.pdf
      </a>
    </form>
  </div>
</template>

<script>
import { updateUserResume } from "@/lib/cloudClient.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { sleep } from "@/lib/sleep.js";
import { notify } from "@/lib/notification.js";

import { loadUser } from "@/lib/cloudStore.js";

export default {
  components: {
    FontAwesomeIcon,
  },
  computed: {
    currentResume() {
      if (!this.$store.getters.getUser) {
        return null;
      }
      return this.$store.getters.getUser.ResumeURL;
    },
    currentUserFirstName() {
      if (!this.$store.getters.getUser) {
        return null;
      }
      return this.$store.getters.getUser.FirstName;
    },
  },
  async mounted() {
    if (!this.$store.getters.getUser) {
      loadUser(this.$store.commit);
    }
  },
  methods: {
    async editResume(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const formData = new FormData();
      formData.append("resume", files[0]);
      try {
        await updateUserResume(formData);

        // let the upload REALLY complete - kinda janky
        await sleep(1000);

        // cache break to reload pdf
        const user = this.$store.getters.getUser;
        user.ResumeURL += "?" + Date.now();
        this.$store.commit("setUser", user);

        notify({
          type: "success",
          text: "ResumeURL updated successfully",
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
