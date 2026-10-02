<script>
import { computed, onMounted, ref, watch } from 'vue';

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
		successResponse,
		isSaving,
		serverErrors,
		setErrors
	} = useBaseComponent(props, context, options);

	const serviceMarkup = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_MARKUP_PARSER);

	const dialogHeightI = ref(300);
	const dialogSignal = ref(false);
	const internalItem = ref(null);

	const fullscreenInternal = computed(() => {
		return options && options.fullscreenInternal ? options.fullscreenInternal : false;
	});
	const markup = computed(() => {
		if (!props.markup)
			return null;
		const correlationIdI = correlationId();
		return serviceMarkup.trimResults(correlationIdI, serviceMarkup.render(correlationIdI, props.markup));
	});
	const scrollableI = computed(() => {
		return props.scrollable ? 'scrollable' : '';
	});
	const scrollableHeightI = computed(() => {
		return props.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(props.scrollableHeight) ? props.scrollableHeight : dialogHeightI.value) + 'px;' : '';
	});

	const dialogCancel = () => {
		dialogSignal.value = false;
		// the setup context has emit; $emit threw, so the parent never heard
		context.emit('cancel');
	};
	const dialogOk = async () => {
		dialogSignal.value = false;
		context.emit('ok');
	};

	onMounted(() => {
		// as the form dialog: a share of the window, used when scrollableAutoResize is on
		dialogHeightI.value = Math.ceil((window.innerHeight - 200) * props.scrollableAutoResizeFactor);
	});

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
