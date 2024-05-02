<template>
	<v-layout class="pa-0 justify-center align-center h-100">
		<index-card
			:index-class="{
				'index-card': $vuetify.breakpoint.mdAndDown
			}"
		>
			<v-card-title style="text-align: center;" class="text-h3 font-weight-regular">
				User
			</v-card-title>

			<v-card-text class="pa-3">
				<v-data-table
					:headers="headers"
					:items="users"
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

							<v-card>
								<delete-dialog :user="item" @confirmDelete="fetchUser" />
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
	middleware ({ $checkRole, redirect }) {
		if (!$checkRole.isRole(['ADMIN'])) {
			redirect('/');
		}
	},
	data () {
		return {
			headers: [
				{
					text: 'ID',
					value: 'id',
					class: 'rounded-tl-xxl',
					sortable: false
				},
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
			]
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
		}
	}
};
</script>
