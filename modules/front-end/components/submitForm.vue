<template>
	<div class="w-100 h-100 d-flex flex-column flex">
		<div
			class="black--text mt-10 mb-3 text-h4 font-weight-bold"
			style="text-align: center;"
		>
			Upload
		</div>

		<v-form enctype="multipart/form-data" :disabled="!$checkRole.isRole(['STUDENT']) && !!id" class="align-center d-flex flex-column">
			<v-row
				v-for="(header, key) of headers"
				:key="key"
				class="w-100 align-center my-13 pr-10"
				no-gutters
			>
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

					<v-file-input
						v-else-if="header.type === 'file'"
						v-model="form[header.value]"
						outlined
						filled
						hide-details
						prepend-icon=""
						multiple
					/>

					<div v-else-if="header.type === 'slot'" class="black--text text-h5 font-weight-regular">
						{{ $data[header.value] }}
					</div>

					<v-text-field
						v-else
						v-model="form[header.value]"
						outlined
						filled
						hide-details
					/>
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

		<v-layout
			v-if="$checkRole.isRole(['STUDENT'])"
			class="w-100 my-5"
			justify-center
			align-center
		>
			<v-btn
				class="black--text white mx-5"
				@click="$router.back()"
			>
				Back
			</v-btn>

			<v-btn
				class="black--text white mx-5"
				@click="id ? update() : create()"
			>
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
import _ from 'lodash';

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
			dueDate: 'Pending',
			form: {
				name: '',
				description: '',
				files: [],
				photos: [],
				extend: {
					dueDate: undefined,
					status: undefined,
					comment: undefined
				}
			},
			post: {},
			childrenComment: []
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

			this.dueDate = dueDate.toLocaleDateString('en-US');
		},

		async create () {
			const extended = _.cloneDeep(this.form.extend);
			// const docs = this.form.files;
			// const photos = this.form.photos;
			// delete this.form.files;
			// delete this.form.photos;

			Object.keys(this.form.extend).forEach((key) => this.form.extend[key] = undefined);

			try {
				await this.$getData.fetch(
					'http://localhost:8080/contribution/create',
					{
						...this.form,
						dueDate: extended.dueDate
						// files: [
						// 	...photos,
						// 	...docs
						// ]
					},
					'post'
					// {
					// 	"Content-Type": "multipart/form-data"
					// }
				);

				this.$router.back();
			} catch (err) {

			}
		},

		async update () {
			const extended = _.cloneDeep(this.form.extend);
			// const docs = this.form.files;
			// const photos = this.form.photos;
			// delete this.form.files;
			// delete this.form.photos;

			Object.keys(this.form.extend).forEach((key) => this.form.extend[key] = undefined);

			try {
				await this.$getData.fetch(
					'http://localhost:8080/contribution/update/' + this.id,
					{
						...this.form,
						dueDate: extended.dueDate
						// files: [
						// 	...photos,
						// 	...docs
						// ]
					},
					'patch'
					// {
					// 	"Content-Type": "multipart/form-data"
					// }
				);

				if (extended.comment) {
					await this.$getData.fetch(
						'http://localhost:8080/comment/create',
						{
							contributionId: this.id,
							content: extended.comment
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

				await this.$store.dispatch('post/getData');
				this.$nuxt.refresh();
				await this.fetchData();
			} catch (err) {
				console.log(err);
			}
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
