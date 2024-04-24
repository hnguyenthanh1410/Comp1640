<template>
	<v-layout class="pa-0 justify-center align-center h-100">
		<index-card
			width="30vw"
			height="55vh"
			:index-class="{
				'index-card': $vuetify.breakpoint.mdAndDown
			}"
		>
			<div
				class="black--text text-h5 font-weight-regular mt-3"
				style="text-align: center;"
			>
				Please choose your method of login
			</div>

			<v-img
				src="/img/logo.png"
				width="100%"
				contain
				max-height="55%"
				class="mb-3"
			/>

			<v-btn
				v-for="(header, key) of headers"
				:key="key"
				:ripple="false"
				:to="header.link"
				plain
				text
				color="#ffffff"
				width="60%"
				class="black my-2 rounded-lg text-capitalize"
				@click="header.actions"
			>
				{{ header.text }}
			</v-btn>
		</index-card>
	</v-layout>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
	name: 'IndexPage',
	auth: 'guest',
	middleware ({ store, redirect }) {
		console.log(store.state.user);
		if (store.state.user.guestState) redirect('/faculty/' + store.state.faculty.faculties[0].slug);
	},
	data () {
		return {
			headers: [
				{
					text: "Sign in with username",
					link: "/login"
				},
				{
					text: "Guest",
					actions: this.toggleState
				},
				{
					text: "Register",
					link: "/register"
				}
			]
		};
	},
	computed: {
		...mapFields('user', ['guestState']),
		...mapFields('faculty', ['faculties'])
	},
	methods: {
		toggleState () {
			this.$store.dispatch('user/updateGuestState', !this.guestState);

			this.$router.push('/faculty/' + this.faculties[0].slug);
		}
	}
};
</script>

<style scoped>
.index-card > * {
	flex: 0 auto;
}
</style>
