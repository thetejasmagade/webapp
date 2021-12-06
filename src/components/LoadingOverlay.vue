<template>
  <div>
    <VueLoadingOverlay
      :active="isLoading" 
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
          class="mt-4"
        >
          Cancel
        </BlockButton>
      </template>
    </VueLoadingOverlay>
  </div>
</template>
 
<script>
import BlockButton from '@/components/BlockButton.vue';
import VueLoadingOverlay from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
    
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

<style>
.vld-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
