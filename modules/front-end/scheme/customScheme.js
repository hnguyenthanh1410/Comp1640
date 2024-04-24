import axios from "axios";
import { RefreshScheme } from "~auth/runtime";

export default class CustomSchema extends RefreshScheme {
	async login (data) {
		try {
			const token = await axios({
				method: 'post',
				url: 'http://localhost:8080/auth/sign-in',
				data
			});

			this.$auth.setUserToken(token.data.accessToken, token.data.refreshToken);
			
			await this.$auth.fetchUser();
		} catch (err) {
			console.log(err);
		}
	}

	async logout () {
		try {
			await axios({
				method: 'Post',
				url: 'http://localhost:8080/auth/logout',
				headers: {
					authorization: this.$auth.strategy.token.get()
				}
			});
		} catch (err) {
			console.log(err);
		}

		localStorage.clear();
		this.$auth.reset();
	}

	async refreshTokens () {
		try {
			const token = await axios({
				method: 'post',
				url: 'http://localhost:8080/auth/refresh-token',
				headers: {
					authorization: this.$auth.strategy.refreshToken.get()
				}
			});

			this.$auth.setUserToken(token.data.accessToken, token.data.refreshToken);

			await this.$auth.fetchUser();
		} catch (err) {
			this.$store.reset();
		}

		localStorage.clear();
	}
};
