<script>
import { computed, onMounted, ref, watch } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import { useBaseEditComponent } from '@thzero/library_client_vue3/components/baseEdit';
import { useNotify } from '@thzero/library_client_vue3/components/notify';

import DialogSupport from '../support/dialog';

export function useBaseFormDialogControlComponent(props, context, options) {
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
	} = useBaseEditComponent(props, context, options);

	const {
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		setNotify
	} = useNotify(props, context, options);

	const dialogHeightI = ref(300);
	const dialogCancelConfirmSignal = ref(new DialogSupport());
	const dialogClearConfirmSignal = ref(new DialogSupport());
	const dialogDeleteConfirmSignal = ref(new DialogSupport());
	const dialogSignal = ref(false);
	const dirty = ref(false);
	const invalid = ref(true);
	const messageCancel = ref(LibraryClientUtility.$trans.t('questions.formDirty.cancel'));
	const messageClear = ref(LibraryClientUtility.$trans.t('questions.formDirty.clear'));
	const silentErrors = ref(true);

	const buttonCancelDisabled = computed(() => {
		return (props.disabled === true);
	});
	const buttonClearDisabled = computed(() => {
		return (props.disabled === true);
	});
	const buttonDeleteDisabled = computed(() => {
		if (dirty.value === true)
			return true;
		return (props.disabled === true);
	});
	const buttonOkDisabled = computed(() => {
		if (props.buttonOkDisabledOverride)
			return props.buttonOkDisabledOverride(props.disabled, invalid.value, props.invalidOverride);
		if (dirty.value === false)
			return true;
		return (invalid.value || (props.disabled === true) || (props.invalidOverride != null ? props.invalidOverride : false));
	});
	const isCanceling = computed(() => {
		return dialogCancelConfirmSignal.value.signal;
	});
	const isClearing = computed(() => {
		return dialogClearConfirmSignal.value.signal;
	});
	const isDeleting = computed(() => {
		return dialogDeleteConfirmSignal.value.signal;
	});
	const isLoading = computed(() => {
		return isClearing.value || isDeleting.value || isSaving.value;
	});
	const overlayLoading = computed(() => {
		return isSaving.value && props.autoSave;
	});
	const scrollableI = computed(() => {
		return props.scrollable ? 'scrollable' : '';
	});
	const scrollableHeightI = computed(() => {
		return props.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(props.scrollableHeight) ? props.scrollableHeight : dialogHeightI).value + 'px;' : '';
	});

	const handleCancel = async () => {
		const correlationIdI = correlationId();
		serverErrors.value = [];
		if (dirty.value) {
			dialogCancelConfirmSignal.value.open(correlationIdI);
			return;
		}

		serverErrors.value = [];
		dialogSignal.value = false;
		reset(correlationIdI, false, true);
		logger.debug('useBaseFormDialogControlComponent', 'handleCancel', 'cancel', null, correlationIdI);
		context.emit('close');
	};
	const handleCancelConfirmOk = async(correlationId) => {
		dialogCancelConfirmSignal.value.ok();

		dialogSignal.value = false;
		logger.debug('useBaseFormDialogControlComponent', 'handleCancelConfirmOk', 'delete', null, correlationId);
		reset(correlationId, false, true);
		context.emit('close');
	};
	const handleClear = async () => {
		const correlationIdI = correlationId();
		if (dirty.value) {
			dialogClearConfirmSignal.value.open(correlationIdI);
			return;
		}

		logger.debug('useBaseFormDialogControlComponent', 'clear', 'clear', null, correlationIdI);
		await reset(correlationIdI, true, true);
	};
	const handleClearConfirmOk = async (correlationId) => {
		dialogClearConfirmSignal.value.ok();

		logger.debug('useBaseFormDialogControlComponent', 'clear', 'clear', null, correlationId);
		await reset(correlationId, true, true);
		context.emit('reset');
	};
	const handleDelete = async () => {
		serverErrors.value = [];
		dialogDeleteConfirmSignal.value.open(correlationId());
	};
	const handleDeleteConfirmOk = async(correlationId) => {
		dialogDeleteConfirmSignal.value.ok();
		serverErrors.value = [];

		if (props.preCompleteDelete) {
			const response = await props.preCompleteDelete(correlationId);
			logger.debug('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationId);
			if (hasFailed(response)) {
				logger.error('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationId);
				// TODO
				// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationId);

				if (props.notify)
					setNotify(correlationId, props.notifyMessageError);

				return;
			}
		}

		dialogSignal.value = false;
		logger.debug('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationId);
		reset(correlationId, false);
		context.emit('delete');
	};
	const onKeydown = async (e) => {
		if (e.key === 'Escape')
			await handleCancel();
	};
	const onResize = () => {
		const temp = window.innerHeight - 200;
		dialogHeightI.value = Math.ceil(temp * props.scrollableAutoResizeFactor);
	};
	const reset = async (correlationId, notify, previous) => {
		if (props.resetAdditional)
			await props.resetAdditional(correlationId, previous);

		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		// invalid.value = props.validation.$invalid;
		// silentErrors.value = props.validation.$silentErrors;
		// dirty.value = props.validation.$anyDirty;
		resetFormValidation(correlationId);
		isSaving.value = false;

		notify = notify !== null || notify !== undefined ? notify : true;
		if (props.notify && notify)
			setNotify(correlationId, props.notifyMessageReset);
	};
	const resetFormValidation = (correlationId) => {
		if (props.validation) {
			invalid.value = props.validation.$invalid;
			silentErrors.value = props.validation.$silentErrors;
			dirty.value = props.validation.$anyDirty;
		}
	};
	const set = async (correlationId) => {
		if (props.setAdditional)
			await props.setAdditional(correlationId);

		reset(correlationId, false, false);
	};
	const submit = async () => {
		const correlationIdI = correlationId();
		try {
			isSaving.value = true;
			serverErrors.value = [];

			const result = await props.validation.$validate();
			await props.validation.$reset();
			logger.debug('useBaseFormDialogControlComponent', 'submit', 'result', result, correlationIdI);
			if (!result)
				return;

			let response = { success: true };
			if (props.preCompleteOk) {
				response = await props.preCompleteOk(correlationIdI);
				logger.debug('useBaseFormDialogControlComponent', 'submit', 'response', response, correlationIdI);
				if (hasFailed(response)) {
					context.emit('error', response.err);
					logger.error('useBaseFormDialogControlComponent', 'submit', 'response', response, correlationIdI);
					// TODO
					// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationIdI);

					if (props.notify)
						setNotify(correlationId, props.notifyMessageError);

					return;
				}
			}

			logger.debug('useBaseFormDialogControlComponent', 'submit', 'ok', null, correlationId);
			context.emit('ok', response);

			if (LibraryCommonUtility.isNull(options) || 
				(!LibraryCommonUtility.isNull(options) && LibraryCommonUtility.isNull(options.resetOnSubmit)) || 
				options.resetOnSubmit == true) {
				await reset(correlationIdI, false);
			}

			if (props.notify && !String.isNullOrEmpty(props.notifyMessageSaved))
				setNotify(correlationIdI, props.notifyMessageSaved);

			if (!String.isNullOrEmpty(response.route))
				LibraryClientUtility.$navRouter.push(response.route);
		}
		catch (err) {
			context.emit('error', err);
			logger.exception('useBaseFormDialogControlComponent', 'submit', err, correlationId);
		}
		finally {
			isSaving.value = false;
			if (LibraryCommonUtility.isNull(options) || 
				(!LibraryCommonUtility.isNull(options) && LibraryCommonUtility.isNull(options.signalOnSubmit)) || 
				options.signalOnSubmit == true) {
					dialogSignal.value = false;
			}
		}
	};

	onMounted(async () => {
		onResize();

		resetFormValidation(correlationId());
	});

	watch(() => props.signal,
		(value) => {
			const correlationIdI = correlationId();
			context.emit(value ? 'open' : 'close');
			logger.debug('useBaseFormDialogControlComponent', 'signal', 'value', value, correlationIdI);
			dialogSignal.value = value;
			logger.debug('useBaseFormDialogControlComponent', 'signal', 'dialogSignal', dialogSignal.value, correlationIdI);

			reset(correlationIdI, false, false);

			if (value)
				window.addEventListener('keydown', onKeydown);
			else
				window.removeEventListener('keydown', onKeydown);
		}
	);
	watch(() => props.validation,
		async (value) => {
			resetFormValidation(correlationId());
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
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		setNotify,
		dialogHeightI,
		dialogCancelConfirmSignal,
		dialogClearConfirmSignal,
		dialogDeleteConfirmSignal,
		dialogSignal,
		dirty,
		invalid,
		messageCancel,
		messageClear,
		silentErrors,
		buttonCancelDisabled,
		buttonClearDisabled,
		buttonDeleteDisabled,
		buttonOkDisabled,
		isCanceling,
		isClearing,
		isDeleting,
		isLoading,
		overlayLoading,
		scrollableI,
		scrollableHeightI,
		handleCancel,
		handleCancelConfirmOk,
		handleClear,
		handleClearConfirmOk,
		handleDelete,
		handleDeleteConfirmOk,
		onResize,
		reset,
		submit
	};
};
</script>
