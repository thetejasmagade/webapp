<template>
  <div>
    <ConfirmModal
      ref="deleteInsightModal"
      heading="Are you sure you want to delete your insight?"
      :on-confirm="deleteUserInsight"
    />
    <router-link
      class="mt-6 ml-4 cursor-pointer flex col-3 hover:opacity-70"
      :to="{
        name: 'Portfolio',
        params: { userHandle: handle },
      }"
      target="_blank"
    >
      <ProfileImage
        class="w-10 rounded-full ml-4 flex"
        :profile-image-u-r-l="profileImageURL"
      />
      <div class="col-span-3 px-3 font-semibold flex flex-col">
        <h1>{{ fname }} {{ lname }}</h1>
        <h2 class="text-sm text-gray-400 font-light">@{{ handle }}</h2>
      </div>
    </router-link>
    <div class="border-b border-gray-400">
      <div class="px-4 py-4 rounded flex text-md shadow-sm text-gray-600">
        <div
          v-if="!isEditing"
          class="ml-4 whitespace-pre-wrap text-white tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-700 rounded focus:outline-none"
        >
          {{ renderTextArea }}
        </div>
        <textarea
          v-if="isAuthor && isEditing"
          v-model="editInsightTextarea"
          rows="6"
          class="ml-4 text-white tracking-wide py-2 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-700 rounded focus:outline-none"
        >
        </textarea>
      </div>
      <div v-if="isAuthor && !isEditing" class="flex justify-end">
        <FontAwesomeIcon
          icon="pencil"
          class="flex w-4 h-4 rounded mb-6 hover:text-blue-500 mr-10 cursor-pointer"
          @click="startEditing"
        />

        <FontAwesomeIcon
          icon="trash"
          class="flex w-4 h-4 rounded hover:text-red-500 mb-6 mr-10 cursor-pointer"
          @click="deleteConfirmation"
        />
      </div>
      <div
        v-else-if="$store.getters.getUser.IsAdmin && !isEditing"
        class="flex justify-end"
      >
        <FontAwesomeIcon
          icon="trash"
          class="flex w-4 h-4 rounded hover:text-red-500 mb-6 mr-10 cursor-pointer"
          @click="deleteConfirmation"
        />
      </div>
      <div v-else-if="isAuthor && isEditing" class="flex justify-end">
        <FontAwesomeIcon
          icon="check"
          class="flex w-4 h-4 text-white hover:text-blue-500 rounded mr-10 cursor-pointer"
          @click="editUserInsight"
        />
        <FontAwesomeIcon
          icon="x"
          class="flex w-4 h-4 text-white hover:text-red-500 mb-6 mr-10 rounded cursor-pointer"
          @click="endEditing"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ProfileImage from "@/components/ProfileImage.vue";
import { updateInsight, deleteInsight } from "@/lib/cloudClient.js";

export default {
  components: {
    ConfirmModal,
    FontAwesomeIcon,
    ProfileImage,
  },
  props: {
    insightText: {
      type: String,
      required: false,
      default: "",
    },
    fname: {
      type: String,
      required: false,
      default: "",
    },
    lname: {
      type: String,
      required: false,
      default: "",
    },
    handle: {
      type: String,
      required: false,
      default: "",
    },
    uuid: {
      type: String,
      required: false,
      default: null,
    },
    profileImageURL: {
      type: String,
      required: false,
      default: null,
    },
    deleteInsight: {
      type: Function,
      required: false,
      default: null,
    },
    authorUUID: {
      type: String,
      required: true,
    },
    getInsights: {
      type: Function,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      isEditing: false,
    };
  },
  computed: {
    isAuthor() {
      return this.authorUUID === this.$store.getters.getUser.UUID;
    },
    renderTextArea() {
      if (!this.insightText) {
        return null;
      }
      return this.insightText;
    },
  },
  methods: {
    startEditing() {
      this.isEditing = true;
      this.editInsightTextarea = this.insightText;
    },
    endEditing() {
      this.isEditing = false;
    },
    async editUserInsight() {
      await updateInsight(this.uuid, this.editInsightTextarea);
      this.getInsights();
      this.isEditing = false;
    },
    deleteConfirmation() {
      this.$refs.deleteInsightModal?.show();
    },
    async deleteUserInsight() {
      await deleteInsight(this.uuid);
      this.getInsights();
    },
  },
};
</script>
