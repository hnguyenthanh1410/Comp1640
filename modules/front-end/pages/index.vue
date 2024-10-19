<template>
	<index-card
		width="35vw"
		:height="!valid && (form.username || form.password) ? '60%' : '40%'"
		index-class="ma-auto align-self-center"
	>
		<v-card-title class="black--text text-h4 font-weight-bold">
			Sign In
		</v-card-title>

		<v-card-text class="my-auto">
			<v-form
				v-model="valid"
				class="d-flex flex-column align-center w-100"
				@submit.prevent
			>
				<v-row class="d-flex flex-shrink-1 w-100">
					<v-col cols="6" class="d-flex align-center">
						<v-layout column class="h-100" justify-center>
							<v-text-field
								v-for="(header, key) of headers"
								:key="key"
								v-model="form[header.value]"
								:type="header.type || 'text'"
								:label="header.label"
								:rules="header.rules"
								outlined
								dense
								hide-details="auto"
							/>
						</v-layout>
					</v-col>

					<v-col cols="6">
						<v-img
							src="/img/logo.png"
							contain
						/>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-layout flex-column justify-center align-center>
				<v-btn
					v-for="(btn, key) of btns"
					:key="key"
					:ripple="false"
					:to="btn.link"
					:disabled="btn.type === 'submit' && !valid"
					plain
					text
					:color="btn.type === 'submit' ? '#ffffff' : 'black'"
					class="mx-2 rounded-lg"
					:class="{
						'black': btn.type === 'submit'
					}"
					@click="btn.type === 'submit' && submit()"
				>
					{{ btn.text }}
				</v-btn>
			</v-layout>
		</v-card-actions>
	</index-card>
</template>

<script>
export default {
	name: 'LoginPage',
	auth: 'guest',
	data () {
		return {
			btns: [
				{
					type: 'submit',
					text: "Login"
				},
				{
					text: "Forgot Password",
					link: "/forgot-password"
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
						(text) => text.length >= 4 ? !!text : "The password must be at least 4 character long."
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
				await this.$auth.login({ data: this.form });
			} catch (err) {
				this.$store.dispatch('snackbar/push', {
					type: 'error',
					message: err.message
				})
			}
		}
	}
};
</script>
