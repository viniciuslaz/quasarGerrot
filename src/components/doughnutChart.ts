import { defineComponent, h, PropType } from "vue";

import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  Plugin,
} from "chart.js";
import axios from "axios";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  name: "DoughnutChart",
  roteadores: [],
  components: {
    Doughnut,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => {},
    },
    plugins: {
      type: Array as PropType<Plugin<"doughnut">[]>,
      default: () => [],
    },
  },
  setup(props) {
	var roteadores = [];
    const chartData = {
	labels: ["Teste"],
      datasets: [
        {
          backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
          data: [40, 20, 80, 10],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    return () =>
      h(Doughnut, {
        chartData,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
		roteadores: [],
      });
  },
  async mounted() {
    let apiURL = "https://api.gerrot.star.psi.br/api/";
    axios
      .get(apiURL)
      .then((res) => {
        this.roteadores = res.data;
		console.log(this.roteadores);
      })
      .catch((error) => {
        console.log(error, "puts");
      });
    this.loaded = false;
    try {
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
});
