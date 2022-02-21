<template>
  <div class="flex flex-col justify-start h-full">
    <TopNav title="Getting Started" />

    <div class="flex flex-col justify-center items-center flex-1">
      <Section
        title="We are all about achieving career goals"
        subtitle="Do you want help finding your next coding job?"
        class="section"
      >
        <div class="max-w-xl p-4">
          <p class="mb-2">
            We have partnerships with organizations that are dedicated to
            finding great coding jobs for our community. If you're interested in
            getting hired now or in the future then opt-in below.
          </p>

          <div class="text-center">
            <BlockButton class="mr-4" :click="() => done(true)">
              Yes! I'd like to hear about jobs
            </BlockButton>
            <BlockButton class="btn" color="gray" :click="() => done(false)">
              No thanks
            </BlockButton>
          </div>
        </div>
      </Section>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav.vue";
import Section from "@/components/Section.vue";
import BlockButton from "@/components/BlockButton.vue";

import { updateUser } from "@/lib/cloudClient.js";

import { eventTutorialComplete } from "@/lib/analytics.js";
import { notify } from "@/lib/notification.js";

export default {
  components: {
    TopNav,
    Section,
    BlockButton,
  },
  methods: {
    async done(accept) {
      if (accept) {
        try {
          await updateUser({ recruitersCanContact: true });
        } catch (err) {
          notify({
            type: "danger",
            text: err,
          });
        }
      }
      eventTutorialComplete();
      this.$router.push({
        name: "Courses",
        query: { redirect: this.$route.query.redirect },
      });
    },
  },
};
</script>

<style scoped></style>
