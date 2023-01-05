<template>
	<v-btn
		depressed
		style="min-width: 0px"
		@click="click(!innerValue)"
	>
		<span
			v-if="$vuetify.display.smAndUp"
		>
			{{ label }}
		</span>
		<v-icon
			v-if="!innerValue"
		>
			mdi-chevron-up
		</v-icon>
		<v-icon
			v-if="innerValue"
		>
			mdi-chevron-down
		</v-icon>
	</v-btn>
</template>

<script>
import { getCurrentInstance, onMounted, watch } from 'vue';

import LibraryUtility from '@thzero/library_common/utility';

import baseControlEdit from '@/library_vue/components/baseControlEdit';

export default {
	name: 'VtCollapseButton',
	extends: baseControlEdit,
	props: {
		label: {
			type: String,
			default: null
		},
		// must be included in props
		modelValue: {
			type: null,
			default: null
		}
	},
	setup (props) {
		const instance = getCurrentInstance();

		const click = (value) => {
			//innerValue = value
			this.update(this, value);
			this.$emit('click');
		};
		const update = () => LibraryUtility.debounce(async function(self, value) {
			self.innerValue = value;
		}, 500);

		watch(() => props.modelValue,
			(value) => {
				dialogSignal.value = value;
				instance.ctx.initValue(newVal);
			}
		);

		onMounted(async () => {
			instance.ctx.initValue(newVal);
		});

		return Object.assign(baseControlEdit.setup(props), {
			click,
			update
		});
	},
	// watch: {
	// 	// Handles external model changes.
	// 	value(newVal) {
	// 		this.initValue(newVal);
	// 	}
	// },
	// mounted() {
	// 	this.initValue(this.value);
	// },
	// methods: {
	// 	click(value) {
	// 		//innerValue = value
	// 		this.update(this, value);
	// 		this.$emit('click');
	// 	},
	// 	update: LibraryUtility.debounce(async function(self, value) {
	// 		self.innerValue = value;
	// 	}, 500)
	// }
};
</script>

<style scoped>
</style>
