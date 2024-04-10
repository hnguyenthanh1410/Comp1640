import axios from 'axios';

export default ({ app }, inject) => {
	inject('getData', {
		async fetch (url, data, method = 'get') {
			const returnData = await axios({
				method,
				url,
				headers: {
					authorization: app.$auth.strategy.token.get()
				},
				data
			});

			return returnData.data;
		}
	});
};
