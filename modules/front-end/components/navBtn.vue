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

		<faculty-nav v-if="$auth.loggedIn || guestState" />
		
		<v-spacer />

		<div v-if="!$auth.loggedIn && !guestState">
			<v-btn
				v-for="(header, key) of headers"
				:key="key"
				color="black"
				:ripple="false"
				:to="header.link"
				text
				class="transparent text-capitalize text-h6 font-weight-regular"
				plain
			>
				{{ header.text }}
			</v-btn>
		</div>

		<v-btn
			v-else
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
	data () {
		return {
			headers: [
				{
					text: "Login",
					link: "/login"
				},
				{
					text: "Register",
					link: "/register"
				}
			]
		};
	},
	computed: {
		...mapFields('user', ['guestState'])
	},
	methods: {
		async logout () {
			if (!this.guestState) {
				await this.$auth.logout();
				return;
			}

			this.$store.dispatch('user/updateGuestState', false);
			this.$router.push('/');
		}
	}
};
</script>
