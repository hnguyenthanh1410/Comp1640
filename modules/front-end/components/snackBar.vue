<template>
	<v-snackbar
		v-model="snackBar"
		vertical
		right
		@input="onClose"
		:timeout="current.timeout"
		absolute
		content-class="w-100"
	>
		<v-card
			flat
			:color="current.color"
			class="white"
		>
			<v-card-text>
				<v-layout align-center justify-space-between>
					<v-icon class="mr-5">{{ current.icon }}</v-icon>
					
					{{ current.message }}

					<v-btn text plain tile :ripple="false" @click="snackBar = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-snackbar>
</template>

<script>
	import { mapFields } from 'vuex-map-fields';

	export default {
		name: 'SnackBar',
		data() {
			return {
				snackBar: false,
				queue: [],
				current: {}
			};
		},
		computed: {
			...mapFields('snackbar', ['notifications'])
		},
		watch: {
			notifications: {
				deep: true,
				handler (notifications) {
					this.addToQueue(notifications.at(-1));
				}
			}
		},
		methods: {
			addToQueue (notification) {
				this.queue.push(notification);
				this.showNotification();
			},
			showNotification () {
				if (!this.snackBar && this.queue.length) {
					this.current = this.queue.shift();
					this.snackBar = true;
				}
			},
			onClose () {
				this.showNotification();
			}
		}
	}
</script>