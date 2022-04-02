<template>
  <Modal ref="feedbackModal">
    <div>
      <h1 class="text-2xl mb-4">What do you think of this exercise?</h1>
      <textarea
        v-model="commentText"
        placeholder="Let us know how to improve this page"
        class="autoexpand tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-800 rounded focus:outline-none"
        rows="4"
      />
      <BlockButton
        :click="
          () => {
            btnClick();
          }
        "
        class="mb-4"
      >
        Submit
      </BlockButton>

      <p>
        If you'd rather speak to the authors and other students directly join
        our
        <a href="https://discord.gg/EEkFwbv" target="_blank"
          >Discord community instead.</a
        >
      </p>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import BlockButton from "@/components/BlockButton.vue";

import { notify } from "@/lib/notification.js";

import {
  upsertExerciseFeedback,
  upsertStepFeedback,
} from "@/lib/cloudClient.js";

export default {
  components: {
    Modal,
    BlockButton,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    unitType: {
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
    show() {
      this.$refs.feedbackModal.show();
    },
    hide() {
      this.$refs.feedbackModal.hide();
    },
    async btnClick() {
      try {
        if (this.unitType === "exercise") {
          await upsertExerciseFeedback(this.uuid, this.commentText);
        } else {
          await upsertStepFeedback(this.uuid, this.commentText);
        }
        notify({
          type: "success",
          text: "Thanks for your feedback!",
        });

        this.commentText = null;
        this.rating = null;
        this.stars = 3;

        this.hide();
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
