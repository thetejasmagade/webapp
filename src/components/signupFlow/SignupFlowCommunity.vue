<template>
  <Section
    title="Join our community chat"
    subtitle="Sync your Discord and Boot.dev accounts"
    class="max-w-2xl mb-4 w-full"
  >
    <div>
      <div class="flex flex-col p-4">
        <ul class="list-disc mb-4">
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
          <li>Next, join our server.</li>
        </ul>

        <div class="flex justify-center mb-4">
          <BlockButton :click="discordClick">
            <FontAwesomeIcon :icon="['fab', 'discord']" class="icon" />
            Join the Boot.dev Server
          </BlockButton>
        </div>

        <div>
          <p>
            Once you're in, read the
            <a
              class="text-blue-400 underline hover:text-blue-300"
              href="https://discord.com/channels/551921866173054977/920160977788502036"
              target="_blank"
              >#start-here</a
            >
            channel. You'll be asked to type the
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
            channel, then to paste in your key below.
          </p>

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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import { loadUser } from "@/lib/cloudStore.js";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    Section,
    BlockButton,
    FontAwesomeIcon,
  },
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const discordClick = () => {
      window.open("https://discord.gg/EEkFwbv", "_blank");
    };
    onMounted(async () => {
      await loadUser(store.commit);
    });
    return {
      apiKey: computed(() => {
        return store.getters.getUser?.APIKey;
      }),
      discordClick,
    };
  },
};
</script>

<style scoped></style>
