<template>
  <Modal
    ref="courseDoneModal"
  >
    <div>
      <h1 class="text-2xl text-gold-600 mb-4">
        Congragulations! You've completed the course
      </h1>
      <p class="text-gray-600 mb-4">
        Check out the new certificate on your portfolio then start your next
        course
      </p>
      <img
        src="https://qvault.io/wp-content/uploads/2020/08/gatsby_toast.gif"
      >
      <div class="flex justify-center">
        <BlockButton
          class="m-4"
          :click="clickNextCourse"
        >
          Next Course
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
import Modal from '@/components/Modal.vue';
import BlockButton from '@/components/BlockButton.vue';
import { loadTracks } from '@/lib/cloudStore.js';

export default {
  components:{
    Modal,
    BlockButton
  },
  props: {
    goToBeginningCallback: {
      type: Function,
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
    async clickNextCourse() {
      await loadTracks(this);
      this.$router.push({ name: 'Courses' });
    },
    async goToBeginning() {
      await this.goToBeginningCallback();
      this.hide();
    },
    show(){
      this.$refs.courseDoneModal.show();
    },
    hide(){
      this.$refs.courseDoneModal.hide();
    }
  }
};
</script>

<style scoped>

</style>
