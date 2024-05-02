<template>
	<div class="w-100 px-8 pb-5">
		<v-divider class="my-5" />

		<v-form>
			<v-row>
				<v-col cols="3" class="black--text d-flex align-center text-h5 font-weight-regular">
					Status:
				</v-col>

				<v-col cols="2">
					<v-select
						v-model="form.status"
						hide-details
						:items="headers"
						solo
						flat
						outlined
						class="my-auto"
					/>
				</v-col>
			</v-row>

			<comment-feature
				:key="key"
				v-model="form.comment"
				class="mt-5"
				:comments="comments"
				@updateChildComment="(payload) => $emit('updateChildComment', payload)"
			/>
		</v-form>

		<v-layout
			class="w-100 mt-10"
			justify-center
		>
			<v-btn
				class="black--text white mx-5"
				@click="$router.back()"
			>
				Back
			</v-btn>

			<v-btn class="black--text white mx-5" @click="update">
				Update
			</v-btn>
		</v-layout>
	</div>
</template>

<script>
export default {
	name: 'ExtendedFeature',
	props: {
		value: {
			type: Object,
			default: () => {}
		},
		comments: {
			type: Array,
			default: () => []
		}
	},
	data () {
		return {
			headers: [
				{
					text: 'Approve',
					value: 'Approved'
				},
				{
					text: 'Not approve',
					value: 'Not approved'
				},
				{
					text: 'Pending',
					value: 'Pending'
				}
			],
			status: undefined,
			form: {
				status: undefined,
				comment: undefined
			},
			key: 0
		};
	},
	watch: {
		post: {
			deep: true,
			handler () {
				this.form.status = this.post.status?.name;
			}
		},
		form: {
			deep: true,
			handler () {
				this.$emit('input', this.form);
			}
		}
	},
	mounted () {
		this.form = this.value;
	},
	methods: {
		update () {
			this.$emit('update');
			this.key += 1;
		}
	}
};
</script>
