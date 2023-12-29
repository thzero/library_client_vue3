<script>
import { ref } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from './base';

export function useBaseAboutComponent(props, context, options) {
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

	const emailsContributing = ref(options.emails.contributing);
	const emailsContributingTitle = ref(LibraryClientUtility.$trans.t('titles.contact.contributing', { email: options.emails.contributing }));
	const emailsInquiry = ref(options.emails.inquiry);
	const emailsInquiryTitle = ref(LibraryClientUtility.$trans.t('titles.inquiry', { email: options.emails.inquiry }));

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
		emailsContributing,
		emailsContributingTitle,
		emailsInquiry,
		emailsInquiryTitle
	};
};
</script>
