<template>
	<v-autocomplete
		v-model="innerValue"
		:error-messages="errors"
		:success="valid"
		:loading="loading"
		:items="innerItems"
		:search-input.sync="search"
		cache-items
		item-text="name"
		item-value="id"
		:readonly="readonly"
		:disabled="disabled"
		:hint="$attrs.hint"
		:label="$attrs.label"
		@update:modelValue="innerValueUpdate"
	>
		<template v-slot:details>
			<div
				v-for="error of errorsI"
				:key="error.$uid"
			>
				<strong>{{ error.$message }}</strong>
				<small> on </small>
				<strong>{{ error.$property }}</strong>
			</div>
		</template>
	</v-autocomplete>
</template>

<script>
import { ref } from 'vue';

import LibraryUtility from '@thzero/library_common/utility';

import { useBaseControlEditComponent } from '@/library_vue/components/baseControlEdit';
import { useBaseControlEditProps } from '@/library_vue/components/baseControlEditProps';

export default {
	name: 'VtAutoCompleteWithValidation',
	props: {
		...useBaseControlEditProps,
		items: {
			type: [Object, Array],
			default: null
		},
		querySelection: {
			type: Function,
			default: null
		},
		// must be included in props
		value: {
			type: null,
			default: null
		}
	},
	setup (props, context) {
		const {
			correlationId,
			error,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			success,
			isSaving,
			serverErrors,
			setErrors,
			convertValue,
			errorI,
			errorsI,
			hideDetails,
			innerValue,
			innerValueUpdate,
			initValue
		} = useBaseControlEditComponent(props, context);

		
		const innerItems = ref([]);
		const loading = ref(false);
		const search = ref(null);

		const executeQuery = async (newVal) => {
			// this.loading = true
			// if (this.querySelection)
			//	 this.innerItems = await this.querySelection(newVal)
			// else
			//	 this.innerItems = []
			// this.loading = false
			update(this, newVal);
		},
		const update = LibraryUtility.debounce(async function(self, newVal) {
			loading.value = true;
			if (querySelection.value)
				innerItems.value = await props.querySelection(newVal);
			else
				innerItems.value = [];
			loading.value = false;
		}, 50)

		watch(() => search.value,
			(value) => {
				value && (value !== innerValue.value) && await executeQuery(value);
			}
		);

		return {
			correlationId,
			error,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			success,
			isSaving,
			serverErrors,
			setErrors,
			convertValue,
			errorI,
			errorsI,
			hideDetails,
			innerValue,
			innerValueUpdate,
			initValue,
			innerItems,
			loading,
			search
		}
	},
	// data: () => ({
	// 	innerItems: [],
	// 	loading: false,
	// 	search: null
	// }),
	// watch: {
	// 	async search(newVal) {
	// 		newVal && (newVal !== this.innerValue) && await this.executeQuery(newVal);
	// 	},
	// 	// Handles external model changes.
	// 	value(newVal) {
	// 		this.initValue(newVal);
	// 	}
	// },
	// mounted() {
	// 	this.initValue(this.value);
	// },
	// methods: {
	// 	async executeQuery(newVal) {
	// 		// this.loading = true
	// 		// if (this.querySelection)
	// 		//	 this.innerItems = await this.querySelection(newVal)
	// 		// else
	// 		//	 this.innerItems = []
	// 		// this.loading = false
	// 		this.update(this, newVal);
	// 	},
	// 	validation() {
	// 		return this.$refs.prv;
	// 	},
	// 	update: LibraryUtility.debounce(async function(self, newVal) {
	// 		self.loading = true;
	// 		if (self.querySelection)
	// 			self.innerItems = await this.querySelection(newVal);
	// 		else
	// 			self.innerItems = [];
	// 		self.loading = false;
	// 	}, 50)
	// }
};
</script>

<style scoped>
</style>
