<template>
	<v-dialog
		v-model="isDialog"
		width="50vw"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				class="font-weight-bold white"
				color="black"
				outlined
				plain
				text
				:ripple="false"
				v-on="on"
			>
				Delete
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="text-h4 font-weight-regular">
				Delete
			</v-card-title>

			<v-card-text class="text-h6 font-weight-regular">
				Do you want to delete this post
				<div class="font-weight-bold">
					{{ post.name }}
				</div>
				<div>All the information and file of the following post would be deleted and cannot be recover</div>
			</v-card-text>

			<v-card-actions>
				<v-btn
					plain
					text
					:ripple="false"
					@click="isDialog = false"
				>
					Cancel
				</v-btn>

				<v-btn
					color="white"
					class="red"
					plain
					text
					:ripple="false"
					@click="confirmDelete"
				>
					Delete
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'DeleteDialog',
	props: {
		post: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			isDialog: false
		};
	},
	methods: {
		async confirmDelete () {
			await this.$getData.fetch('http://localhost:8080/contribution/' + this.post.id, {}, 'delete');

			this.$emit('confirmDelete', this.post);
			this.isDialog = false;
		}
	}
};
</script>
