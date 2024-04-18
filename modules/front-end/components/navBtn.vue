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

		<div v-if="!$auth.loggedIn">
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
	mounted () {

	},
	methods: {
		async logout () {
			await this.$auth.logout();
		}
	}
};
</script>
