<script>
import { ref } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from '../components/base';

export function useBaseLayout(props, context, options) {
	const serviceFeatures = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_FEATURES);

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

	let featuresTemp = (serviceFeatures ? serviceFeatures.features() : null);
	featuresTemp = (featuresTemp ? featuresTemp : (options ? options.features : null));
	featuresTemp = (featuresTemp ? featuresTemp : {});

	const features = ref(featuresTemp);

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
		features
	};
};
</script>
