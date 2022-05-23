<template>
  <Modal ref="insertsModal" :on-close="onClose">
    <div v-if="inserts.length > 0">
      <InsertTypeAchievement
        v-if="inserts[0].type === 'achievement'"
        :achievement-earned="inserts[0].data"
        :on-done="onSeenInsert"
      />
      <InsertTypeDiscordSync
        v-else-if="inserts[0].type === 'discord'"
        :on-done="onSeenInsert"
      />
      <InsertTypeInviteFriends
        v-else-if="inserts[0].type === 'friends'"
        :on-done="onSeenInsert"
      />
      <InsertTypeUnitDone
        v-else-if="inserts[0].type === 'unitDone'"
        :on-done="onSeenInsert"
        :unit="unit"
      />
      <InsertTypeSandboxMode
        v-else-if="inserts[0].type === 'sandbox'"
        :on-done="onSeenInsert"
        :unit="unit"
      />
    </div>
  </Modal>
</template>

<script>
import InsertTypeAchievement from "@/components/inserts/InsertTypeAchievement.vue";
import InsertTypeDiscordSync from "@/components/inserts/InsertTypeDiscordSync.vue";
import InsertTypeInviteFriends from "@/components/inserts/InsertTypeInviteFriends.vue";
import InsertTypeUnitDone from "@/components/inserts/InsertTypeUnitDone.vue";
import InsertTypeSandboxMode from "@/components/inserts/InsertTypeSandboxMode.vue";

import { createCourseUnit } from "@/lib/unit.js";

import Modal from "@/components/modals/Modal.vue";

import { notify } from "@/lib/notification.js";

import { onMounted, toRefs, ref, reactive, watchEffect } from "vue";

import { getPendingAchievements } from "@/lib/cloudClient.js";

import {
  seenDiscordSyncInsertKey,
  seenFriendsInsertKey,
  hasSeen,
  getSeenUnitDoneModalKey,
  seenSandboxModalLoginKey,
  seenSandboxModalPatronKey,
} from "@/lib/localStorageLib";
import { useStore } from "vuex";

export default {
  components: {
    Modal,
    InsertTypeAchievement,
    InsertTypeDiscordSync,
    InsertTypeInviteFriends,
    InsertTypeUnitDone,
    InsertTypeSandboxMode,
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
    courseDone: {
      type: Boolean,
      required: false,
      default: false,
    },
    isExerciseComplete: {
      type: Boolean,
      required: false,
      default: false,
    },
    course: {
      type: Object,
      required: true,
    },
    inSandboxMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const {
      user,
      exerciseIndex,
      courseDone,
      inSandboxMode,
      course,
      isExerciseComplete,
    } = toRefs(props);
    const state = reactive({
      inserts: [],
    });
    const store = useStore();

    const showDiscordSyncIfNecessary = () => {
      if (user.value.DiscordUserID) {
        return;
      }
      if (hasSeen(seenDiscordSyncInsertKey)) {
        return;
      }
      if (exerciseIndex.value !== 5) {
        return;
      }
      state.inserts.push({
        type: "discord",
      });
    };

    const showFriendsIfNecessary = () => {
      if (hasSeen(seenFriendsInsertKey)) {
        return;
      }
      if (exerciseIndex.value !== 8) {
        return;
      }
      state.inserts.push({
        type: "friends",
      });
    };

    const showAchievementsIfNecessary = async () => {
      try {
        let pendingAchievements = await getPendingAchievements();
        for (const pendingAchievement of pendingAchievements) {
          state.inserts.push({
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
    };

    const showUnitDoneIfNecessary = async (courseDoneValue, courseValue) => {
      if (!courseDoneValue) {
        return;
      }
      if (hasSeen(getSeenUnitDoneModalKey(courseValue.UUID))) {
        return;
      }
      if (state.inserts.find((insert) => insert.type === "unitDone")) {
        return;
      }
      state.inserts.push({
        type: "unitDone",
      });
    };

    const showSandboxIfNecessary = async () => {
      if (!inSandboxMode.value) {
        return;
      }
      if (store.getters.getIsLoggedIn && hasSeen(seenSandboxModalPatronKey)) {
        return;
      }
      if (!store.getters.getIsLoggedIn && hasSeen(seenSandboxModalLoginKey)) {
        return;
      }
      state.inserts.push({
        type: "sandbox",
      });
    };

    onMounted(() => {
      showDiscordSyncIfNecessary(user.value, exerciseIndex.value);
      showFriendsIfNecessary();
      showSandboxIfNecessary();
    });

    watchEffect(() => {
      if (isExerciseComplete.value) {
        showAchievementsIfNecessary();
      }
      showUnitDoneIfNecessary(courseDone.value, course.value);
    });

    const onSeenInsert = () => {
      state.inserts.shift();
      if (state.inserts.length === 0) {
        hide();
      }
    };

    const insertsModal = ref(null);
    const show = () => {
      if (state.inserts.length === 0) {
        return;
      }
      insertsModal.value?.show();
    };
    const hide = () => {
      insertsModal.value?.hide();
    };
    const onClose = () => {
      state.inserts = [];
    };

    return {
      ...toRefs(state),
      onSeenInsert,
      show,
      hide,
      insertsModal,
      onClose,
      unit: createCourseUnit(course.value),
    };
  },
};
</script>

<style scoped></style>
