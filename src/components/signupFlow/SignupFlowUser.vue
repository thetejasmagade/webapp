<template>
  <div class="max-w-xl w-full">
    <Section title="Upload an avatar" subtitle="Optional" class="w-full mb-4">
      <div class="p-4 flex flex-row justify-center items-center">
        <ProfileImage
          class="w-32 m-4"
          :profile-image-u-r-l="user?.ProfileImageURL"
          :editable="true"
        />
      </div>
    </Section>
    <Section title="Claim a username" subtitle="Required" class="w-full">
      <div class="p-8 flex flex-row justify-center items-center">
        <TextInput v-model="handle" placeholder="username" type="text" />

        <BlockButton :click="updateUserHandleCallback" class="ml-4">
          Save
        </BlockButton>
      </div>
    </Section>
  </div>
</template>

<script>
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import TextInput from "@/components/TextInput.vue";
import { updateUserHandle } from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";
import { onMounted, reactive, toRefs, computed } from "vue";
import ProfileImage from "@/components/ProfileImage.vue";
import { useStore } from "vuex";
import { loadUser } from "@/lib/cloudStore.js";

export default {
  components: {
    Section,
    BlockButton,
    TextInput,
    ProfileImage,
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
    const store = useStore();
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

    onMounted(async () => {
      await loadUser(store.commit);
    });

    return {
      ...toRefs(state),
      updateUserHandleCallback,
      user: computed(() => store.getters.getUser),
    };
  },
};
</script>

<style scoped></style>
