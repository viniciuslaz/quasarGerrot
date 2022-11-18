<template>
	<q-dialog v-model="relatorio">
		<q-card class="q-pa-sm" style="width: 400px">
			<div class="tituloEditaRoteador">Enviar relatório</div>

			<form ref="form" @submit.prevent="sendEmail" enctype="multipart/form-data" class="q-gutter-md">
				<q-input outlined class="q-mb-md" v-model="name" label="Nome:" type="text" />
				<q-input v-model="email" class="q-mb-md" outlined label="Email:" />
				<q-input v-model="message" outlined autogrow label="Mensagem:" />
				<q-input @update:model-value="val => { file = val[0] }" filled type="file" />

				<q-card-actions align="right" class="bg-white text-teal">
					<q-btn flat label="Enviar" color="primary" type="submit" />
					<q-btn flat label="Cancelar" color="red" v-close-popup />
				</q-card-actions>
			</form>
		</q-card>
	</q-dialog>

	<q-layout view="Lhr lpR fFf" class="bgBrancoEscuro">

		<q-drawer show-if-above v-model="leftDrawerOpen" class="bgBrancoEscuro" side="left" elevated>
			<div class="topoNavbar flex justify-center align-center q-py-md">
				<span class="topoSpan q-mr-lg"></span>
				<p class="topoTitulo">GERROT</p>
			</div>

			<div class="userNavbar">
				<q-avatar size="160px">
					<img src="./assets/user.png">
				</q-avatar>
				<p class="userNome q-mt-sm">William</p>
				<p class="userFuncao">Admin</p>
			</div>

			<div class="botoesNavbar">
				<q-list class="">
					<q-item clickable to="/" active-class="my-menu-link" class="q-px-xl">
						<q-item-section avatar>
							<q-icon name="list" />
						</q-item-section>

						<q-item-section>Listar</q-item-section>
					</q-item>

					<q-item clickable to="/dashboard" active-class="my-menu-link" class="q-px-xl">
						<q-item-section avatar>
							<q-icon name="dashboard" />
						</q-item-section>

						<q-item-section>Dashboard</q-item-section>
					</q-item>
				</q-list>
			</div>
		</q-drawer>

		<q-page-container style="background-color: white; height: 100vh;">
			<router-view />
		</q-page-container>

	</q-layout>
</template>

<script>
import axios from "axios";
import { ref } from 'vue'
import emailjs from 'emailjs-com';
let $q;

export default {
	setup() {
		const leftDrawerOpen = ref(false)

		return {
			leftDrawerOpen,
			toggleLeftDrawer() {
				leftDrawerOpen.value = !leftDrawerOpen.value
			},
			link: ref('inbox'),
			relatorio: ref(false),
		}
	},
	data() {
		return {
			name: '',
			email: '',
			message: '',
			roteadores: [],
		}
	},
	created() {
		this.ListaRotadores();
	},
	methods: {
		ListaRotadores() {
			let apiURL = import.meta.env.VITE_APIURL;
			axios.get(apiURL)
				.then(res => {
					this.roteadores = res.data
				})
				.catch(error => {
					console.log(error, 'puts')
				});
		},
		sendEmail(e) {
			var parametros = {
				remetente: this.name,
				email: this.email,
				mensagem: this.message,
			}
			emailjs.send('service_m27ry6z', 'template_xmu6hgr', parametros, 'ZV68rj9MTV1-ZICUm')
				.then(function (response) {
					console.log('SUCCESS!', response.status, response.text);
					this.relatorio = false;
					$q.notify({
						icon: 'done',
						color: 'positive',
						message: 'Email enviado!'
					})
				}, function (error) {
					this.relatorio = false;
					$q.notify({
						icon: 'done',
						color: 'negative',
						message: 'Algo deu errado', error
					})
				});
			this.name = ''
			this.email = ''
			this.message = ''
		},
	}
}
</script>

<style>
@import './navbarLeft.css';

:root {
	--preto-escuro: #1f1f20;
	--azul-escuro: #4180ab;
	--azul-claro: #8ab3cf;
	--cinza-escuro: #bdd1de;
	--branco-claro: #e4ebf0;
}

.corIcone {
	color: var(--cinza-escuro);
}

.searchColor {
	background-color: white !important;

}
</style>
