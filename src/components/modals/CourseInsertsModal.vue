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
import Modal from "@/components/modals/Modal.vue";

import { notify } from "@/lib/notification.js";

import { onMounted, toRefs, ref, reactive } from "vue";

import { getPendingAchievements } from "@/lib/cloudClient.js";

import { hasSeenDiscordSyncInsert } from "@/lib/localStorageLib";

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
    exerciseIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { user, exerciseIndex } = toRefs(props);
    const state = reactive({
      courseInserts: [],
    });

    const showDiscordSyncIfNecessary = () => {
      if (user.value.DiscordUserID !== null) {
        return;
      }
      if (hasSeenDiscordSyncInsert()) {
        return;
      }
      if (exerciseIndex.value !== 5) {
        return;
      }
      state.courseInserts.push({
        type: "discord",
      });
    };

    onMounted(async () => {
      showDiscordSyncIfNecessary();

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
