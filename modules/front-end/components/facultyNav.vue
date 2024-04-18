<template>
	<v-layout>
		<v-btn
			v-for="(header, key) of headers"
			:key="key"
			color="black"
			:ripple="false"
			:to="'/faculty/' + header.slug"
			text
			class="transparent text-capitalize text-h6 font-weight-regular"
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
		...mapFields('faculty', ['faculties']),
		headers () {
			return this.$checkRole.isRole(['STUDENT'])
				? this.faculties.filter((faculty) => faculty.name === this.$auth.user.faculty.name)
				: this.faculties;
		}
	},
	async mounted () {
		if (!this.faculties.lenght) await this.$store.dispatch('faculty/getData');
	}
};
</script>
