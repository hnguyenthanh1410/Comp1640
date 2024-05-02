<template>
	<div :key="counter" class="w-100 h-100 d-flex flex-column flex">
		<div class="black--text mt-10 mb-3 text-h4 font-weight-bold" style="text-align: center;">
			Upload
		</div>

		<v-form
			enctype="multipart/form-data"
			:disabled="!$checkRole.isRole(['STUDENT']) && !!id"
			class="align-center d-flex flex-column"
		>
			<v-row v-for="(header, key) of headers" :key="key" class="w-100 align-center my-13 pr-10" no-gutters>
				<v-col cols="2" class="black--text text-h5 font-weight-regular mx-5">
					{{ header.text }}
				</v-col>

				<v-col class="d-flex">
					<v-textarea
						v-if="header.type === 'text-area'"
						v-model="form[header.value]"
						outlined
						filled
						hide-details
						no-resize
					/>

					<v-row v-else-if="header.type === 'file'" class="w-100 align-center">
						<v-col cols="11">
							<v-file-input
								v-model="form[header.value]"
								outlined
								filled
								hide-details
								prepend-icon=""
								multiple
								:accept="header.accept"
							/>
						</v-col>

						<v-col cols="1">
							<v-btn
								v-if="form[header.value].length"
								target="_black"
								class="mx-auto"
								@click="getFile(form[header.value]?.at(0))"
							>
								<v-icon>mdi-arrow-down</v-icon>
							</v-btn>
						</v-col>
					</v-row>

					<div v-else-if="header.type === 'slot'" class="black--text text-h5 font-weight-regular">
						{{ $data[header.value] }}
					</div>

					<v-text-field v-else v-model="form[header.value]" outlined filled hide-details />
				</v-col>
			</v-row>

			<v-row v-if="$checkRole.isRole(['STUDENT']) && id" class="w-100 px-3">
				<v-col cols="12" class="d-flex flex-column">
					<comment-feature
						v-model="form.extend.comment"
						:comments="post.comments"
						@updateChildComment="(payload) => childrenComment = payload"
					/>
				</v-col>
			</v-row>
		</v-form>

		<v-layout v-if="$checkRole.isRole(['STUDENT'])" class="w-100 my-5" justify-center align-center>
			<v-btn class="black--text white mx-5" @click="$router.back()">
				Back
			</v-btn>

			<v-btn class="black--text white mx-5" @click="id ? update() : create()">
				{{ id ? 'Update' : 'Create' }}
			</v-btn>
		</v-layout>

		<extended-feature
			v-if="$checkRole.isRole(['MARKETING_COORDINATOR'])"
			v-model="form.extend"
			:comments="post.comments"
			@update="update"
			@updateChildComment="(payload) => childrenComment = payload"
		/>
	</div>
</template>

<script>
import URI from 'urijs';

export default {
	name: 'SubmitForm',
	props: {
		id: {
			type: String,
			default: undefined
		}
	},
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
					value: 'files',
					accept: '.pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				},
				{
					text: 'Photo Upload',
					type: 'file',
					value: 'photos',
					accept: 'image/*'
				},
				{
					text: 'Due date',
					type: 'slot',
					value: 'dueDate'
				},
				{
					text: 'Status',
					type: 'slot',
					value: 'status'
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
			dueDate: 'Pending',
			form: {
				name: '',
				description: '',
				files: [],
				photos: [],
				extend: {
					status: undefined,
					comment: undefined
				}
			},
			post: {},
			childrenComment: [],
			counter: 0,
			status: 'Pending'
		};
	},
	async mounted () {
		if (!this.id) {
			return;
		}

		await this.fetchData();
	},
	methods: {
		async fetchData () {
			this.post = await this.$getData.fetch('http://localhost:8080/contribution/detail/' + this.$route.params.id);

			Object.keys(this.form).slice(0, 2).forEach((key) => this.form[key] = this.post[key]);

			const dueDate = new Date(this.post.period?.closureDate);
			this.form.extend.dueDate = dueDate.toLocaleDateString('en-CA');
			this.form.extend.status = this.post.status?.name;
			let files = this.post.files.map(async (file) => await fetch(file).then((r) => r.blob()).then((blob) => new File([blob], this.fileName(file), { type: blob.type })));
			files = await Promise.all(files);
			if (files.length) {
				this.form.photos.push(files[0]);
				this.form.files.push(files[1]);
			}

			this.dueDate = dueDate.toLocaleDateString('en-US');
			this.status = this.post.status.name;
		},

		async create () {
			const data = new FormData();
			this.form.photos.forEach((file) => {
				data.append('files', file);
			});
			this.form.files.forEach((file) => {
				data.append('files', file);
			});
			data.append('name', this.form.name);
			data.append('description', this.form.description);

			try {
				await this.$getData.fetch(
					'http://localhost:8080/contribution/create',
					data,
					'post',
					{
						"Content-Type": "multipart/form-data"
					}
				);

				this.$router.back();
			} catch (err) {

			}
		},

		async update () {
			const data = new FormData();
			this.form.photos.forEach((file) => {
				data.append('files', file);
			});
			this.form.files.forEach((file) => {
				data.append('files', file);
			});
			data.append('name', this.form.name);
			data.append('description', this.form.description);

			try {
				if (this.$checkRole.isRole(['STUDENT'])) {
					await this.$getData.fetch(
						'http://localhost:8080/contribution/update/' + this.id,
						data,
						'patch',
						{
							"Content-Type": "multipart/form-data"
						}
					);
				}

				if (this.form.extend.comment) {
					await this.$getData.fetch(
						'http://localhost:8080/comment/create',
						{
							contributionId: this.id,
							content: this.form.extend.comment
						},
						'post'
					);
				}

				if (this.childrenComment.length) {
					const promise = [];

					this.childrenComment.forEach((child) => {
						promise.push(
							this.$getData.fetch(
								'http://localhost:8080/comment/create',
								{
									contributionId: this.id,
									parentId: child.parentId,
									content: child.content
								},
								'post'
							)
						);
					});

					await Promise.all(promise);
				}

				if (this.form.extend.status) {
					this.$getData.fetch(
						'http://localhost:8080/contribution/set-status/' + this.id,
						{
							status: this.form.extend.status
						},
						'patch'
					);
				}

				await this.$store.dispatch('post/getData');
				this.counter += 1;
				await this.fetchData();
			} catch (err) {
				console.log(err);
			}
		},

		fileName (url) {
			if (url === null || typeof url === 'undefined') return '';
			const file = new URI(url).filename(); // File name with file extension
			return file.substring(0, file.lastIndexOf('.')); // Remove the extension
		},

		getFile (file) {
			if (!file) return;

			window.open(URL.createObjectURL(file), '_blank');
		}
	}
};
</script>

<style>
.flex * {
	min-width: 0;
	min-height: 0;
	flex-shrink: 1 !important;
}
</style>
