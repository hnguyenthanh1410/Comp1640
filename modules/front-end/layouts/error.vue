<template>
	<index-card height="30vh" width="20vw" index-class="ma-auto align-self-center">
		<v-layout flex-column justify-center align-center>
			<h1 v-if="error.statusCode === 404">
				{{ pageNotFound }}
			</h1>
			<h1>
				{{ otherError }}
			</h1>
			<NuxtLink to="/">
				Home page
			</NuxtLink>
		</v-layout>
	</index-card>
</template>

<script>
	export default {
		name: 'EmptyLayout',
		layout: 'empty',
		props: {
			error: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				pageNotFound: '404 Not Found',
				otherError: 'An error occurred'
			};
		},
		head() {
			const title =
				this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
			return {
				title
			};
		}
	};
</script>

<style scoped>
h1 {
	font-size: 20px;
}
</style>
