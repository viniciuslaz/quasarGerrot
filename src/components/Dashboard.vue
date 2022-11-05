<template>
	<DoughnutChart />
</template>
  
<script>
import { h } from "vue";
import { Doughnut } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
} from "chart.js";
import axios from "axios";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
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
	},
	setup(props) {
		const chartData = {
			labels: [this.roteadores[0]],
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
};

</script>
  