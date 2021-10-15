<template>
  <div class="relative wrap overflow-hidden p-10 h-full">
    <div
      class="
            border-2-2 absolute border-opacity-20 border-gray-700 h-full border
            hidden lg:block
        "
      style="left: 50%"
    />
    <div
      v-for="(course, i) of courses"
      :key="i"
    >
      <div
        class="flex justify-center items-center w-full left-timeline"
        :class="{
          'left-timeline': i%2 === 0,
          'right-timeline': i%2 !==0,
          'flex-row-reverse': i%2 === 0,
          'lg:-mt-48': i > 0
        }"
      >
        <div
          class="
            order-1 w-1/3
            hidden lg:block
        "
        />
        <div
          class="
                z-20 items-center order-1 shadow-xl w-12 h-12 rounded-full
                hidden lg:flex
            "
          :class="{'bg-gray-400': i > 0, 'bg-blue-500': i === 0}"
        >
          <h1 class="mx-auto text-white font-semibold text-md">
            {{ i%2 === 0 ? '←' : null }} {{ i + 1 }} {{ i%2 !== 0 ? '→' : null }}
          </h1>
        </div>
        <div class="order-1 lg:w-1/3 items-center">
          <ImageCard
            :img-src="course.ImageURL"
            :click="() => clickCallback(course)"
            class="lg:mx-8"
          >
            <CourseCardBody
              :course="course"
            />
          </ImageCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard.vue';
import CourseCardBody from '@/components/CourseCardBody.vue';

export default {
  components: {
    ImageCard,
    CourseCardBody
  },
  props:{
    clickCallback: {
      type: Function,
      required: false,
      default: () => {}
    },
    courses: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
