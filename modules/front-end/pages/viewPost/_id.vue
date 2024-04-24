<template>
	<postCard
		v-if="!loading"
		:posts="post"
		height="90vh"
		width="85vw"
		mode="viewDetail"
	/>
</template>

<script>
export default {
	name: 'ViewPostPage',
	auth: 'guest',
	data () {
		return {
			post: [],
			loading: true
		};
	},
	async mounted () {
		try {
			this.post.push(await this.$getData.fetch('http://localhost:8080/contribution/detail/' + this.$route.params.id));
		} catch (err) {
			console.log(err);
		}

		this.loading = false;
	}
};
</script>
