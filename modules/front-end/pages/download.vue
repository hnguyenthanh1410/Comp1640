<template>
	<index-card index-class="ma-auto align-self-center">
		<v-card-title class="text-h4 font-weight-bold" style="text-align: center;">
			Download contribution
		</v-card-title>
		<v-card-text class="pa-3">
			<v-data-table
				:headers="headers"
				:items="posts"
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
					<v-checkbox
						v-model="form"
						:value="item.id"
					/>
				</template>

				<template #[`item.author`]="{ value }">
					{{ value?.faculty?.name }}
				</template>
			</v-data-table>
		</v-card-text>

		<v-card-actions>
			<v-btn
				dark
				elevation="15"
				class="rounded-lg mb-5"
				@click="downloadAndZip()"
			>
				Download
			</v-btn>
		</v-card-actions>
	</index-card>
</template>

<script>
import Promise from 'bluebird';
import JsZip from 'jszip';
import FileSaver from 'file-saver';

export default {
	name: 'DownloadPage',
	data () {
		return {
			posts: [],
			headers: [
				{
					text: 'ID',
					value: 'id',
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
			form: []
		};
	},
	async mounted () {
		this.posts = await this.$getData.fetch('http://localhost:8080/contribution/approved-contribution-list/');
	},
	methods: {
		downloadAndZip () {
			const form = this.form.map((id) => {
				const post = this.posts.find((post) => post.id === id);
				return post.files[1];
			});
			return this.downloadByGroup(form, 5).then(this.exportZip);
		},

		exportZip (blobs) {
			console.log(blobs);
			const zip = JsZip();
			blobs.forEach((blob) => {
				zip.file(blob.fileName, blob.blob);
			});
			zip.generateAsync({ type: 'blob' }).then(zipFile => {
				const currentDate = new Date().getTime();
				const fileName = `combined-${currentDate}.zip`;
				return FileSaver.saveAs(zipFile, fileName);
			});
		},

		download (url) {
			return fetch(url).then(resp => resp.blob());
		},

		downloadByGroup (urls, filesPerGroup) {
			return Promise.map(
				urls,
				async url => {
					const splitString = url.split('/');
					
					const fileName = splitString[splitString.length - 1].split('?')[0];

					return {
						blob: await this.download(url),
						fileName
					};
				},
				{ concurrency: filesPerGroup }
			);
		}
	}
};
</script>
