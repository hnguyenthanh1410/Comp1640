<template>
	<v-card
		color="white"
		:width="width"
		:height="height"
		class="d-flex flex-column align-center rounded-xxl"
		elevation="15"
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
			default: undefined
		},
		height: {
			type: String,
			default: undefined
		},
		indexClass: {
			type: [Object, String],
			default: undefined
		}
	}
};
</script>
