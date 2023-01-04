
<script>
import { ref, watch } from 'vue';

import LibraryUtility from '@thzero/library_common/utility/index';

import { useBaseComponent } from './base';

export function useBaseConfirmationDialogComponent(props, context, options) {
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

	const dialogSignal = ref(false);
	const internalItem = ref(null);

	const dialogCancel = () => {
		dialogSignal.value = false;
		$emit('cancel');
	};
	const dialogOk = async () => {
		const correlationIdI = correlationId();
		if (props.preCompleteOk) {
			const response = await props.preCompleteOk(correlationIdI);
			logger.debug('useBaseConfirmationDialogComponent', 'dialogOk', 'response', response, correlationId);
			if (hasFailed(response)) {
				handleError(response, correlationIdI);
				return;
			}
		}

		dialogSignal.value = false;
		context.emit('ok');
		if (props.completeOk)
			props.completeOk();
	};
	const handleError = (response, correlationId) => {
		if (options && LibraryUtility.isObject(options) && LibraryUtility.isFunction(options.handleErrorI))
			options.handleErrorI(response, correlationId);
	};

	watch(() => props.signal,
		(value) => {
			dialogSignal.value = value;
		}
	);

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
		dialogCancel,
		dialogOk,
		dialogSignal,
		handleError,
		internalItem
	};
};
</script>