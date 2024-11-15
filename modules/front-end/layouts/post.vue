<template>
	<v-app>
		<v-img src="/img/background.jpg" content-class="h-100">
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
				<v-container fluid class="h-100 mx-0 py-10">
					<Nuxt />
				</v-container>
			</v-main>

			<!-- <v-footer app color="#2b3494" style="height: 30vh;" /> -->
			 <snack-bar/>
		</v-img>
	</v-app>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
	name: "PostLayout",
	computed: {
		...mapFields('faculty', ['faculties'])
	},
	async mounted () {
		if (!this.faculties.lenght) await this.$store.dispatch('faculty/getData');
	}
};
</script>
