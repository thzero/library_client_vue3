<template>
	<v-text-field
		v-model="innerValue"
		:error="errorI"
		:hide-details="hideDetails"
		:readonly="readonly"
		:disabled="disabled"
		:hint="$attrs.hint"
		:label="$attrs.label"
		:counter="maxcount"
		@blur="blur"
		@update:modelValue="innerValueUpdate"
	>
		<template v-slot:append>
			<span :class="countClass">{{ count }}</span>
		</template>
		<template v-slot:details>
			<div
				v-if="errorsI && errorsI.length > 0"
			>
			<div
				v-for="error of errorsI"
				:key="error.$uid"
			>
				<strong>{{ error.$message }}</strong>
				<small> on </small>
				<strong>{{ error.$property }}</strong>
			</div>
			</div>
		</template>
	</v-text-field>
</template>

<script>
import { computed } from 'vue';

import { useBaseControlEditComponent } from '@/library_vue/components/baseControlEdit';
import { useBaseControlEditProps } from '@/library_vue/components/baseControlEditProps';

export default {
	name: 'VtTextFieldWithValidation',
	props: {
		...useBaseControlEditProps,
		blur: {
			type: Function,
			default: () => {}
		},
		maxcount: {
			type: Number,
			default: null
		},
		mincount: {
			type: Number,
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
		
		const count = computed(() => {
			return props.maxcount ? '(' + (innerValue .value? innerValue.value.length : 0) + ')' : '';
		});
		const countClass = computed(() => {
			return (props.maxcount && !String.isNullOrEmpty(innerValu.value) ? innerValue.value.length > props.maxcount ? 'negative ' : '' : '') + 'title-body2';
		});
		
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
			count,
			countClass
		};
	}
};
</script>

<style scoped>
</style>
