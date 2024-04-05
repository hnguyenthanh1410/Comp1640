<template>
	<v-layout>
		<v-btn
			v-for="(header, key) of headers"
			:key="key"
			:to="header.link"
			color="black"
			:ripple="false"
			text
			class="transparent text-capitalize"
			plain
			style="
			"
		>
			{{ header.text }}
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
					text: "Home",
					link: "/"
				},
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
	}
};
</script>

<style scoped>
a.v-btn:hover {
	background-color: white;
	font-weight: bold;
	color: rgb(41, 41, 120);
}

span.v-btn__content {
	text-decoration: none;
	color: black;
	border-right: 1px solid white;
	padding: 10px;
	font-size: 14px;
}
</style>
