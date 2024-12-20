import axios from "axios";

export default async ({ $auth, $checkRole, redirect }) => {
	$auth.refreshTokens = async () => {
		const refreshToken = $auth.strategy.refreshToken.get();

		if (!refreshToken || $auth.strategy.refreshToken.status().expired()) $auth.reset();
		// Make the request to refresh the token
		try {
			const response = await axios.post('http://localhost:8080/auth/refresh-token', {
			}, {
				headers: {
					Authorization: refreshToken
				}
			});
			const { refreshToken: newRefreshToken, accessToken: newAccessToken } = response.data;
	
			$auth.strategy.token.set(newAccessToken);
			$auth.strategy.refreshToken.set(newRefreshToken);
			return newAccessToken;
		} catch {
			$auth.reset();
			redirect('/');
		}
	};

	if ($auth.strategy.token.status().expired() && $auth.strategy.refreshToken.status().valid()) {
		await $auth.refreshTokens();
	} else if ($auth.strategy.refreshToken.status().expired() || !$auth.strategy.refreshToken.get()) $auth.reset();

	$auth.onRedirect(() => {
		if (!$auth.loggedIn) {
			return '/';
		} else if ($checkRole.isRole(['GUEST', 'STUDENT', 'MARKETING_COORDINATOR'])) {
			return `/faculty/${$auth.user.faculty?.slug}`;
		} else if ($checkRole.isRole(['ADMIN'])) {
			return '/analytics';
		}
	});
};
