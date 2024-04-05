<template>
	<v-app>
		<v-img :src="require('~/assets/img/background.jpg')" height="100vh">
			<v-app-bar
				app
				elevate-on-scroll
				color="#f5f5f5"
				max-height="60"
				height="60"
				style="border-width: 0px 0px 1px 0px; border-color: black;border-style: solid;"
			>
				<nav-btn />
			</v-app-bar>

			<v-main class="h-100">
				<v-container fluid class="h-100 mx-0 pa-0">
					<Nuxt />
				</v-container>
			</v-main>

			<!-- <v-footer app color="#2b3494" style="height: 30vh;" /> -->
		</v-img>
	</v-app>
</template>

<script>
export default {
	name: "DefaultLayout"
};
</script>
