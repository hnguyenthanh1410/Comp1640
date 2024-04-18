export default ({ $auth }) => {
	$auth.onRedirect((_to, _from) => {
		if ($auth.loggedIn) {
			return `/faculty/${$auth.user.faculty?.slug || 'marketing'}`;
		} else {
			return "/";
		}
	});
};
