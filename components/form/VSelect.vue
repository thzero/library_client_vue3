<template>
	<v-select
		v-model="innerValue"
		:items="innerItems"
		:item-text="text"
		item-value="id"
		:hide-details="hideDetails"
		:label="$attrs.label"
		:flat="flat"
		:solo-inverted="soloInverted"
		@update:modelValue="innerValueUpdate"
	/>
</template>

<script>
import { useBaseControlEditComponent } from '@/library_vue/components/baseControlEdit';
import { useBaseControlEditProps } from '@/library_vue/components/baseControlEditProps';

export default {
	name: 'VtSelect',
	props: {
		...useBaseControlEditProps,
		flat: {
			type: Boolean,
			default: false
		},
		items: {
			type: [Object, Array],
			default: null
		},
		soloInverted: {
			type: Boolean,
			default: false
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
