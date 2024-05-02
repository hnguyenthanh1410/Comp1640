<template>
	<client-only>
		<div>
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

			<v-btn
				v-if="$checkRole.isRole(['ADMIN'])"
				color="black"
				:ripple="false"
				to="/user"
				text
				class="transparent text-capitalize text-h6 font-weight-regular"
				plain
			>
				User
			</v-btn>

			<v-btn
				v-if="$checkRole.isRole(['ADMIN', 'MARKETING_MANAGER'])"
				color="black"
				:ripple="false"
				to="/download"
				text
				class="transparent text-capitalize text-h6 font-weight-regular"
				plain
			>
				Download
			</v-btn>

			<v-btn
				v-if="$checkRole.isRole(['ADMIN', 'MARKETING_MANAGER'])"
				color="black"
				:ripple="false"
				to="/post"
				text
				class="transparent text-capitalize text-h6 font-weight-regular"
				plain
			>
				Edit Post
			</v-btn>

			<v-btn
				v-if="$checkRole.isRole(['ADMIN'])"
				color="black"
				:ripple="false"
				to="/analytics"
				text
				class="transparent text-capitalize text-h6 font-weight-regular"
				plain
			>
				Analytics
			</v-btn>
		</div>
	</client-only>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
	name: 'FacultyNav',
	computed: {
		...mapFields('faculty', ['faculties']),
		headers () {
			return this.$checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR'])
				? this.faculties.filter((faculty) => faculty.name === this.$auth.user.faculty.name)
				: this.faculties;
		}
	},
	async mounted () {
		if (!this.faculties.lenght) await this.$store.dispatch('faculty/getData');
	}
};
</script>
