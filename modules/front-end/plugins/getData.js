import axios from 'axios';

export default ({ app }, inject) => {
	inject('getData', {
		async fetch (url, data, method = 'get', headers) {
			try {
				const returnData = await axios({
					method,
					url,
					headers: {
						authorization: app.$auth.strategy.token.get(),
						...headers
					},
					data
				});
	
				return returnData.data;
			} catch (err) {
				console.log(err);
			}
		}
	});
};
