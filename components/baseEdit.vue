<script>
import { ref } from 'vue';

import { useBaseComponent } from './base';

export function useBaseEditComponent(props, context, options) {
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
	} = useBaseComponent(props, context, options);
	
	const isSaving = ref(false);
	const serverErrors = ref([]);
	
	const setErrors = (errors) => {
		serverErrors.value = errors !== null ? errors : [];
		isSaving.value = false;
	};

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
		setErrors
	}
};
</script>
