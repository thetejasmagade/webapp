<template>
  <div class="container">
    <Tooltip
      :text="`Difficulty ${difficulty}/5`"
      color="pink"
      class="item"
      :item-margin="10"
    >
      <ScaleBar
        :circles-total="5" 
        :circles-progress="difficulty"
        :fill-color="color"
      />
    </Tooltip>
  </div>
</template>

<script>
import ScaleBar from '@/components/ScaleBar';
import Tooltip from '@/components/Tooltip';

export default {
  components: {
    ScaleBar,
    Tooltip
  },
  props: {
    difficulty: {
      type: Number,
      required: true
    }
  },
  computed:{
    color(){
      if (this.difficulty === 1){
        return '#e058ae';
      }
      if (this.difficulty === 2){
        return '#d82e9a';
      }
      if (this.difficulty === 3){
        return '#ad257b';
      }
      if (this.difficulty === 4){
        return '#821c5c';
      }
      if (this.difficulty === 5){
        return '#56123e';
      }
      return '#ffffff';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
