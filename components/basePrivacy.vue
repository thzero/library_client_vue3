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
		let url = '/';
		if (options && options.url)
			url = options.url;

		let urlTitle = LibraryClientUtility.$trans.t('titles.application');
		if (options && options.urlTitle)
			urlTitle = options.urlTitle;
		let link = null;
		if (urlTitle)
			link = `<a href="${url}">${urlTitle}</a>`;

		return LibraryClientUtility.$trans.t('strings.privacy.text1', { title: LibraryClientUtility.$trans.t('titles.application'), url: link });
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
