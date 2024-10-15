<template>
	<v-dialog v-model="dialog" width="40%">
		<template #activator="{ on, attrs}">
			<v-layout justify-end class="w-100">
				<v-btn
					v-on="on"
					v-bind="attrs"	
				>
					Create User
				</v-btn>
			</v-layout>
		</template>

		<v-card
			height="50%"
			class="ma-auto d-flex flex-column align-center rounded-xxl"
		>
			<v-card-title class="black--text text-h4 font-weight-bold mb-3">
				Sign Up
			</v-card-title>

			<v-card-text class="d-flex h-75 w-100">
				<v-form
					v-model="valid"
					ref="form"
					class="d-flex w-100"
				>
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
								v-for="(header, index) of selection"
								:key="index + 'selection'"
								v-model="form[header.value]"
								:label="header.label"
								disable-lookup
								outlined
								:items="header.items"
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
						:disabled="btn.type === 'submit' && !valid"
						plain
						text
						color="#ffffff"
						width="50%"
						class="black mx-2 rounded-lg"
						@click="btnClick(btn.type)"
					>
						{{ btn.text }}
					</v-btn>
				</v-layout>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
export default {
	data () {
		return {
			btns: [
				{
					type: "reset",
					text: "Cancel"
				},
				{
					type: "submit",
					text: "Register"
				}
			],
			roles: [
				{
					text: 'Guest',
					value: 'GUEST'
				},
				{
					text: 'Student',
					value: 'STUDENT'
				},
				{
					text: 'Marketing Manager',
					value: 'MARKETING_MANAGER'
				},
				{
					text: 'Marketing Coordinator',
					value: 'MARKETING_COORDINATOR'
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
						(text) => text?.length >= 4 ? !!text : "The password must be at least 8 character long."
					]
				},
				{
					label: "Retype Your Password",
					value: 'retypedPassword',
					type: 'password',
					rules: [
						this.required,
						(text) => text?.length >= 4 ? !!text : "The password must be at least 8 character long.",
						(text) => text === this.form.password || "The password does not match."
					]
				},
				{
					label: "Email",
					value: 'email',
					rules: [
						this.required,
						(text) => !!text?.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) || "Invaild email format."
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
				retypedPassword: '',
				role: ''
			},
			dialog: false
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
		},
		selection () {
			return [
				{
					label: 'Major',
					value: 'faculty',
					items: this.faculty
				},
				{
					label: 'Role',
					value: 'role',
					items: this.roles
				}
			]
		}
	},
	methods: {
		required (text) {
			return !!text || "This field is required.";
		},
		btnClick (type) {
			const form = {...this.form};

			if (type === 'submit') this.$emit('submit', form);
			this.$refs.form.reset();
			this.dialog = false;
		}
	}
}
</script>