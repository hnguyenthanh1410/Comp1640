<template>
	<v-layout class="pa-0 justify-center align-center h-100">
		<index-card
			width="35vw"
			height="40vh"
		>
			<div class="black--text text-h4 mt-6 mb-4 font-weight-bold">
				Sign In
			</div>

			<v-form
				v-model="valid"
				class="d-flex flex-column align-center w-100"
				@submit.prevent="submit"
			>
				<v-card
					class="d-flex pl-5"
					color="transparent"
					height="25vh"
					flat
				>
					<v-layout column>
						<v-text-field
							v-for="(header, key) of headers"
							:key="key"
							v-model="form[header.value]"
							:type="header.type || 'text'"
							:label="header.label"
							:rules="header.rules"
							light
							outlined
						/>
					</v-layout>

					<v-img
						:src="require('~/assets/img/logo.png')"
						width="45%"
						contain
						max-height="75%"
					/>
				</v-card>
				
				<v-layout justify-center>
					<v-btn
						v-for="(btn, key) of btns"
						:key="key"
						:type="btn.type"
						:ripple="false"
						:to="btn.link"
						:disabled="btn.type === 'submit' && !valid"
						plain
						text
						color="#ffffff"
						width="50%"
						class="black mx-2 rounded-lg"
					>
						{{ btn.text }}
					</v-btn>
				</v-layout>
			</v-form>
		</index-card>
	</v-layout>
</template>

<script>
export default {
	name: 'LoginPage',
	auth: 'guest',
	data () {
		return {
			btns: [
				{
					type: "button",
					text: "Back",
					link: "/"
				},
				{
					type: "submit",
					text: "Login"
				}
			],
			headers: [
				{
					label: "Username",
					value: 'username',
					rules: [
						this.required
					]
				},
				{
					label: "Password",
					value: 'password',
					type: 'password',
					rules: [
						this.required,
						(text) => text.length >= 8 ? !!text : "The password must be at least 8 character long."
					]
				}
			],
			valid: false,
			form: {
				username: '',
				password: ''
			}
		};
	},
	methods: {
		required (text) {
			return !!text || "This field is required.";
		},
		async submit () {
			try {
				await this.$auth.login(this.form);
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>
