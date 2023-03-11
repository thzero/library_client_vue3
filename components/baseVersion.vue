<script>
import { computed } from 'vue';

import { useBaseComponent } from './base';

export function useBaseVersionComponent(props, context) {
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
	} = useBaseComponent(props, context);

	const version = computed(() => {
		return props.modelValue;
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
		version
	};
};
</script>
