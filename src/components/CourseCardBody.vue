<template>
  <div
    class="body"
  >
    <DifficultyBar 
      :difficulty="course.Difficulty"
    />
            
    <span class="title item">
      {{ course.Title }}
    </span>

    <div
      v-if="course.IsComplete"
    >
      <div class="completed item">
        <FontAwesomeIcon
          icon="check"
        />
        <span>Complete</span>
      </div>
      <BlockButton
        :click="clickBuyCourse"
        class="btn item"
      >
        Browse Course
      </BlockButton>
    </div>
    <div
      v-else-if="course.IsPurchased"
    >
      <div class="purchased item">
        <FontAwesomeIcon
          icon="check"
        />
        <span>Purchased</span>
      </div>
      <BlockButton
        :click="clickBuyCourse"
        class="btn item"
      >
        Continue Course
      </BlockButton>
    </div>
    <div v-else>
      <div
        v-if="!course.IsDemoPurchased"
        class="buy-buttons item"
      >
        <GemDisplay
          :size="1"
          class="flex-1"
          :text="`${course.GemDemoCost}`"
        />
        <BlockButton
          :click="clickBuyDemoCourse"
          class="btn"
        >
          Get Demo
        </BlockButton>
      </div>
      <div
        v-else
        class="buy-buttons item"
      >
        <BlockButton
          :click="clickBuyDemoCourse"
          class="btn"
          color="gray"
        >
          Start Demo
        </BlockButton>
      </div>

      <div class="buy-buttons item">
        <GemDisplay
          :size="1"
          class="flex-1"
          :text="`${course.GemCost}`"
        />
        <BlockButton
          :click="clickBuyCourse"
          :color="course.IsDemoPurchased ? 'purple' : 'gray'"
          class="btn"
        >
          Get Course
        </BlockButton>
      </div>
    </div>

    <div class="item links">
      <span
        class="gray link"
        target="_blank"
        @click.stop="() => {linkClick(course.LandingPage)}"
      >More Info</span>
    </div>
  </div>
</template>

<script>
import GemDisplay from '@/components/GemDisplay';
import DifficultyBar from '@/components/DifficultyBar';
import BlockButton from '@/components/BlockButton';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    GemDisplay,
    DifficultyBar,
    BlockButton,
    FontAwesomeIcon
  },
  props: { 
    course: {
      type: Object,
      required: true
    },
    clickBuyDemoCourse: {
      type: Function,
      required: true
    },
    clickBuyCourse: {
      type: Function,
      required: true
    }
  },
  methods: {
    linkClick(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/consts.scss';

.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1em 1em 0 1em;
}

.title {
  color: $gold-dark;
  font-size: 1.5em;
}

.buy-buttons{
  display: flex;
  flex-direction: row;
  justify-content: center;

  .btn {
    margin-left: 1em;
    font-size: 1em;
    min-width: 150px;
  }
}

.completed {
  color: $green-light;

  span {
    margin-left: 10px;
  }
}

.purchased {
  color: $gold-lighter;

  span {
    margin-left: 10px;
  }
}

.item{
  margin: 15px 0 0 0;
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

</style>
