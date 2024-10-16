<template>
	<index-card height="50vh" width="50vw" index-class="ma-auto align-self-center">
		<v-card-title class="d-flex justify-center black--text text-h4 font-weight-bold">
			Reset Password
		</v-card-title>

		<v-card-text class="mx-auto w-50 h-75 d-flex align-center">
			<v-form v-model="valid" class="w-100" @submit.prevent>
				<v-text-field v-model="password" type="password" :rules="rules" placeholder="Enter your password" />
				<v-text-field v-model="rePassword" type="password" :rules="rules" placeholder="Re-enter your password" />
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-btn
				to="/"
				plain
				text
				color="#ffffff"
				class="black mx-2 rounded-lg"
			>
				Back
			</v-btn>

			<v-btn
				plain
				text
				color="#ffffff"
				class="black mx-2 rounded-lg"
				@click="forget"
			>
				Forgot Password
			</v-btn>
		</v-card-actions>
	</index-card>
</template>

<script>
export default {
	name: 'ForgotPasswordIndexPage',
	auth: 'guest',
	data () {
		return {
			valid: false,
			rules: [
				this.required,
				(text) => !!text?.length || 'Password need to be at least 4 digit long.'
			],
			password: undefined,
			rePassword: undefined
		};
	},
	methods: {
		required (text) {
			return !!text || 'This field is required';
		},
		async forget () {
			try {
				await this.$getData.fetch('http://localhost:8080/auth/reset-password', { password: this.password, rePassword: this.rePassword }, 'post');

				this.$router.push('/');
			} catch (error) {
				console.log(error);
			}
		}
	}
};
</script>
