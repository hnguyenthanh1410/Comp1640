<template>
	<index-card width="90vw" height="85vh" index-class="ma-auto h-100">
		<submit-form />
	</index-card>
</template>

<script>
export default {
	layout: 'post',
	middleware ({ $checkRole, redirect }) {
		if (!$checkRole.isRole(['STUDENT', 'MARKETING_COORDINATOR'])) {
			redirect('/');
		}
	}
};
</script>
