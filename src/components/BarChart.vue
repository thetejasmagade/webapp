<template>
  <Bar
    :chart-options="{
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 3,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          type: 'logarithmic',
          title: {
            display: true,
            text: yLabel,
            color: foregroundColor,
            font: {
              size: 16,
            },
          },
          ticks: {
            color: foregroundColor,
          },
        },
        x: {
          title: {
            display: true,
            text: xLabel,
            color: foregroundColor,
            font: {
              size: 16,
            },
          },
          ticks: {
            color: foregroundColor,
          },
        },
      },
    }"
    :chart-data="{
      labels: categories,
      datasets: [
        {
          label: yLabel,
          data: series,
          backgroundColor: seriesColor,
        },
      ],
    }"
    class="w-full"
  />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale
);

export default {
  components: {
    Bar,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    yLabel: {
      type: String,
      required: true,
    },
    xLabel: {
      type: String,
      required: true,
    },
    foregroundColor: {
      type: String,
      required: false,
      default: "#e5e5e5",
    },
    seriesColor: {
      type: String,
      required: false,
      default: "#5865F2",
    },
  },
};
</script>

<style scoped></style>
