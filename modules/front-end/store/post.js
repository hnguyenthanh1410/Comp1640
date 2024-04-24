import { getField } from "vuex-map-fields";

export const state = () => ({
	posts: []
});

export const actions = {
	async getData ({ commit }) {
		let data;
		if (this.$checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR'])) {
			data = await this.$getData.fetch('http://localhost:8080/contribution/contribution-list/' + this.$router.currentRoute.params.id);
		} else {
			data = await this.$getData.fetch('http://localhost:8080/contribution/approved-contribution-list/' + this.$router.currentRoute.params.id);
		}

		commit('updatePosts', data);
	}
};

export const getters = {
	getField,
	getPostById: (state) => (id) => state.posts.find((post) => post.id === id)
};

export const mutations = {
	updatePosts: (state, payload) => state.posts = payload
};
