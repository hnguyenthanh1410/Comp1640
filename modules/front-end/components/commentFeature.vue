<template>
	<div>
		<v-row>
			<v-col cols="3" class="black--text d-flex align-center text-h5 font-weight-regular">
				Comment:
			</v-col>

			<v-col cols="7">
				<v-textarea
					v-model="comment"
					type="date"
					hide-details
					solo
					flat
					outlined
					no-resize
					class="my-auto"
				/>
			</v-col>
		</v-row>

		<v-row
			v-for="(com, key) of comments"
			:key="key"
		>
			<v-spacer />

			<v-col cols="9" class="black--text d-flex align-center">
				<v-layout column>
					<div>{{ com.content }}</div>

					<v-row v-for="(children, comKey) of com.children" :key="comKey" no-gutters>
						<v-spacer />

						<v-col cols="11">
							{{ children.content }}

							<v-textarea
								:value="childrenComment.find((child) => child.id === children.id)?.content"
								type="date"
								hide-details
								solo
								flat
								outlined
								no-resize
								class="my-auto"
								@change="(input) => updateChildrenComment(input, com.id)"
							/>
						</v-col>
					</v-row>
				</v-layout>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	name: 'CommentFeature',
	props: {
		value: {
			type: String,
			default: undefined
		},
		comments: {
			type: Array,
			default: () => []
		}
	},
	data () {
		return {
			comment: '',
			childrenCom: []
		};
	},
	computed: {
		childrenComment: {
			get () {
				return this.childrenCom;
			},
			set (value) {
				if (!this.childrenCom.length) {
					this.childrenCom.push(value);
					return;
				};
				
				this.childrenCom.forEach((child, index) => {
					if (child.id === value.id) {
						this.childrenCom[index].content = value.content;
					} else if (index + 1 === this.childrenCom.length) {
						this.childrenCom.push(value);
					}
				});
			}
		}
	},
	watch: {
		comment () {
			this.$emit('input', this.comment);
		},
		childrenCom: {
			deep: true,
			handler () {
				this.$emit('updateChildComment', this.childrenComment);
			}
		}
	},
	mounted () {
		this.comment = this.value;
	},
	methods: {
		updateChildrenComment (content, parentId) {
			this.childrenComment = {
				content,
				parentId
			};
		}
	}
};
</script>
