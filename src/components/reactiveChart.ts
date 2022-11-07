import { defineComponent, ref, h, onMounted, PropType } from "vue";
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  Plugin,
  ChartData,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
);

var roteadores = [];
var tplink = 0;
var datacom = 0
var huawei = 0;
var outros = 0

var valorHuawei = 0;
var valorDatacom = 0;
var valorTplink = 0;
var valorOutros = 0

export default defineComponent({
  name: "DoughnutChart",
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
      type: Array as PropType<Plugin<"bar">[]>,
      default: () => [],
    },
  },
  setup(props) {
    const chartData = ref<ChartData<"bar">>({
      datasets: [],
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    function fillData() {
      const updatedChartData = {
        labels: [
          "TPLINK",
          "HUAWEI",
          "DATACOM",
          "OUTROS"
        ],
        datasets: [
          {
            label: "Valor roteadores",
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [valorTplink, valorHuawei, valorDatacom, valorOutros],
          },
        ],
      };

      chartData.value = { ...updatedChartData };
    }


    async function pegaRoteadores() {
      await axios
        .get("https://api.gerrot.star.psi.br/api/")
        .then((res) => {
          roteadores = res.data;
          for (var x = 0; x < roteadores.length; x++) {
            var modelo = roteadores[x].modelo;
            switch(modelo){
                  case 'tplink':{
                        tplink += 1;
                        break;
                  }
                  case 'huawei': {
                        huawei += 1;
                        break;
                  }
                  case 'datacom': {
                        datacom += 1;
                        break;
                  }
                  default: {
                        outros += 1;
                  }
            }
          }

        })
        .catch((error) => {
          console.log(error, "puts");
        });
    }

    function calculaValores(){
      valorHuawei = huawei * 300;
      valorTplink = tplink * 250;
      valorDatacom = datacom * 250;
      valorOutros = outros * 200;
}

    onMounted(() => {
      pegaRoteadores();
      setTimeout(() => {
            calculaValores();
          }, 2000);
      setTimeout(() => {
        fillData();
      }, 2000);
    });

    return () =>
      h(Doughnut, {
        chartData: chartData.value,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      });
  },
});
