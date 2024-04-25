<template>
	<index-card width="90vw" index-class="ma-auto h-100">
		<submit-form />
	</index-card>
</template>

<script>
export default {
	layout: 'post',
	middleware ({ $checkRole, redirect }) {
		if (!$checkRole.isRole(['STUDENT'])) {
			redirect('/');
		}
	}
};
</script>
