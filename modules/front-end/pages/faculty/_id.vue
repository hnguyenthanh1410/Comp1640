<template>
	<v-card
		v-if="loading"
		width="95vw"
		color="white"
		:height="posts.length ? undefined : '85%'"
		class="ma-auto align-self-center"
	>
		<v-card-title
			class="black--text text-h3"
		>
			<v-row class="mt-6" no-gutters>
				<v-spacer />

				<v-col cols="6" style="text-align: center;">
					{{ title }}
				</v-col>

				<v-col cols="3" class="d-flex justify-end align-center">
					<v-btn
						v-if="$checkRole.isRole(['STUDENT'])"
						dark
						:ripple="false"
						class="mr-5"
						@click="$router.push('/upload')"
					>
						Create
					</v-btn>

					<set-closure-date v-if="$checkRole.isRole(['ADMIN'])" />
				</v-col>
			</v-row>
		</v-card-title>

		<post-card :posts="posts" />

		<v-card-actions v-if="$checkRole.isRole(['ADMIN'])" class="d-flex justify-end align-center">
			Currently {{ title.toLowerCase() }} has {{ posts.length }}
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import { mapGetters } from 'vuex';

export default {
	name: 'PostPage',
	layout: 'post',
	middleware: ['faculty'],
	auth: false,
	data () {
		return {
			title: '',
			loading: false
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

		this.loading = true;
	}
};
</script>
