import { getField } from 'vuex-map-fields';

export const state = () => ({
	faculties: []
});

export const getters = {
	getField
};

export const actions = {
	async getData ({ commit }) {
		const data = await this.$getData.fetch('http://localhost:8080/faculty/get-all');

		commit('setFaculty', data);
	}
};

export const mutations = {
	setFaculty: (state, payload) => state.faculties = payload
};
