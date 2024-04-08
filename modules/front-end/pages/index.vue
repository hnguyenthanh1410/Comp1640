<template>
	<v-layout class="pa-0 justify-center align-center h-100">
		<index-card
			width="40vw"
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
				:src="require('~/assets/img/logo.png')"
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
				class="black my-2 rounded-lg"
			>
				{{ header.text }}
			</v-btn>
		</index-card>
	</v-layout>
</template>

<script>
export default {
	name: 'IndexPage',
	auth: 'guest',
	data () {
		return {
			headers: [
				{
					text: "Sign in with email",
					link: "/login"
				},
				{
					text: "Guest",
					link: "/guest"
				},
				{
					text: "Register",
					link: "/register"
				}
			]
		};
	}
};
</script>

<style scoped>
.index-card > * {
	flex: 0 auto;
}
</style>
