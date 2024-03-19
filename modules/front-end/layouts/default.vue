<template>
	<v-app>
		<v-app-bar
			elevate-on-scroll
			app
			color="#2b3494"
			max-height="42"
			height="42"
		>
			<v-icon class="mx-8">
				mdi-link
			</v-icon>
			<v-spacer />
			<v-btn class="mx-8">
				Login
			</v-btn>
		</v-app-bar>

		<v-main>
			<v-container fluid class="h-100 mx-0 pa-0">
				<Nuxt />
			</v-container>
		</v-main>

		<v-footer color="#2b3494" style="height: 30vh;" />
	</v-app>
</template>

<script>
export default {
	name: 'DefaultLayout',
	data () {
		return {
		};
	},
	mounted () {
		document.documentElement.id = 'window';
	}
};
</script>
<style>
html {
	scroll-snap-type: y proximity;
	overflow: scroll;
}
</style>
