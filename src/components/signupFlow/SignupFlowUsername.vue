<template>
  <Section
    title="Claim a username"
    subtitle="Your username will be visible in your portfolio of accomplishments, make it a good one"
    class="max-w-2xl w-full"
  >
    <div class="p-4 flex flex-row justify-center items-center">
      <TextInput v-model="handle" placeholder="username" type="text" />

      <BlockButton :click="updateUserHandleCallback" class="ml-4">
        Save
      </BlockButton>
    </div>
  </Section>
</template>

<script>
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import TextInput from "@/components/TextInput.vue";
import { updateUserHandle } from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";
import { reactive, toRefs } from "vue";

export default {
  components: {
    Section,
    BlockButton,
    TextInput,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      handle: null,
    });
    const { onDone } = toRefs(props);
    const updateUserHandleCallback = async () => {
      try {
        await updateUserHandle(state.handle);
        onDone.value();
      } catch (err) {
        notify({
          type: "danger",
          text: "Couldn't update handle",
        });
      }
    };
    return {
      ...toRefs(state),
      updateUserHandleCallback,
    };
  },
};
</script>

<style scoped></style>
