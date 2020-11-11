<template>
  <div class="container">
    <Tooltip
      :text="`Difficulty ${difficulty}%`"
      color="pink"
      class="item"
      :item-margin="10"
    >
      <ScaleBar
        :total="maxDifficulty"
        :progress="difficulty"
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
  data(){
    return {
      maxDifficulty: 99
    };
  },
  computed:{
    color(){
      if (this.difficulty / this.maxDifficulty < .2){
        return '#e058ae';
      }
      if (this.difficulty / this.maxDifficulty < .4){
        return '#d82e9a';
      }
      if (this.difficulty / this.maxDifficulty < .6){
        return '#ad257b';
      }
      if (this.difficulty / this.maxDifficulty < .8){
        return '#821c5c';
      }
      if (this.difficulty / this.maxDifficulty < 1){
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
