<template>
	<v-layout>
		<v-btn
			v-for="(header, key) of faculties"
			:key="key"
			color="black"
			:ripple="false"
			:to="'/faculty/' + header.slug"
			text
			class="transparent text-capitalize"
			plain
		>
			{{ header.name }}
		</v-btn>
	</v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
	name: 'FacultyNav',
	computed: {
		...mapFields('faculty', ['faculties'])
	},
	async mounted () {
		await this.$store.dispatch('faculty/getData');
	}
};
</script>
