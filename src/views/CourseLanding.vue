<template>
  <ViewNavWrapper>
    <div
      v-if="course"
      class="flex flex-col justify-start items-center h-full-minus-bar overflow-auto p-4"
    >
      <Section class="max-w-3xl w-full mb-4">
        <div class="p-4 flex flex-col justify-start items-center">
          <img :src="course.ImageURL" class="rounded mb-8" />
          <BlockButton v-if="courseLink" :link="courseLink" color="blue">
            <span>Get Started</span>
          </BlockButton>
        </div>
      </Section>
      <Section h1 class="max-w-3xl w-full mb-4" :title="course.Title">
        <div class="p-4">
          <p class="mb-4">{{ course.Description }}</p>
        </div>
      </Section>
      <Section class="max-w-3xl w-full mb-4">
        <div class="p-4">
          <div class="flex flex-row justify-evenly p-4 rounded mb-4">
            <div class="text-center">
              <p>Earn a</p>
              <p class="text-4xl">Certificate</p>
              <FontAwesomeIcon
                icon="star"
                class="text-4xl mt-2 text-blue-400"
              />
            </div>
            <div class="text-center">
              <p>Time to complete</p>
              <p class="text-4xl">
                {{ `${course.EstimatedCompletionTimeHours} Hours` }}
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
        title="What will you learn?"
        subtitle="Chapter list"
      >
        <div class="p-4">
          <div v-for="(chapter, i) of course.Modules" :key="i">
            <router-link
              class="flex items-center hover:opacity-50 cursor-pointer"
              :to="{
                name: 'Course',
                params: { courseUUID: course.UUID, moduleUUID: chapter.UUID },
              }"
            >
              <span class="text-3xl text-gray-300 mr-4">
                {{ i + 1 }}
              </span>
              <div class="ml-4">
                <div class="text-md font-medium text-blue-400">
                  {{ chapter.Title }}
                </div>
                <div class="text-sm text-gray-400">
                  {{ chapter.Description }}
                </div>
              </div>
            </router-link>
            <div class="border-b w-full my-2" />
          </div>
        </div>
      </Section>
      <Section
        class="max-w-3xl w-full mb-4"
        title="What makes Boot.dev courses special?"
      >
        <div class="p-4">
          <ul class="list-disc mb-4">
            <li>Write real code and get instant feedback</li>
            <li>Have access to well-written solutions when you get stuck</li>
            <li>Connect with a community of learners, mentors and teachers</li>
            <li>
              Learn the CompSci fundamentals that employers say their candidates
              are lacking
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
import { loadCourses } from "@/lib/cloudStore.js";
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
        await loadCourses(store.commit);
      } catch (err) {
        notify({
          type: "danger",
          text: err,
        });
      }
    });

    const course = computed(() => {
      for (const course of store.getters.getCourses) {
        if (course.Slug === route.params.courseSlug) {
          return course;
        }
      }
      return null;
    });

    const courseLink = computed(() => {
      if (!course) {
        return null;
      }
      return {
        name: "Course",
        params: { courseUUID: course.value.UUID },
      };
    });

    const computedMeta = getComputedMeta({
      title: course.value?.Title,
      description: course.value?.Description,
      image: course.value?.ImageURL,
    });
    useMeta(computedMeta);

    return {
      course,
      courseLink,
    };
  },
};
</script>

<style scoped></style>
