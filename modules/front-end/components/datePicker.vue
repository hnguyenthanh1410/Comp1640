<template>
	<v-form class="mx-auto w-50" @submit.prevent="$emit('submit')">
		<v-row>
			<v-col class="d-flex align-center" cols="4">
				<v-col cols="6">
					<div class="text-subtitle-2 text-lg-h6 font-weight-regular">Date from</div>
				</v-col>

				<v-menu
					ref="from"
					v-model="menuFrom"
					:close-on-content-click="false"
					:close-on-click="false"
					:return-value.sync="dates.from"
					transition="expand-transition"
					offset-y
				>
					<template #activator="{ on, attrs }">
						<v-text-field
							v-model="dates.from"
							:clearable="false"
							readonly
							v-bind="attrs"
							v-on="on"
						/>
					</template>

					<v-date-picker
						v-model="dates.from"
						no-title
						scrollable
						:max="currentDate"
					>
						<v-spacer />

						<v-btn text color="primary" @click="menuFrom = false">
							Cancel
						</v-btn>

						<v-btn text color="primary" @click="$refs.from.save(dates.from)">
							OK
						</v-btn>
					</v-date-picker>
				</v-menu>
			</v-col>

			<v-spacer />

			<v-col cols="4" class="d-flex align-center">
				<v-col cols="6">
					<div class="text-subtitle-2 text-lg-h6 font-weight-regular">Date to</div>
				</v-col>

				<v-menu
					ref="to"
					v-model="menuTo"
					:close-on-content-click="false"
					:close-on-click="false"
					:return-value.sync="dates.to"
					transition="expand-transition"
					offset-y
				>
					<template #activator="{ on, attrs }">
						<v-text-field
							v-model="dates.to"
							:clearable="false"
							readonly
							v-bind="attrs"
							v-on="on"
						/>
					</template>

					<v-date-picker
						v-model="dates.to"
						no-title
						scrollable
						:min="dates.from"
					>
						<v-spacer />

						<v-btn text color="primary" @click="menuTo = false">
							Cancel
						</v-btn>

						<v-btn text color="primary" @click="$refs.to.save(dates.to)">
							OK
						</v-btn>
					</v-date-picker>
				</v-menu>
			</v-col>

			<v-col cols="1"/>

			<v-col class="d-flex align-center">
				<v-btn
					text
					elevation="1"
					:ripple="false"
					plain
					type="submit"
				>
					Submit
				</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			default: undefined
		},
		currentDate: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			dates: {
				from: '',
				to: ''
			},
			menuFrom: false,
			menuTo: false
		};
	},
	watch: {
		dates: {
			deep: true,
			handler () {
				this.$emit('input', this.dates)
			}
		} 
	},
	mounted () {
		if (!this.value) return;

		this.dates =  this.value;
	}
};
</script>
