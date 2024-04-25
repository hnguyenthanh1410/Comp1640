<template>
	<index-card width="40vw" height="70vh" index-class="ma-auto align-self-center">
		<v-card-title class="black--text text-h4 font-weight-bold mb-3">
			Sign In
		</v-card-title>

		<v-card-text class="d-flex h-75">
			<v-form v-model="valid" class="d-flex" @submit.prevent="submit">
				<v-row class="h-100">
					<v-col
						cols="6"
						class="d-flex flex-column col"
					>
						<v-text-field
							v-for="(header, key) of headers"
							:key="key"
							v-model="form[header.value]"
							:type="header.type || 'text'"
							:label="header.label"
							:rules="header.rules"
							outlined
						/>

						<v-select
							v-model="form.faculty"
							label="Your Major"
							disable-lookup
							outlined
							:items="faculty"
							:rules="[required]"
						/>
					</v-col>

					<v-col cols="6" class="d-flex align-center">
						<v-img src="/img/logo.png" contain />
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>

		<v-card-actions>
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
		</v-card-actions>
	</index-card>
</template>

<script>
import axios from 'axios';
import { mapFields } from 'vuex-map-fields';
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
						(text) => text.length >= 4 ? !!text : "The password must be at least 8 character long."
					]
				},
				{
					label: "Retype Your Password",
					value: 'retypedPassword',
					type: 'password',
					rules: [
						this.required,
						(text) => text.length >= 4 ? !!text : "The password must be at least 8 character long.",
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
	computed: {
		...mapFields('faculty', ['faculties']),
		faculty () {
			const faculty = [];

			this.faculties?.forEach((f) => {
				faculty.push({
					text: f.name,
					value: f.name
				});
			});

			return faculty;
		}
	},
	methods: {
		required (text) {
			return !!text || "This field is required.";
		},
		async submit () {
			try {
				const user = await axios({
					url: "http://localhost:8080/auth/create-user",
					method: "post",
					data: this.form
				});

				this.$auth.setUserToken(user.data.accessToken, user.data.refreshToken);
				this.$auth.fetchUser();
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>

<style>
.col * {
	min-width: 0;
	min-height: 0;
}
</style>
