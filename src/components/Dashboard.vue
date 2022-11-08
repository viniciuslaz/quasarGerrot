<template>
	<div class="container pt-5">
		<div class="row">
			<div class="col-3">
				<p class="tituloGrafico">VALORES GASTOS:</p>
				<ReactiveChart />
			</div>
			<div class="col-3">
				<p class="tituloGrafico">QUANTIDADE ROTEADORES:</p>
				<QuantidadeRoteadores />
			</div>
		</div>

	</div>
</template>
    
<script>
import ReactiveChart from './reactiveChart'
import QuantidadeRoteadores from './quantidadeRoteadores'

export default {
	name: 'App',
	components: {
		ReactiveChart,
		QuantidadeRoteadores
	}
}
</script>

<style>
.tituloGrafico{
	text-align: center;
	font-size: 24px;
	margin-bottom: 0;
}
</style>