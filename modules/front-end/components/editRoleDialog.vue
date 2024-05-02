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
				Edit
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="text-h4 font-weight-regular">
				Edit
			</v-card-title>

			<v-card-text class="text-h6 font-weight-regular">
				<v-row class="w-100 align-center">
					<v-col cols="3">
						<div>Choose desire role: </div>
					</v-col>
					<v-col cols="9">
						<v-form>
							<v-select v-model="form" :items="role" />
						</v-form>
					</v-col>
				</v-row>
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
					@click="confirmUpdate"
				>
					Update
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'DeleteDialog',
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			isDialog: false,
			role: [],
			form: undefined
		};
	},
	async mounted () {
		this.role = (await this.$getData.fetch('http://localhost:8080/role/list')).map((role) => {
			return {
				text: role?.description.toUpperCase(),
				value: role?.name
			};
		});
		console.log(this.role, this.user);
	},
	methods: {
		async confirmUpdate () {
			await this.$getData.fetch('http://localhost:8080/user/update-role/' + this.user.id, {
				roleName: this.form
			}, 'patch');
			this.isDialog = false;
			this.$emit('update');
		}
	}
};
</script>
