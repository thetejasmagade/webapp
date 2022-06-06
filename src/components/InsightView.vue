<template>
  <div>
    <div class="body overflow-y-auto w-full h-full">
      <UserInsight
        v-for="(insight, i) of sortedInsights"
        :key="i"
        :insight-text="insight.Text"
        :fname="insight.AuthorUser.FirstName"
        :lname="insight.AuthorUser.LastName"
        :handle="insight.AuthorUser.Handle"
        :author-u-u-i-d="insight.AuthorUserUUID"
        :uuid="insight.UUID"
        :get-insights="getExerciseInsights"
        :profile-image-u-r-l="insight.AuthorUser.ProfileImageURL"
      />
    </div>
    <h1 v-if="!isComplete" class="text-lg mb-4 ml-4 pt-4">
      Complete the assignment to submit your own insight.
    </h1>
    <h1 v-else class="text-lg mb-4 ml-4 pt-4">
      If you have any additional thoughts about this concept that may be useful
      to other learners, drop a comment below!
    </h1>
    <textarea
      v-if="isComplete"
      v-model="insightText"
      :disabled="!isComplete"
      placeholder="Do not report issues, ask questions, or give hints here. Use the other tabs for that."
      class="autoexpand tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-700 rounded focus:outline-none resize-none"
      rows="4"
    />
    <BlockButton
      v-if="isComplete"
      :disabled="!insightText"
      :click="btnClick"
      class="mb-4 ml-4"
    >
      Submit
    </BlockButton>
    <div class="w-96 mx-auto text-gray-700 rounded">
      <div class="buttons ml-auto flex text-xs"></div>
    </div>
  </div>
</template>
<script>
import UserInsight from "@/components/UserInsight.vue";
import BlockButton from "@/components/BlockButton.vue";
import { notify } from "@/lib/notification.js";
import { loadUser } from "@/lib/cloudStore.js";

import { createInsight, getInsights } from "@/lib/cloudClient.js";

export default {
  components: {
    UserInsight,
    BlockButton,
  },
  props: {
    exerciseUUID: {
      type: String,
      required: true,
      default: null,
      insights: [],
    },
    isExerciseComplete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      insightText: null,
      insights: [],
    };
  },
  computed: {
    sortedInsights() {
      const sortedInsights = [];
      if (!this.$store.getters.getUser) {
        return null;
      }
      if (!this.insights) {
        return [];
      }
      for (const insight of this.insights) {
        if (insight.AuthorUserUUID === this.$store.getters.getUser.UUID) {
          sortedInsights.push(insight);
        }
      }
      for (const insight of this.insights) {
        if (insight.AuthorUserUUID != this.$store.getters.getUser.UUID) {
          sortedInsights.push(insight);
        }
      }
      return sortedInsights;
    },
    isComplete() {
      return this.isExerciseComplete;
    },
  },
  async mounted() {
    if (!this.$store.getters.getUser) {
      loadUser(this.$store.commit);
    }
    await this.getExerciseInsights();
  },

  methods: {
    async getExerciseInsights() {
      try {
        this.insights = await getInsights(this.exerciseUUID);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
    async btnClick() {
      try {
        if (!this.insightText) {
          throw "Please enter your insights before submitting.";
        }
        await createInsight(this.exerciseUUID, this.insightText);
        notify({
          type: "success",
          text: "Thanks for adding your insight!",
        });
        this.insightText = null;
        this.getExerciseInsights();
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    },
  },
};
</script>
