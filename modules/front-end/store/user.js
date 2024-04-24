import { getField } from "vuex-map-fields";

export const state = () => ({
	users: [],
	guestState: false
});

export const actions = {
	async getData ({ commit }) {
		const data = await this.$getData.fetch('http://localhost:8080/user/');

		commit('updatePosts', data);
	},

	updateGuestState ({ commit }, payload) {
		commit('updateGuest', payload);
	}
};

export const getters = {
	getField
};

export const mutations = {
	updatePosts: (state, payload) => state.users = payload,
	updateGuest: (state, payload) => state.guestState = payload
};
