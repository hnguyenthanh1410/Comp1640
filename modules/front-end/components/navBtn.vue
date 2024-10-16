<template>
	<v-layout>
		<v-btn
			color="black"
			:ripple="false"
			to="/"
			text
			class="transparent text-capitalize text-h6 font-weight-regular"
			plain
		>
			Home
		</v-btn>

		<faculty-nav v-if="$auth.loggedIn" />
		
		<v-spacer />

		<v-btn
			v-if="$auth.loggedIn"
			color="black"
			:ripple="false"
			text
			class="transparent text-capitalize text-h6 font-weight-regular"
			plain
			@click="logout"
		>
			Log out
		</v-btn>
	</v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
	name: "NavBtn",
	computed: {
		...mapFields('user', ['guestState'])
	},
	methods: {
		async logout () {
			if (!this.guestState) {
				await this.$auth.logout();
				this.$router.push('/');
				return;
			}

			this.$store.dispatch('user/updateGuestState', false);
			this.$router.push('/');
		}
	}
};
</script>
