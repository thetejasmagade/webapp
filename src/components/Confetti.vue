<template>
  <div />
</template>

<script>
import confetti from "canvas-confetti";
// examples - https://www.kirilv.com/canvas-confetti/

export default {
  setup() {
    const start = () => {
      const durationMs = 1000;
      const end = Date.now() + durationMs;
      const colors = ["#5865F2", "#FEE75C", "#ED4245", "#57F287"];

      const run = () => {
        confetti({
          particleCount: colors.length,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          disableForReducedMotion: true,
          ticks: 50,
        });
        confetti({
          particleCount: colors.length,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          disableForReducedMotion: true,
          ticks: 50,
        });

        if (Date.now() < end) {
          requestAnimationFrame(run);
        }
      };
      run();
    };
    return {
      start,
    };
  },
};
</script>

<style scoped></style>
