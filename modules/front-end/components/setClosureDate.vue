<template>
	<v-dialog
		v-model="isDialog"
		width="50vw"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				class="font-weight-bold closure-btn"
				:class="$vuetify.breakpoint.mdAndDown ? 'ma-0' : 'mr-5'"
				:width="$vuetify.breakpoint.mdAndDown ? '80%' : undefined"
				:height="$vuetify.breakpoint.smAndDown ? '80%' : undefined"
				dark
				:ripple="false"
				style="text-wrap: auto;"
				v-on="on"
			>
				Set Closure Date
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="text-h4 font-weight-regular">
				Delete
			</v-card-title>

			<v-card-text class="text-h6 font-weight-regular">
				<v-form v-model="valid">
					<v-text-field
						v-for="(header, key) of Object.keys(form)"
						:key="key"
						v-model="form[header]"
						type="date"
						:rules="[
							(value) => !!value || 'Please select the date'
						]"
					/>
				</v-form>
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
					plain
					text
					:ripple="false"
					:disabled="!valid"
					@click="confirmDelete"
				>
					Set
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'DeleteDialog',
	data () {
		return {
			isDialog: false,
			form: {
				closureDate: '',
				finalClosureDate: ''
			},
			valid: false
		};
	},
	methods: {
		async confirmDelete () {
			await this.$getData.fetch(
				'http://localhost:8080/period/create',
				{
					...this.form,
					year: new Date(this.form.finalClosureDate).getFullYear()
				},
				'post'
			);

			this.$emit('confirmDelete');
			this.isDialog = false;
		}
	}
};
</script>

<style>
.closure-btn > span {
	width: 100%;
	text-wrap: balance;
}
</style>
