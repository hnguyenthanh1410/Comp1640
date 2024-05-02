<template>
	<index-card index-class="ma-auto align-self-center">
		<v-card-title class="text-h4 font-weight-bold" style="text-align: center;">
			Delete contribution
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
				:items="posts"
				:search="search"
				height="undefined"
				width="undefined"
				class="ma-auto w-100 datatable elevation-10 rounded-xxl"
				fixed-header
			>
				<template #[`item.link`]="{ item }">
					<v-btn
						color="black"
						text
						plain
						:to="'/viewPost/' + item.id"
						class="text-capitalize mx-auto"
					>
						Go to Post
					</v-btn>
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
							<delete-post-dialog :post="item" @confirmDelete="deleteContribution" />
						</v-card>
					</v-menu>
				</template>

				<template #[`item.author`]="{ value }">
					{{ value?.faculty?.name }}
				</template>
			</v-data-table>
		</v-card-text>
	</index-card>
</template>

<script>
export default {
	name: 'DownloadPage',
	data () {
		return {
			posts: [],
			headers: [
				{
					text: 'Name',
					value: 'name',
					class: 'rounded-tl-xxl',
					sortable: false
				},
				{
					text: 'Link to post',
					value: 'link',
					sortable: false
				},
				{
					text: 'Faculty',
					value: 'author',
					sortable: false
				},
				{
					text: 'Actions',
					value: 'slot',
					class: 'rounded-tr-xxl',
					sortable: false
				}
			],
			form: [],
			search: undefined
		};
	},
	async mounted () {
		await this.fetchPost();
	},
	methods: {
		async fetchPost () {
			this.posts = await this.$getData.fetch('http://localhost:8080/contribution/approved-contribution-list/');
		},
		async deleteContribution (contribution) {
			await this.$getData.fetch(
				'http://localhost:8080/contribution/delete',
				{
					id: contribution.id
				},
				'delete'
			);

			await this.fetchPost();
		}
	}
};
</script>
