<template>
	<v-card
		color="white"
		:width="width"
		:height="height"
		class="d-flex flex-column align-center rounded-xl"
		:class="indexClass"
	>
		<slot />
	</v-card>
</template>

<script>
export default {
	name: "IndexCard",
	props: {
		width: {
			type: String,
			default: '70vw'
		},
		height: {
			type: String,
			default: '40vh'
		},
		indexClass: {
			type: Object,
			default: () => {}
		}
	}
};
</script>
