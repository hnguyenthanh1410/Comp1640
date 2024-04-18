import axios from "axios";
import { Oauth2Scheme } from "~auth/runtime";

export default class CustomSchema extends Oauth2Scheme {
	async login (data) {
		try {
			const token = await axios({
				method: 'post',
				url: 'http://localhost:8080/auth/sign-in',
				data
			});

			this.$auth.strategy.token.set(token.data.accessToken);
			this.$auth.strategy.refreshToken.set(token.data.refreshToken);
			
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

			this.$auth.reset();
		} catch (err) {
			console.log(err);
		}
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

			this.$auth.strategy.token.set(token.data.accessToken);
			this.$auth.strategy.refreshToken.set(token.data.refreshToken);

			await this.$auth.fetchUser();
		} catch (err) {
			console.log(err);
		}
	}
};
