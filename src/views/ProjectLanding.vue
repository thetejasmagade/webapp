<template>
  <ViewNavWrapper>
    <div
      v-if="project"
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto p-4"
    >
      <Section class="max-w-3xl w-full mb-4">
        <div class="p-4 flex flex-col justify-start items-center">
          <img :src="project.ImageURL" class="rounded mb-8" />
          <BlockButton v-if="projectLink" :link="projectLink" color="blue">
            <span>Get Started</span>
          </BlockButton>
        </div>
      </Section>
      <Section h1 class="max-w-3xl w-full mb-4" :title="project.Title">
        <div class="p-4">
          <p class="mb-4">{{ project.Description }}</p>
        </div>
      </Section>
      <Section class="max-w-3xl w-full mb-4">
        <div class="p-4">
          <div class="flex flex-row justify-evenly p-4 rounded mb-4">
            <div class="text-center">
              <p>Build your</p>
              <p class="text-4xl">Portfolio</p>
              <FontAwesomeIcon
                icon="star"
                class="text-4xl mt-2 text-blue-400"
              />
            </div>
            <div class="text-center">
              <p>Time to complete</p>
              <p class="text-4xl">
                {{ `${project.EstimatedCompletionTimeHours} Hours` }}
              </p>
              <FontAwesomeIcon
                icon="hourglass"
                class="text-4xl mt-2 text-blue-400"
              />
            </div>
          </div>
        </div>
      </Section>
      <Section
        class="max-w-3xl w-full mb-4"
        title="What's the difference between a project and a course on Boot.dev?"
      >
        <div class="p-4">
          <p class="my-4">
            Projects are our way of providing "unguided" learning. Courses are a
            great way to learn new concepts quickly, then projects let you get
            your hands dirty with "real world" code.
          </p>
          <ul class="list-disc mb-4">
            <li>
              You will write real code on your own machine instead of in the
              browser
            </li>
            <li>
              You'll still have instructions and guidance on how to complete
              each step
            </li>
            <li>
              You will still have access to a well-written solution when you get
              stuck
            </li>
            <li>
              You will apply and practice the coding fundamentals you've been
              learning in the courses
            </li>
            <li>
              Projects allow you to come up with more of the solution on your
              own, like you would in a real life job
            </li>
            <li>
              You'll have a working codebase at the end to show off on your
              Github portfolio
            </li>
          </ul>
        </div>
      </Section>
    </div>
  </ViewNavWrapper>
</template>

<script>
import ViewNavWrapper from "@/components/ViewNavWrapper.vue";
import Section from "@/components/Section.vue";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { notify } from "@/lib/notification.js";
import { loadProjects } from "@/lib/cloudStore.js";
import { getComputedMeta } from "@/lib/meta.js";
import { useMeta } from "vue-meta";
import BlockButton from "@/components/BlockButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    Section,
    ViewNavWrapper,
    BlockButton,
    FontAwesomeIcon,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    onMounted(async () => {
      try {
        await loadProjects(store.commit);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    });

    const project = computed(() => {
      for (const project of store.getters.getProjects) {
        if (project.Slug === route.params.projectSlug) {
          return project;
        }
      }
      return null;
    });

    const projectLink = computed(() => {
      if (!project) {
        return null;
      }
      return {
        name: "Project",
        params: { projectUUID: project.value.UUID },
      };
    });

    const computedMeta = getComputedMeta({
      title: project.value?.Title,
      description: project.value?.Description,
      image: project.value?.ImageURL,
    });
    useMeta(computedMeta);

    return {
      project,
      projectLink,
    };
  },
};
</script>

<style scoped></style>
