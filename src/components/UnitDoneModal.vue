<template>
  <Modal ref="unitDoneModal">
    <div>
      <h1 v-if="type === 'course'" class="text-2xl text-gold-600 mb-4">
        Congragulations! You've completed the course
      </h1>
      <h1 v-else class="text-2xl text-gold-600 mb-4">
        Congragulations! You've completed the Project!
      </h1>
      <p v-if="type === 'course'" class="text-gray-600 mb-4">
        Check out the new certificate on your portfolio then start your next
        course
      </p>
      <img
        loading="lazy"
        src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
      />
      <div class="flex justify-center">
        <BlockButton
          v-if="type === 'course'"
          class="m-4"
          :click="clickNextCourse"
        >
          Next Course
        </BlockButton>
        <BlockButton v-else class="m-4" :click="clickNextCourse">
          Dashboard
        </BlockButton>
        <BlockButton
          class="m-4"
          :click="
            () => {
              $router.push({
                name: 'Portfolio',
                params: { userHandle: $store.getters.getUser.Handle },
              });
            }
          "
          color="gray"
        >
          View Portfolio
        </BlockButton>
        <BlockButton
          v-if="goToBeginning"
          class="m-4"
          :click="goToBeginning"
          color="gray"
        >
          Restart
        </BlockButton>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import BlockButton from "@/components/BlockButton.vue";
import { loadTracks } from "@/lib/cloudStore.js";

import {
  markSeenUnitDoneModal,
  hasSeenUnitDoneModal,
} from "@/lib/localStorageLib";

export default {
  components: {
    Modal,
    BlockButton,
  },
  props: {
    goToBeginningCallback: {
      type: Function,
      required: false,
      default: null,
    },
    unitUUID: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      commentText: null,
      rating: null,
      stars: 3,
    };
  },
  methods: {
    async clickNextCourse() {
      await loadTracks(this);
      this.$router.push({ name: "Courses" });
    },
    async goToBeginning() {
      await this.goToBeginningCallback();
      this.hide();
    },
    show() {
      if (hasSeenUnitDoneModal(this.unitUUID)) {
        return;
      }
      markSeenUnitDoneModal(this.unitUUID);
      this.$refs.unitDoneModal.show();
    },
    hide() {
      this.$refs.unitDoneModal.hide();
    },
  },
};
</script>

<style scoped></style>
