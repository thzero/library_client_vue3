<script>
import { computed } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import { useBaseComponent } from '../base';

export function useBaseMarkdownComponent(props, context, options) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	} = useBaseComponent(props, context, options);

	const serviceMarkup = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);

	const markdownClass = computed(() => {
		return 'markdown ' + (props.useGithub ? 'markdown-body' : '');
	});

	const display = computed(() => {
		if (String.isNullOrEmpty(props.modelValue))
			return '';

		const correlationIdI = correlationId();
		const results = serviceMarkup.render(correlationIdI, props.modelValue);
		return serviceMarkup.trimResults(correlationIdI, results);
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
		display,
		markdownClass,
		serviceMarkup
	};
};
</script>
