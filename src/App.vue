<template>
	<q-layout view="lhr lpR fFf">

		<q-drawer show-if-above v-model="leftDrawerOpen" class="bgBrancoEscuro" side="left" elevated>
			<div class="topoNavbar flex justify-center align-center q-py-md">
				<span class="topoSpan q-mr-lg"></span>
				<p class="topoTitulo">GERROT</p>
			</div>

			<div class="userNavbar">
				<q-avatar size="160px">
					<img src="./assets/user.png">
				</q-avatar>
				<p class="userNome q-mt-sm">Vinicius</p>
				<p class="userFuncao">Admin</p>
			</div>

			<div class="botoesNavbar">
				<q-list class="">
					<q-item clickable to="/" :active="link === 'inbox'" @click="link = 'inbox'"
						active-class="my-menu-link" class="q-px-xl">
						<q-item-section avatar>
							<q-icon name="dashboard" />
						</q-item-section>

						<q-item-section>Dashboard</q-item-section>
					</q-item>

					<q-item clickable to="/listar" :active="link === 'outbox'" @click="link = 'outbox'"
						active-class="my-menu-link" class="q-px-xl">
						<q-item-section avatar>
							<q-icon name="list" />
						</q-item-section>

						<q-item-section>Listar</q-item-section>
					</q-item>

					<q-item clickable :active="link === 'trash'" @click="link = 'trash'"
						active-class="my-menu-link" class="q-px-xl">
						<q-item-section avatar>
							<q-icon name="delete" />
						</q-item-section>

						<q-item-section>Deslogar</q-item-section>
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
import { ref } from 'vue'

export default {
	setup() {
		const leftDrawerOpen = ref(false)

		return {
			leftDrawerOpen,
			toggleLeftDrawer() {
				leftDrawerOpen.value = !leftDrawerOpen.value
			},
			link: ref('inbox'),
		}
	}
}
</script>

<style>
@import './navbarLeft.css';

:root {
	--preto-escuro: #1f1f20;
	--azul-escuro: #2b4c7e;
	--azul-claro: #567ebb;
	--cinza-escuro: #606d80;
	--branco-claro: #dce0e6;
}
</style>
