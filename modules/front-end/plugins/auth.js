export default ({ $auth, $checkRole }) => {
	$auth.onRedirect(() => {
		if ($auth.loggedIn && $checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR'])) {
			return `/faculty/${$auth.user.faculty?.slug || 'marketing'}`;
		} else if (!$auth.loggedIn) {
			return '/';
		}
	});
};
