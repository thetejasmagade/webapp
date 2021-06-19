<template>
  <Modal
    ref="feedbackModal"
  >
    <div>
      <h1 class="text-2xl text-gold-600 mb-4">
        What do you think of this exercise?
      </h1>
      <StarRating
        v-model="stars"
        class="mb-4"
      />
      <textarea
        v-model="commentText"
        placeholder="Let us know how to improve this page"
        class="
          autoexpand
          tracking-wide
          py-2 px-4 mb-4
          leading-relaxed
          appearance-none
          block w-full 
        bg-gray-200
          border rounded focus:outline-none border-gray-300
        "
        rows="4"
      />
      <BlockButton
        :click="() => {btnClick()}"
        color="purple"
      >
        Submit
      </BlockButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import BlockButton from '@/components/BlockButton.vue';
import StarRating from '@/components/StarRating.vue';

import { notify } from '@/lib/notification.js';

import {
  upsertExerciseFeedback
} from '@/lib/cloudClient.js';

export default {
  components:{
    Modal,
    BlockButton,
    StarRating
  },
  props: {
    exerciseUUID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      commentText: null,
      rating: null,
      stars: 3
    };
  },
  methods:{
    show(){
      this.$refs.feedbackModal.show();
    },
    hide(){
      this.$refs.feedbackModal.hide();
    },
    async btnClick(){
      const ratingZeroToHundred = ((this.stars / 5) * 100) - 1;
      try {
        await upsertExerciseFeedback(
          this.exerciseUUID,
          this.commentText,
          ratingZeroToHundred
        );
        notify({
          type: 'success',
          text: 'Thanks for your feedback!'
        });

        this.commentText = null;
        this.rating = null;
        this.stars = 3;

        this.hide();
      } catch (err) {
        notify({
          type: 'danger',
          text: err
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
