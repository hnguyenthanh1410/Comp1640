export default ({ $auth, $checkRole, redirect }) => {
	if ($checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR'])) {
		redirect('/faculty/' + $auth.user.faculty?.slug || 'marketing');
	}
};
