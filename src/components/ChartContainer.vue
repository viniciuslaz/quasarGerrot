<template>
  <div class="container">
    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>
    
<script>
import LineChart from "./Chart.vue";

export default {
  name: "LineChartContainer",
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartData: {
      labels: ["Teste", "EmberJs", "ReactJs", "AngularJs"],
      datasets: [
        {
          backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
          data: [40, 20, 80, 10],
        },
      ],
    },
  }),
  async mounted() {
    console.log("Teste")
    this.loaded = false;
    try {
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  }
};
</script>