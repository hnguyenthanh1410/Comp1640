export default ({ route, $auth, $checkRole, redirect, store }) => {
	if ($checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR']) && route.params.id !== $auth.user.faculty.slug) {
		redirect('/faculty/' + $auth.user.faculty.slug);
	} else if (!store.state.user.guestState) {
		redirect('/');
	}
};
