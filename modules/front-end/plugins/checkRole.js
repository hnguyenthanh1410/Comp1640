const RoleNames = {
	ADMIN: 1,
	MARKETING_COORDINATOR: 2,
	MARKETING_MANAGER: 3,
	STUDENT: 4,
	GUEST: 5
};

export default ({ app }, inject) => {
	inject('checkRole', {
		isRole (roles) {
			let verified = false;

			roles?.forEach((role) => {
				const roleName = RoleNames[role];

				if (app.$auth.user.role.name === roleName) {
					verified = true;
				}
			});

			return verified;
		}
	});
};
