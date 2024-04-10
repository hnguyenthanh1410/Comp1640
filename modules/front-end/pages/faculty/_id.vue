<template>
	<v-layout class="h-100">
		<v-card
			width="95vw"
			height="90%"
			color="white"
			class="mx-auto align-self-center"
		>
			<div
				class="black--text text-h3 mt-3"
				style="text-align: center;"
			>
				{{ title }}
			</div>
		</v-card>
	</v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
export default {
	name: 'PostPage',
	data () {
		return {
			title: ''
		};
	},
	computed: {
		...mapFields('faculty', ['faculties'])
	},
	mounted () {
		this.faculties.forEach((faculty) => {
			if (this.$route.params.id === faculty.slug) {
				this.title = faculty.name;
			}
		});
	}
};
</script>
