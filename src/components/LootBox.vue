<template>
  <div class="h-48 w-full flex justify-around items-center flex-wrap relative">
    <div
      type="button"
      class="box"
      :class="{
        open: open,
        closed: !open,
        spinning: spinning,
        floating: !open,
        'active-scale-11': !open,
      }"
      @click="onBoxClick"
    ></div>
    <span class="shadow" :class="{ 'shadow-animate': !open }"></span>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/runtime-core";

export default {
  props: {
    onDone: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      open: false,
      spinning: false,
    });
    const { onDone } = toRefs(props);

    const onBoxClick = () => {
      if (state.open) {
        return;
      }
      state.spinning = true;
      setTimeout(() => {
        state.spinning = false;
        state.open = true;
        onDone.value();
      }, 700);
    };

    return {
      ...toRefs(state),
      onBoxClick,
    };
  },
};
</script>

<style scoped>
@keyframes float {
  0% {
    top: 0;
  }
  50% {
    top: 30px;
  }
  100% {
    top: 0;
  }
}

@keyframes shadow-aperture {
  0% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(0.8, 0.2);
  }
  50% {
    opacity: 0.75;
    transform: translate(-50%, -50%) scale(1.1, 0.25);
  }
  100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(0.8, 0.2);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1080deg);
  }
}

.flex-basis-20 {
  flex: 0 0 20%;
}

.box {
  background-color: transparent;
  border: 0;
  display: block;
  width: 100%;
  height: 150px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  left: 0;
  z-index: 10;
}

.spinning {
  animation: spin 0.7s 1, float 2s infinite !important;
  filter: blur(2px);
  -webkit-filter: blur(2px);
}

.floating {
  animation: float 2s infinite;
}

.open {
  background-image: url("https://i.imgur.com/kFNiQ30.png");
}

.closed {
  background-image: url("https://i.imgur.com/K0RVBsM.png");
  cursor: pointer;
}

.shadow-animate {
  animation-name: shadow-aperture;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

.shadow {
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1, 0.2);
  border-radius: 50%;
  max-width: 8rem;
  width: 100%;
  height: 100px;
  background: black;
  opacity: 0.75;
}

.active-scale-11 {
  transition: transform 0.15s;
}

.active-scale-11:hover {
  transform: scale(1.1);
}
</style>
