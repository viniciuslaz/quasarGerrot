<template>
	<div class="container q-pa-md">
		<div class="row centralizaConteudo">
			<div class="col-4 fundoGraficos q-mr-md">
				<p class="tituloGrafico">VALORES GASTOS:</p>
				<ReactiveChart />
			</div>
			<div class="col-4 fundoGraficos q-ml-5">
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

.centralizaConteudo{
	display: flex;
	justify-content: center;
	align-items: center;
}

.fundoGraficos{
	background-color: var(--cinza-escuro);
	border-radius: 12px;
	padding: 15px;
}
</style>