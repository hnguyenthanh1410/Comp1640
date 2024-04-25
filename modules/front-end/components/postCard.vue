<template>
	<v-layout
		column
		class="w-100"
		:class="{
			'h-100': mode === 'viewDetail'
		}"
	>
		<v-layout
			v-if="!posts.length"
			align-center
			justify-center
			column
			class="black--text"
			:style="{
				'height': $vuetify.breakpoint.xs ? '40vh' : ($vuetify.breakpoint.mdAndDown ? '35vh' : '80vh')
			}"
		>
			<div class="text-h4 font-weight-bold">
				No Post
			</div>
					
			<div>No post in {{ getFacultyBySlug($route.params.id)?.name }} was found.</div>
		</v-layout>

		<div
			v-else
			:class="{
				'px-10': mode !== 'viewDetail',
				'ma-auto': mode === 'viewDetail',
			}"
		>
			<v-card
				v-for="(post, key) of posts"
				:key="key"
				:width="width"
				:height="height"
				
				class="d-flex flex-column"
				:class="{
					'my-5': posts.length !== key + 1 && mode !== 'viewDetail',
					'mt-5': posts.length === key + 1 && mode !== 'viewDetail'
				}"
				:ripple="false"
				@click="push(post.status?.name, post.id, post.period)"
			>
				<v-card-title class="black--text text-h5 font-weight-bold">
					<v-btn
						v-if="mode === 'viewDetail'"
						color="black"
						class="font-weight-black"
						outlined
						plain
						text
						:ripple="false"
						@click="$router.back()"
					>
						<v-icon>mdi-arrow-left</v-icon>
					</v-btn>

					<div
						:class="{
							'mx-auto': mode === 'viewDetail'
						}"
					>
						{{ post.name }}
					</div>
				</v-card-title>
			
				<v-card-text
					class="black--text text-h5 font-weight-regular"
					style="flex: auto"
				>
					<v-row
						class="w-100"
						:class="{
							'h-100': mode === 'viewDetail'
						}"
						no-gutters
					>
						<v-col :cols="mode === 'viewDetail' ? '3' : '5'">
							<v-img
								:src="post.files[0]"
								contain
								width="65%"
								class="ma-auto"
							/>
						</v-col>
					
						<v-col :cols="mode === 'viewDetail' ? '9' : '7'">
							<v-layout
								column
								class="w-100 h-100"
								justify-center
							>
								<div>Author: {{ post.author.firstName + ' ' + post.author.lastName }}</div>

								<div>{{ post.description }}</div>

								{{ !(post.status.name === 'Not approved') ? 'Post date:' : 'Due date:' }} {{ post.period ? new Date(post.period?.closureDate).toLocaleDateString('en-GB') : 'No Date' }}
							</v-layout>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</div>
	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'PostCard',
	props: {
		posts: {
			type: Array,
			required: true
		},
		width: {
			type: [String, Number],
			default: '100%'
		},
		height: {
			type: [String, Number],
			default: undefined
		},
		mode: {
			type: String,
			default: 'list'
		}
	},
	computed: {
		...mapGetters({
			getFacultyBySlug: 'faculty/getFacultyBySlug'
		})
	},
	methods: {
		push (status, id) {
			if (!status) return;

			if (this.$checkRole.isRole(['MARKETING_COORDINATOR', 'STUDENT']) && status !== 'Approved') {
				this.$router.push('/upload/' + id);
			} else {
				this.$router.push('/viewPost/' + id);
			}
		}
	}
};
</script>
