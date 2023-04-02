
<script>
import { computed, ref, watch } from 'vue';

import LibraryCommonUtility from '@thzero/library_common/utility/index';

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
		success,
		successResponse
	} = useBaseComponent(props, context, options);

	const dialogSignal = ref(false);
	const internalItem = ref(null);
	const invalid = ref(false);

	const buttonOkDisabled = computed(() => {
		return invalid.value;
	});

	const dialogCancel = () => {
		dialogSignal.value = false;
		context.emit('cancel');
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
		if (options && LibraryCommonUtility.isObject(options) && LibraryCommonUtility.isFunction(options.handleErrorI))
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
		successResponse,
		buttonOkDisabled,
		dialogCancel,
		dialogOk,
		dialogSignal,
		handleError,
		internalItem,
		invalid
	};
};
</script>
