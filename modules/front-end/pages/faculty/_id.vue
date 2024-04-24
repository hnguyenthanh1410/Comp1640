<template>
	<v-card
		width="95vw"
		color="white"
		:height="posts.length ? undefined : '85%'"
		class="ma-auto align-self-center"
	>
		<v-card-title
			class="black--text text-h3"
		>
			<div class="pt-5 mx-auto"> {{ title }} </div>
		</v-card-title>

		<post-card v-if="loading" :posts="posts" />
	</v-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import { mapGetters } from 'vuex';

export default {
	name: 'PostPage',
	layout: 'post',
	middleware: ['faculty'],
	auth: 'guest',
	data () {
		return {
			title: '',
			loading: true
		};
	},
	computed: {
		...mapFields('faculty', ['faculties']),
		...mapFields('post', ['posts']),
		...mapGetters({
			getFacultyBySlug: 'faculty/getFacultyBySlug'
		})
	},
	async mounted () {
		this.title = this.getFacultyBySlug(this.$route.params.id).name;

		await this.$store.dispatch('post/getData');
	}
};
</script>
