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

		if (!data.length) {
			data = [{
				name: 'No post',
				type: 'no-data',
				description: `No post in ${this.state.faculty.faculties.find((faculty) => faculty.slug === this.$router.currentRoute.params.id).name} was found.`,
				height: '100%'
			}];
		}

		commit('updatePosts', data);
	}
};

export const getters = {
	getField
};

export const mutations = {
	updatePosts: (state, payload) => state.posts = payload
};
