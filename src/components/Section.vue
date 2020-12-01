<template>
  <div class="section">
    <div
      v-if="title || subtitle"
      class="titlebox"
    >
      <div
        v-if="title"
        class="title"
      >
        {{ title }}
      </div>
      <div
        v-if="subtitle"
        class="subtitle"
      >
        {{ subtitle }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: { 
    title: {
      type: String,
      required: false,
      default: null
    },
    subtitle: {
      type: String,
      required: false,
      default: null
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.section {
  padding: 2em;
  background-color: $white;
  border-radius: 3px;
  background-color: $gray-darker-2;
  color: $gray-lightest;

  .titlebox {
    .title {
      font-size: 24px;
      font-weight: bold;
      position: relative;
      margin-bottom: 5px;
    }

    .subtitle {
      color: $gray-lighter;
    }

    &:after {
      content: "";
      background: $purple-light;
      border-radius: 25px;
      display: block;
      height: 5px;
      margin-top: 14px;
      width: 30px;
      transition: 0.7s ease-in-out;
    }
  }

  &:hover {
    .titlebox {
      &:after {
        width: 70px;
      }
    }
  }
}
</style>
