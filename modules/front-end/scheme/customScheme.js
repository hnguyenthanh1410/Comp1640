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

			this.$auth.setUserToken(token.data.accessToken, token.data.refreshToken);
			await this.$auth.fetchUser();

			window.location.replace('http://localhost:3000/');
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

			window.location.replace('http://localhost:3000/');
		} catch (err) {
			console.log(err);
		}
	}
};
