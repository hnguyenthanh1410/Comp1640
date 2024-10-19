export default ({ route, $auth, $checkRole, redirect }) => {
	if ($checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR', 'GUEST']) && route.params.id !== $auth.user.faculty.slug) {
		redirect('/faculty/' + $auth.user.faculty.slug);
	} else if (!$auth.loggedIn) {
		redirect('/');
	}
};
