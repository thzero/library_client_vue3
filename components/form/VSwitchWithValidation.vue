<template>
	<v-switch
		v-model="innerValue"
		:hide-details="hideDetails"
		:readonly="readonly"
		:disabled="disabled"
		:hint="$attrs.hint"
		:label="$attrs.label"
		density="compact"
		:color="color"
		@update:modelValue="change"
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
	</v-switch>
</template>

<script>
import { useBaseControlEditComponent } from '@/library_vue/components/baseControlEdit';
import { useBaseControlEditProps } from '@/library_vue/components/baseControlEditProps';

export default {
	name: 'VtSwitchWithValidation',
	props: {
		...useBaseControlEditProps,
		color: {
			type: String,
			default: 'primary'
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
			innerValueUpdate
		};
	}
};
</script>

<style scoped>
</style>
