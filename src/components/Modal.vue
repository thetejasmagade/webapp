<template>
  <div>
    <transition
      v-if="showModal"
      name="modal"
    >
      <div
        class="modal-mask"
        @click.stop="hide"
      >
        <div class="modal-wrapper">
          <div
            class="modal-container"
            @click.stop=""
          >
            <div class="modal-body">
              <div>
                <div
                  class="close"
                  @click.stop="hide"
                />
              </div>
              <slot />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false
    };
  },
  methods:{
    show(){
      this.showModal = true;
    },
    hide(){
      this.showModal = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
}

.modal-container {
  flex: 1 1 calc(22% - 1em);
  max-width: 600px;
  min-width: 250px;
  padding: 20px 30px;
  background-color: $gray-darker-2;
  color: $gray-lightest;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close {
  width: 32px;
  height: 32px;
  opacity: 0.3;
  position: relative;
  float: right;

  &:hover {
    opacity: 1;
  }

  &:before, &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: $white;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }
}
</style>
