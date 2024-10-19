import { getField } from 'vuex-map-fields';

export const state = () => ({
	notifications: []
});

export const getters = {
	getField
};

export const actions = {
	push ({commit}, payload) {
		const notification = Object.assign({}, {
			timeout: payload?.timeout || 3000,
			icon: icon[payload.type],
			color: color[payload.type],
			displayed: false,
			message: payload.message
		})

		commit('setNotifications', notification);
	}
};

export const mutations = {
	setNotifications: (state, payload) => state.notifications.push(payload)
};

const icon = {
	error: 'mdi-alert',
	complete: 'mdi-check'
}

const color = {
	error: 'red',
	complete: 'green'
}