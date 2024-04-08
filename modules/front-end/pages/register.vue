<template>
	<v-layout class="pa-0 justify-center align-center h-100">
		<v-card
			color="white"
			width="70vh"
			height="78vh"
			class="d-flex flex-column align-center rounded-xl"
		>
			<div
				class="black--text text-h4 mt-6 font-weight-bold mb-3"
			>
				Sign In
			</div>

			<v-form
				v-model="valid"
				class="d-flex flex-column align-center w-100"
				@submit.prevent="submit"
			>
				<v-card
					class="d-flex pl-5 align-center"
					color="transparent"
					height="63vh"
					width="100%"
					flat
				>
					<v-layout column style="width: 55%">
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

						<v-select
							label="Your Major"
							disable-lookup
							light
							outlined
							:items="faculty"
							:rules="[required]"
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
		</v-card>
	</v-layout>
</template>

<script>
import axios from 'axios';
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
					text: "Register"
				}
			],
			headers: [
				{
					label: "First Name",
					value: "firstName",
					rules: [this.required]
				},
				{
					label: "Last Name",
					value: "lastName",
					rules: [this.required]
				},
				{
					label: "Username",
					value: "username",
					rules: [this.required]
				},
				{
					label: "Password",
					value: 'password',
					type: 'password',
					rules: [
						this.required,
						(text) => text.length >= 8 ? !!text : "The password must be at least 8 character long."
					]
				},
				{
					label: "Retype Your Password",
					value: 'retypedPassword',
					type: 'password',
					rules: [
						this.required,
						(text) => text.length >= 8 ? !!text : "The password must be at least 8 character long.",
						(text) => text === this.form.password || "The password does not match."
					]
				},
				{
					label: "Email",
					value: 'email',
					rules: [
						this.required,
						(text) => !!text.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) || "Invaild email format."
					]
				}
			],
			faculty: [
				{
					text: "Information Technology",
					value: "it"
				},
				{
					text: "Business",
					value: "business"
				},
				{
					text: "Graphic Design",
					value: "graphicDesign"
				},
				{
					text: "Marketing",
					value: "marketing"
				}
			],
			valid: false,
			form: {
				email: '',
				password: '',
				username: '',
				firstName: '',
				lastName: '',
				faculty: '',
				retypedPassword: ''
			}
		};
	},
	methods: {
		required (text) {
			return !!text || "This field is required.";
		},
		async submit () {
			try {
				await axios({
					url: "http://localhost:8080/auth/create-user",
					method: "post",
					data: {
						...this.form
					}
				});
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>