<template>
	<v-layout class="h-100">
		<v-card
			width="95vw"
			color="white"
			class="mx-auto my-auto align-self-center"
		>
			<div
				class="black--text text-h3 mt-3"
				style="text-align: center;"
			>
				{{ title }}
			</div>

			<post-card :posts="posts" />
		</v-card>
	</v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
export default {
	name: 'PostPage',
	layout: 'post',
	middleware: ['faculty'],
	data () {
		return {
			title: ''
		};
	},
	computed: {
		...mapFields('faculty', ['faculties']),
		...mapFields('post', ['posts'])
	},
	async mounted () {
		if (!this.faculties.lenght) await this.$store.dispatch('faculty/getData');
		this.faculties.forEach((faculty) => {
			if (this.$route.params.id && this.$route.params.id === faculty.slug) {
				this.title = faculty.name;
			}
		});

		await this.$store.dispatch('post/getData');
	}
};
</script>
