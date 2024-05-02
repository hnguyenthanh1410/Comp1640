export default ({ $auth, $checkRole }) => {
	$auth.onRedirect(() => {
		if (!$auth.loggedIn) {
			return '/';
		} else if ($checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR'])) {
			return `/faculty/${$auth.user.faculty?.slug || 'marketing'}`;
		} else if ($checkRole.isRole(['ADMIN'])) {
			return '/analytics'
		} else {
			return '/faculty/marketing'
		}
	});
};
