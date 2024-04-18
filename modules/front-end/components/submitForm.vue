<template>
	<div class="w-100 h-100">
		<div
			class="black--text mt-10 mb-3 text-h4 font-weight-bold"
			style="text-align: center;"
		>
			Upload
		</div>

		<v-row
			v-for="(header, key) of headers"
			:key="key"
			class="w-100 align-center my-13 pr-10"
			no-gutters
		>
			<v-col cols="2" class="black--text text-h5 font-weight-regular mx-5">{{ header.text }}</v-col>

			<v-col>
				<v-textarea
					v-if="header.type === 'text-area'"
					v-model="form[header.value]"
					outlined
					filled
					light
					hide-details
					no-resize
				/>

				<v-file-input
					v-else-if="header.type === 'file'"
					v-model="form[header.value]"
					outlined
					filled
					light
					hide-details
					prepend-icon=""
					multiple
				/>

				<div v-else-if="header.type === 'slot'" class="black--text text-h5 font-weight-regular"> {{ $data[header.value] }} </div>

				<v-text-field
					v-else
					v-model="form[header.value]"
					outlined
					filled
					light
					hide-details
				/>
			</v-col>
		</v-row>

		<v-layout class="w-100" justify-center>
			<v-btn
				class="black--text white mx-5"
				@click="$router.back()"
			>
				Back
			</v-btn>

			<v-btn class="black--text white mx-5">
				{{ isUpdate ? 'Update' : 'Create' }}
			</v-btn>
		</v-layout>
	</div>
</template>

<script>
export default {
	name: 'SubmitForm',
	data () {
		return {
			headers: [
				{
					text: 'Name',
					value: 'name'
				},
				{
					text: 'Description',
					type: 'text-area',
					value: 'description'
				},
				{
					text: 'File Upload',
					type: 'file',
					value: 'files'
				},
				{
					text: 'Photo Upload',
					type: 'file',
					value: 'photos'
				},
				{
					text: 'Due date',
					type: 'slot',
					value: 'dueDate'
				}
			],
			btns: [
				{
					text: 'Create',
					action: this.create
				},
				{
					text: 'Update',
					action: this.update
				}
			],
			dueDate: 'TBD',
			form: {
				name: '',
				description: '',
				files: [],
				photos: []
			},
			isUpdate: false
		};
	},
	methods: {
		async create () {
			try {
				await console.log();
			} catch (err) {

			}
		},

		async update () {

		}
	}
};
</script>
