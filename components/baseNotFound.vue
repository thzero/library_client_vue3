<script>
import { computed } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import { useBaseComponent } from './base';

export function useBaseNotFoundComponent(props, context, options) {
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

	const imageWidth = computed(() => {
		const width = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
		if (width > 512)
			return '512px';

		return width * 0.75 + 'px';
	});

	const clickHome = () => {
		GlobalUtility.$navRouter.push('/');
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
		clickHome,
		imageWidth
	};
};
</script>
