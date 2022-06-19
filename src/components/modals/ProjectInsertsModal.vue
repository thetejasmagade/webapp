<template>
  <Modal ref="insertsModal" :on-close="onClose">
    <div v-if="inserts.length > 0">
      <InsertTypeUnitDone
        v-if="inserts[0].type === 'unitDone'"
        :on-done="onSeenInsert"
        :unit="unit"
      />
    </div>
  </Modal>
</template>

<script>
import InsertTypeUnitDone from "@/components/inserts/InsertTypeUnitDone.vue";

import Modal from "@/components/modals/Modal.vue";

import { toRefs, ref, reactive, watchEffect, onMounted } from "vue";

import { hasSeen, getSeenUnitDoneModalKey } from "@/lib/localStorageLib";

import { createProjectUnit } from "@/lib/unit.js";

export default {
  components: {
    Modal,
    InsertTypeUnitDone,
  },
  props: {
    projectDone: {
      type: Boolean,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    isStepComplete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { isStepComplete } = toRefs(props);

    const { projectDone, project } = toRefs(props);
    const state = reactive({
      isMounted: false,
      inserts: [],
    });

    const showUnitDoneIfNecessary = (projectDoneValue, projectValue) => {
      if (!projectDoneValue) {
        return;
      }
      if (hasSeen(getSeenUnitDoneModalKey(projectValue.UUID))) {
        return;
      }
      if (state.inserts.find((insert) => insert.type === "unitDone")) {
        return;
      }
      state.inserts.push({
        type: "unitDone",
      });
    };

    onMounted(() => {
      state.isMounted = true;
    });

    watchEffect(async () => {
      showUnitDoneIfNecessary(projectDone.value, project.value);
      if (isStepComplete.value && state.isMounted) {
        show();
      }
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
      unit: createProjectUnit(project.value),
    };
  },
};
</script>

<style scoped></style>
