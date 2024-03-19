<template>
	<v-layout
		v-scroll="throttleOnScroll"
		class="pa-0"
		column
	>
		<v-card
			class="white d-flex justify-end rounded-0"
			height="21.5vh"
			width="100%"
		>
			<v-spacer />

			<v-text-field
				ref="searchBox"
				append-icon="mdi-magnify"
				placeholder="Search"
				class="rounded-0 mr-4 align-self-center search"
				outlined
				solo
				light
				hide-details
				style="max-width: 16%"
			/>
		</v-card>

		<v-card color="#2b3494" height="4vh" width="100%" />
		<v-card class="grey rounded-0" height="7vh" width="100%" />

		<v-card
			ref="banner"
			class="white rounded-0"
			height="100vh"
			width="100%"
		/>
	</v-layout>
</template>

<script>
import _ from 'lodash';
export default {
	name: 'IndexPage',
	auth: 'guest',
	data () {
		return {
			lastPosition: 0
		};
	},
	methods: {
		throttleOnScroll (e) {
			_.throttle(this.onScroll(e), 1000);
		},
		onScroll (e) {
			const scrollPosition = e.target.documentElement.scrollTop;
			if (scrollPosition > this.lastPosition) {
				if (scrollPosition <= this.$refs.searchBox.$el.offsetTop || this.lastPosition === 0) {
					e.target.documentElement.scrollTop = this.$refs.searchBox.$el.offsetTop;
				} else if (scrollPosition > this.$refs.searchBox.$el.offsetTop - 42 && scrollPosition <= this.$refs.banner.$el.offsetTop) {
					e.target.documentElement.scrollTop = this.$refs.banner.$el.offsetTop;
				} else {
					return;
				}
			} else {
				if (scrollPosition >= this.$refs.searchBox.$el.offsetTop && scrollPosition <= this.$refs.banner.$el.offsetTop) {
					e.target.documentElement.scrollTop = this.$refs.searchBox.$el.offsetTop;
				} else if (scrollPosition < this.$refs.searchBox.$el.offsetTop) {
					e.target.documentElement.scrollTop = 0;
				} else {
					e.target.documentElement.scrollTop = this.$refs.banner.$el.offsetTop;
				}
			}

			this.lastPosition = scrollPosition;
		}
	}
};
</script>

<style>
.search * {
	min-height: 0% !important;
}
</style>
