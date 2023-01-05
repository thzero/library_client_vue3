<template>
	<v-select
		v-model="innerValue"
		:error="errorI"
		:items="innerItems"
		:success="valid"
		item-text="name"
		item-value="id"
		:label="$attrs.label"
		density="compact"
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
	</v-select>
</template>

<script>
import { getCurrentInstance, onMounted, ref, watch } from 'vue';

import { useBaseControlEditComponent } from '@/library_vue/components/baseControlEdit';
import { useBaseControlEditProps } from '@/library_vue/components/baseControlEditProps';

export default {
	name: 'VtSelectAutoCompleteWithValidation',
	extends: baseControlEdit,
	props: {
		...useBaseControlEditProps,
		items: {
			type: [Object, Array],
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
			initValue,
			innerValueUpdate
		} = useBaseControlEditComponent(props, context);

		const innerItems = ref([]);
		
		const text = (item) => { 
			return item.displayName ? item.displayName : item.name;
		}
		
		onMounted(async () => {
			if (props.items)
				innerItems.value = props.items;
			initValue(props.modelValue);
		});

		watch(() => props.items,
			(value) => {
				innerItems.value = value;
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
			initValue,
			innerValueUpdate,
			innerItems,
			text
		};
	}
};
</script>

<style scoped>
</style>
