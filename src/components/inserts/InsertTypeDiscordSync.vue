<template>
  <div class="flex flex-col justify-start h-full overflow-auto">
    <div class="flex flex-col justify-center items-center flex-1 p-4">
      <Section
        title="Join the Boot.dev chat"
        subtitle="You haven't synced your Discord and Boot.dev accounts"
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
              <li>Next, join our server below</li>
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
                channel. You'll be asked to type the "/sync" command in the
                <a
                  class="text-blue-400 underline hover:text-blue-300"
                  href="https://discord.com/channels/551921866173054977/921896108853178398"
                  target="_blank"
                  >#bot-cli</a
                >
                channel, then to paste in your API key from below.
              </p>

              <div class="flex justify-center">
                <code
                  class="text-gray-200 bg-gray-700 py-1 px-2 rounded overflow-auto my-2"
                >
                  {{ $store.getters.getUser?.APIKey }}
                </code>
              </div>

              <div class="text-center mt-2">
                <BlockButton :click="onClickDone">
                  Done, I'm connected!
                </BlockButton>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>
<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";
import { loadUser } from "@/lib/cloudStore.js";
import { markSeenDiscordSyncInsert } from "@/lib/localStorageLib";

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
  async mounted() {
    markSeenDiscordSyncInsert();
    await loadUser(this.$store.commit);
  },
  methods: {
    discordClick() {
      window.open("https://discord.gg/EEkFwbv", "_blank");
    },
    onClickDone() {
      this.onDone();
    },
  },
};
</script>

<style scoped></style>
