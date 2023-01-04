<template>
	<v-text-field
		v-model="innerValue"
		type="number"
		:error="errorI"
		:hide-details="hideDetails"
		:readonly="readonly"
		:disabled="disabled"
		:hint="$attrs.hint"
		:label="$attrs.label"
		:class="displayClass"
		v-bind="$attrs"
		@blur="blur"
		@update:modelValue="change"
	>
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
	name: 'VtNumberFieldWithValidation',
	props: {
		...useBaseControlEditProps,
		blur: {
			type: Function,
			default: () => {}
		},
		negativeColor: {
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
			innerValueUpdate,
			initValue
		} = useBaseControlEditComponent(props, context);
		
		const displayClass = computed(() => {
			return props.negativeColor ? (innerValue.value < 0 ? 'text-negative' : null) : null;
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
			innerValueUpdate,
			initValue,
			displayClass
		};
	}
};
</script>

<style scoped>
</style>
