import { getField } from 'vuex-map-fields';

export const state = () => ({
	period: {}
});

export const getters = {
	getField
};

export const actions = {
	async getData ({ commit }) {
		const data = await this.$getData.fetch('http://localhost:8080/period/');

		commit('setPeriod', data);
	}
};

export const mutations = {
	setPeriod: (state, payload) => state.period = payload
};
