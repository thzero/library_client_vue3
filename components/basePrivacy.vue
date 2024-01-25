<script>
import { computed } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from './base';

export function useBasePrivacyComponent(props, context, options) {
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

	const privacyMarkup = computed(() => {
		return LibraryClientUtility.$trans.t('strings.privacy.text1', { url: `<a href="/">${LibraryClientUtility.$trans.t('titles.application')}</a>` });
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
		privacyMarkup
	};
};
</script>
