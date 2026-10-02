<script>
import { computed } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from './base';

// was an Options component extending base.vue, which has no default export
export function useBaseLoadingOverlayComponent(props, context, options) {
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
		successResponse
	} = useBaseComponent(props, context, options);

	const displayMessage = computed(() => {
		return !String.isNullOrEmpty(props.message) ? props.message : LibraryClientUtility.$trans.t('messages.loading');
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
		successResponse,
		displayMessage
	};
};
</script>
