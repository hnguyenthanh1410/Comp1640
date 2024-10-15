<template>
	<v-layout class="pa-0 justify-center align-center h-100">
		<index-card
			:index-class="{
				'index-card': $vuetify.breakpoint.mdAndDown
			}"
		>
			<v-card-title style="text-align: center;" class="text-h3 font-weight-regular d-flex flex-column w-100 justify-center">
				User

				<dialog-create-user @submit="createUser"/>
			</v-card-title>

			<v-card-text class="pa-3">
				<v-text-field
					v-model="search"
					append-icon="mdi-magnify"
					label="Search"
					single-line
					hide-details
					class="my-5 px-5"
				/>

				<v-data-table
					:headers="headers"
					:items="users"
					:search="search"
					height="undefined"
					width="undefined"
					class="ma-auto w-100 datatable elevation-10 rounded-xxl"
					fixed-header
				>
					<template #[`item.role`]="{ value }">
						{{ value.description }}
					</template>

					<template #[`item.slot`]="{ item }">
						<v-menu>
							<template #activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									color="black"
									text
									plain
									v-on="on"
								>
									<v-icon>mdi-dots-horizontal</v-icon>
								</v-btn>
							</template>

							<v-card class="d-flex flex-column">
								<delete-dialog :user="item" @confirmDelete="fetchUser" />

								<edit-role-dialog :user="item" @update="fetchUser" />
							</v-card>
						</v-menu>
					</template>

					<template #[`item.faculty`]="{ value }">
						{{ value?.name }}
					</template>
				</v-data-table>
			</v-card-text>
		</index-card>
	</v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
	name: "UserPage",
	layout: 'post',
	middleware ({ $checkRole, redirect }) {
		if (!$checkRole.isRole(['ADMIN'])) {
			redirect('/');
		}
	},
	data () {
		return {
			headers: [
				{
					text: 'First Name',
					value: 'firstName',
					sortable: false
				},
				{
					text: 'Last Name',
					value: 'lastName',
					sortable: false
				},
				{
					text: 'Username',
					value: 'username',
					sortable: false
				},
				{
					text: 'Email',
					value: 'email',
					sortable: false
				},
				{
					text: 'Role',
					value: 'role',
					sortable: false
				},
				{
					text: 'Faculty',
					value: 'faculty',
					sortable: false
				},
				{
					text: 'Actions',
					value: 'slot',
					class: 'rounded-tr-xxl',
					sortable: false
				}
			],
			search: undefined
		};
	},
	computed: {
		...mapFields('user', ['users'])
	},
	async mounted () {
		await this.fetchUser();
	},
	methods: {
		async fetchUser () {
			await this.$store.dispatch('user/getData');
		},
		async createUser (user) {
			try {
				await this.$getData.fetch("http://localhost:8080/auth/create-user",{ data: user }, 'post');

				await this.fetchUser()
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>
