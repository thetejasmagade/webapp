<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="Claim a username"
        subtitle="Your username will be used to create a personal portfolio link for you"
        class="max-w-2xl w-full"
      >
        <div class="p-4 flex flex-row justify-center items-center">
          <TextInput v-model="handle" placeholder="username" type="text" />

          <BlockButton :click="updateUserHandle" class="ml-4">
            Save
          </BlockButton>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav.vue";
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import TextInput from "@/components/TextInput.vue";
import { updateUserHandle } from "@/lib/cloudClient.js";
import { notify } from "@/lib/notification.js";

export default {
  components: {
    TopNav,
    Section,
    BlockButton,
    TextInput,
  },
  data() {
    return {
      handle: "",
    };
  },
  methods: {
    async updateUserHandle() {
      try {
        await updateUserHandle(this.handle);
        this.$router.push({
          name: "SignupFlowCommunity",
          query: { redirect: this.$route.query.redirect },
        });
      } catch (err) {
        notify({
          type: "danger",
          text: "Couldn't update handle",
        });
      }
    },
  },
};
</script>

<style scoped></style>
