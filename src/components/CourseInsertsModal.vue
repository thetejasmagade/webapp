<template>
  <Modal ref="courseInsertsModal" :on-close="onClose">
    <div v-if="courseInserts.length > 0">
      <InsertTypeAchievement
        v-if="courseInserts[0].type === 'achievement'"
        :achievement-earned="courseInserts[0].data"
        :on-done="onSeenInsert"
      />
      <InsertTypeDiscordSync
        v-else-if="courseInserts[0].type === 'discord'"
        :on-done="onSeenInsert"
      />
    </div>
  </Modal>
</template>

<script>
import InsertTypeAchievement from "@/components/inserts/InsertTypeAchievement.vue";
import InsertTypeDiscordSync from "@/components/inserts/InsertTypeDiscordSync.vue";
import Modal from "@/components/Modal.vue";

import { notify } from "@/lib/notification.js";

import { onMounted, toRefs, ref, reactive } from "vue";

import { getPendingAchievements } from "@/lib/cloudClient.js";

export default {
  components: {
    Modal,
    InsertTypeAchievement,
    InsertTypeDiscordSync,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { user } = toRefs(props);
    const state = reactive({
      courseInserts: [],
    });

    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * max + min);
    };

    onMounted(async () => {
      if (user.value.DiscordUserID === null && getRandomInt(0, 10) === 0) {
        state.courseInserts.push({
          type: "discord",
        });
      }

      try {
        let pendingAchievements = await getPendingAchievements();
        for (const pendingAchievement of pendingAchievements) {
          state.courseInserts.push({
            type: "achievement",
            data: pendingAchievement,
          });
        }
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    });

    const onSeenInsert = () => {
      state.courseInserts.shift();
      console.log(state.courseInserts.length);
      if (state.courseInserts.length === 0) {
        hide();
      }
    };

    const courseInsertsModal = ref(null);
    const show = () => {
      if (state.courseInserts.length === 0) {
        return;
      }
      courseInsertsModal.value?.show();
    };
    const hide = () => {
      courseInsertsModal.value?.hide();
    };
    const onClose = () => {
      state.courseInserts = [];
    };

    return {
      ...toRefs(state),
      onSeenInsert,
      show,
      hide,
      courseInsertsModal,
      onClose,
    };
  },
};
</script>

<style scoped></style>
