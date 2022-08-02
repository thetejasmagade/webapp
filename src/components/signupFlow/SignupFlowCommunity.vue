<template>
  <Section
    title="Join our community chat"
    subtitle="Sync your Discord and Boot.dev accounts"
    class="max-w-2xl mb-4 w-full"
  >
    <div>
      <div class="flex flex-col p-4">
        <ol class="list-disc mb-4">
          <li>
            First,
            <a
              class="underline text-blue-400 hover:text-blue-300"
              href="https://discord.com/download"
              target="_blank"
              >download</a
            >
            the free Discord desktop client.
          </li>
          <li>
            Next,
            <a
              class="underline text-blue-400 hover:text-blue-300"
              href="https://discord.gg/EEkFwbv"
              target="_blank"
              >join our server</a
            >
          </li>
          <li>
            Once you're in, read the
            <a
              class="text-blue-400 underline hover:text-blue-300"
              href="https://discord.com/channels/551921866173054977/920160977788502036"
              target="_blank"
              >#start-here</a
            >
            channel.
          </li>
          <li>
            Type the
            <code
              class="text-gray-200 bg-gray-700 py-1 px-2 rounded overflow-auto my-2"
              >/sync</code
            >
            command in the
            <a
              class="text-blue-400 underline hover:text-blue-300"
              href="https://discord.com/channels/551921866173054977/921896108853178398"
              target="_blank"
              >#bot-cli</a
            >
            channel, then to paste your key below.
          </li>
        </ol>

        <div>
          <div class="flex justify-center mb-8">
            <code
              class="text-gray-200 bg-gray-700 py-1 px-2 rounded overflow-auto my-2"
            >
              {{ apiKey }}
            </code>
          </div>

          <div class="flex flex-row justify-center">
            <BlockButton :click="onDone" class="mr-4">
              Done, I'm connected!
            </BlockButton>
            <BlockButton color="gray" :click="onDone">
              Maybe later
            </BlockButton>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script>
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import { loadUser } from "@/lib/cloudStore.js";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    Section,
    BlockButton,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    onMounted(async () => {
      await loadUser(store.commit);
    });
    return {
      apiKey: computed(() => {
        return store.getters.getUser?.APIKey;
      }),
    };
  },
};
</script>

<style scoped></style>
