<template>
  <div class="multipane-resizer">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.multipane-resizer {
  display: block;
  position: relative;
  z-index: 2;
}
</style>
