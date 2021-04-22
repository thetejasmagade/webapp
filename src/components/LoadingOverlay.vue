<template>
  <div class="loading-overlay">
    <VueLoadingOverlay
      :active.sync="isLoading" 
      :is-full-page="true"
      :can-cancel="false"
      :enforce-focus="true"
    >
      <template
        v-if="cancel"
        v-slot:after
      >
        <BlockButton
          :click="cancel"
          color="gray"
          class="btn"
        >
          Cancel
        </BlockButton>
      </template>
    </VueLoadingOverlay>
  </div>
</template>
 
<script>
import BlockButton from '@/components/BlockButton.vue';
import VueLoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    
export default {
  components: {
    VueLoadingOverlay,
    BlockButton
  },
  props: { 
    isLoading:{
      type: Boolean,
      required: true
    },
    cancel: {
      type: Function,
      required: false,
      default: null
    }
  }
};
</script> 

<style lang="scss">
@import '@/styles/colors.scss';

.loading-overlay{

  .vld-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .btn {
    margin-top: 1em;
  }
}
</style>
