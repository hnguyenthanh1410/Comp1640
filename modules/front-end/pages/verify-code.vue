<template>
	<index-card height="45vh" width="40vw" index-class="ma-auto align-self-center">
		<v-card-title class="d-flex justify-center black--text text-h4 font-weight-bold">
			Verify Code
		</v-card-title>

		<v-card-text class="h-75 d-flex align-center">
			<v-form v-model="valid" @submit.prevent>
				<v-otp-input v-model="code" type="number" :rules="required" />
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
				@click="verify"
			>
				Verify
			</v-btn>
		</v-card-actions>
	</index-card>
</template>

<script>
import { toInteger } from 'lodash';

export default {
	name: 'VerifyResetCodePage',
	auth: 'guest',
	data () {
		return {
			valid: false,
			code: undefined
		};
	},
	methods: {
		required (text) {
			return !!text || 'This field is required';
		},
		async verify () {
			try {
				await this.$getData.fetch('http://localhost:8080/auth/check-code', { code: toInteger(this.code) }, 'post');

				this.$router.push('/reset-password');
			} catch (error) {
				console.log(error);
			}
		}
	}
};
</script>
