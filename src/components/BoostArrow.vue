<template>
  <div class="flex justify-center items-center w-10 h-10">
    <div class="arrow-slide1">
      <div class="arrow"></div>
    </div>
    <div class="arrow-slide2">
      <div class="arrow"></div>
    </div>
    <div class="arrow-slide3">
      <div class="arrow"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.arrow {
  width: 25px;
  height: 25px;
  border: 5px solid;
  border-color: var(--blue-500) transparent transparent var(--blue-500);
  transform: rotate(45deg);
  border-radius: 4px;
}

.arrow-slide1 {
  position: absolute;
  animation: slide1 3s linear infinite;
}

.arrow-slide2 {
  position: absolute;
  animation: slide2 3s linear infinite;
}

.arrow-slide3 {
  position: absolute;
  animation: slide3 3s linear infinite;
}

@keyframes slide1 {
  0% {
    opacity: 1;
    transform: translateY(18px);
  }
  66% {
    opacity: 1;
    transform: translateY(0px);
  }
  81% {
    opacity: 0;
    transform: translateY(0px);
  }
  82% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(18px);
  }
}

@keyframes slide2 {
  0% {
    opacity: 1;
    transform: translateY(9px);
  }
  33% {
    opacity: 1;
    transform: translateY(0px);
  }
  48% {
    opacity: 0;
    transform: translateY(0px);
  }
  49% {
    opacity: 0;
    transform: translateY(18px);
  }
  66% {
    opacity: 1;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(9px);
  }
}

@keyframes slide3 {
  0% {
    opacity: 1;
    transform: translateY(0px);
  }
  15% {
    opacity: 0;
    transform: translateY(0px);
  }
  16% {
    opacity: 0;
    transform: translateY(18px);
  }
  33% {
    opacity: 1;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
