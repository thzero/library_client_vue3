<script>
import { computed, ref, watch } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from './base';

export function useDisplayDialogBaseComponent(props, context, options) {
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
		isSaving,
		serverErrors,
		setErrors
	} = useBaseComponent(props, context, options);

	const serviceMarkup = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_MARKUP_PARSER);

	const dialogSignal = ref(false);
	const internalItem = ref(null);

	const fullscreenInternal = computed(() => {
		return options.fullscreenInternal ? options.fullscreenInternal : false;
	});
	const markup = computed(() => {
		if (!props.markup)
			return null;
		return serviceMarkup.trimResults(correlationId(), serviceMarkup.render(correlationId, props.markup));
	});
	const scrollableI = computed(() => {
		return props.scrollable ? 'scrollable' : '';
	});
	const scrollableHeightI = computed(() => {
		return props.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(props.scrollableHeight) ? props.scrollableHeight : dialogHeightI.value) + 'px;' : '';
	});

	const dialogCancel = () => {
		dialogSignal.value = false;
		context.$emit('cancel');
	};
	const dialogOk = async () => {
		dialogSignal.value = false;
		context.$emit('ok');
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
		isSaving,
		serverErrors,
		setErrors,
		dialogCancel,
		dialogOk,
		dialogSignal,
		fullscreenInternal,
		markup,
		internalItem,
		serviceMarkup,
		scrollableI,
		scrollableHeightI
	};
};
</script>
