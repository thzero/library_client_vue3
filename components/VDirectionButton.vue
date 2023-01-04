<template>
	<v-btn
		depressed
		large
		style="min-width: 0px"
		@click="click(!innerValue)"
	>
		<v-icon
			v-if="!innerValue"
		>
			mdi-arrow-up
		</v-icon>
		<v-icon
			v-if="innerValue"
		>
			mdi-arrow-down
		</v-icon>
	</v-btn>
</template>

<script>
import LibraryUtility from '@thzero/library_common/utility';

import baseControlEdit from '@/library_vue/components/baseControlEdit';

export default {
	name: 'VtDirectionButton',
	extends: baseControlEdit,
	props: {
		// must be included in props
		value: {
			type: null,
			default: null
		}
	},
	setup (props) {
		return Object.assign(baseControlEdit.setup(props), {
		});
	},
	watch: {
		// Handles external model changes.
		value(newVal) {
			this.initValue(newVal);
		}
	},
	mounted() {
		this.initValue(this.value);
	},
	methods: {
		click(value) {
			this.update(this, value);
		},
		update: LibraryUtility.debounce(async function(self, value) {
			self.innerValue = value;
		}, 500)
	}
};
</script>

<style scoped>
</style>
