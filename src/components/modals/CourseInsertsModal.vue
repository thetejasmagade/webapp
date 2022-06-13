<template>
  <Modal ref="insertsModal" :on-close="onClose">
    <div v-if="inserts.length > 0" :key="inserts.length">
      <InsertTypeAchievement
        v-if="inserts[0].type === 'achievement'"
        :achievement-earned="inserts[0].data"
        :on-done="onDone"
      />
      <InsertTypeDiscordSync
        v-else-if="inserts[0].type === 'discord'"
        :on-done="onDone"
      />
      <InsertTypeInviteFriends
        v-else-if="inserts[0].type === 'friends'"
        :on-done="onDone"
      />
      <InsertTypeSurvey
        v-else-if="inserts[0].type === 'survey'"
        :on-done="onDone"
      />
      <InsertTypeUnitDone
        v-else-if="inserts[0].type === 'unitDone'"
        :on-done="onDone"
        :unit="unit"
      />
      <InsertTypeSandboxMode
        v-else-if="inserts[0].type === 'sandbox'"
        :on-done="onDone"
        :unit="unit"
      />
      <InsertTypeInsight
        v-else-if="inserts[0].type === 'insights'"
        :on-done="onDone"
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
import InsertTypeInsight from "@/components/inserts/InsertTypeInsight.vue";
import InsertTypeSurvey from "@/components/inserts/InsertTypeSurvey.vue";

import { createCourseUnit } from "@/lib/unit.js";

import Modal from "@/components/modals/Modal.vue";

import { notify } from "@/lib/notification.js";

import { onMounted, toRefs, ref, reactive, watchEffect } from "vue";

import { getPendingAchievements } from "@/lib/cloudClient.js";

import { loadUser } from "@/lib/cloudStore.js";

import {
  seenDiscordSyncInsertKey,
  seenFriendsInsertKey,
  seenInsightInsertKey,
  hasSeen,
  getSeenUnitDoneModalKey,
  seenSandboxModalLoginKey,
  seenSandboxModalPatronKey,
  seenSurveyInsertKey,
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
    InsertTypeInsight,
    InsertTypeSurvey,
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
    moduleIndex: {
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
      moduleIndex,
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
      if (moduleIndex.value !== 2 || exerciseIndex.value !== 5) {
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
      if (moduleIndex.value !== 1 || exerciseIndex.value !== 8) {
        return;
      }
      state.inserts.push({
        type: "friends",
      });
    };

    const showSurveyIfNecessary = () => {
      if (hasSeen(seenSurveyInsertKey)) {
        return;
      }
      if (moduleIndex.value !== 3 || exerciseIndex.value !== 5) {
        return;
      }
      state.inserts.push({
        type: "survey",
      });
    };

    const showInsightIfNecessary = () => {
      if (hasSeen(seenInsightInsertKey)) {
        return;
      }
      if (moduleIndex.value !== 0 || exerciseIndex.value !== 5) {
        return;
      }
      state.inserts.push({
        type: "insights",
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
      showInsightIfNecessary();
      showFriendsIfNecessary();
      showSandboxIfNecessary();
      showSurveyIfNecessary();
      if (inSandboxMode) {
        show();
      }
    });

    watchEffect(async () => {
      showUnitDoneIfNecessary(courseDone.value, course.value);
      if (isExerciseComplete.value) {
        await showAchievementsIfNecessary();
        show();
      }
    });

    const onDone = () => {
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
    const onClose = async () => {
      state.inserts = [];
      await loadUser(store.commit);
    };

    return {
      ...toRefs(state),
      onDone,
      hide,
      insertsModal,
      onClose,
      unit: createCourseUnit(course.value),
    };
  },
};
</script>

<style scoped></style>
