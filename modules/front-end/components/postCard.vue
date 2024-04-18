<template>
	<v-layout column class="w-100 h-100">
		<v-card
			v-for="(post, key) of posts"
			:key="key"
			width="100%"
			:disabled="!!post.height"
			light
			class="my-4"
			:to="'/upload/' + post.id"
		>
			<v-card-title class="black--text text-h5 font-weight-bold">
				{{ post.name }}
			</v-card-title>
			
			<v-card-text class="black--text text-h5 font-weight-regular">
				<v-layout v-if="post.type === 'no-data'" class="d-flex justify-center">
					{{ post.description }}
				</v-layout>

				<v-layout v-else class="w-100" align-center>
					<v-img
						src="/img/illustration-gallery-icon_53876-27002.png"
						contain
						width="10%"
						height="10%"
						class="mr-5"
					/>
					<v-layout column class="w-100">
						<div>{{ post.description }}</div>
						<div v-if="post.status.name === 'Not approved'">
							Due date: {{ new Date(post.period.closureDate).toLocaleDateString('en-GB') }}
						</div>
					</v-layout>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-layout>
</template>

<script>
export default {
	name: 'PostCard',
	props: {
		posts: {
			type: Array,
			required: true
		}
	}
};
</script>
