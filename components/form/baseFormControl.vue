<script>
import { computed, onMounted, ref, watch } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
// import LibraryClientVueUtility from '@thzero/library_client_vue/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useBaseEditComponent } from '@thzero/library_client_vue3/components/baseEdit';
import { useNotify } from '@thzero/library_client_vue3/components/notify';

import DialogSupport from '@thzero/library_client_vue3/components/support/dialog';

export function useBaseFormControlComponent(props, context, options) {
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

	// if (!props.dirtyCallback)
	// 	throw Error('Requires dirtyCallback callback.');

	const dialogCancelConfirmSignal = ref(new DialogSupport());
	const dialogClearConfirmSignal = ref(new DialogSupport());
	const dialogCloseConfirmSignal = ref(new DialogSupport());
	const dialogDeleteConfirmSignal = ref(new DialogSupport());
	const dirty = ref(false);
	const invalid = ref(true);
	const messageCancel = ref(LibraryClientUtility.$trans.t('questions.formDirty.cancel'));
	const messageClear = ref(LibraryClientUtility.$trans.t('questions.formDirty.clear'));
	const messageClose = ref(LibraryClientUtility.$trans.t('questions.formDirty.close'));
	const silentErrors = ref(true);

	const buttonCancelDisabled = computed(() => {
		if (dirty.value === false)
			return true;
		return (props.disabled === true);
	});
	const buttonClearDisabled = computed(() => {
		return (props.disabled === true);
	});
	const buttonCloseDisabled = computed(() => {
		if (dirty.value === true)
			return true;
		return (props.disabled === true);
	});
	const buttonDeleteDisabled = computed(() => {
		if (dirty.value === true)
			return true;
		return (props.disabled === true);
	});
	const buttonOkDisabled = computed(() => {
		if (dirty.value === false)
			return true;
		return (invalid.value || (props.disabled === true));
	});
	const isCancelling = computed(() => {
		return dialogCancelConfirmSignal.value.signal;
	});
	const isClearing = computed(() => {
		return dialogClearConfirmSignal.value.signal;
	});
	const isClosing = computed(() => {
		return dialogCloseConfirmSignal.value.signal;
	});
	const isDeleting = computed(() => {
		return dialogDeleteConfirmSignal.value.signal;
	});
	const isLoading = computed(() => {
		return isClearing.value || isClosing.value || isDeleting.value || isSaving.value;
	});
	const overlayLoading = computed(() => {
		return isSaving.value && props.autoSave;
	});

	const handleCancel = async () => {
		const correlationIdI = correlationId();
		serverErrors.value = [];
		if (dirty.value) {
			dialogCancelConfirmSignal.value.open(correlationIdI);
			return;
		}

		await reset(correlationIdI, false);
		context.emit('cancel');
	};
	const handleCancelConfirmOk = async (correlationId) => {
		dialogCancelConfirmSignal.value.ok();
		serverErrors.value = [];

		if (props.preCompleteCancel) {
			const response = await props.preCompleteCancel(correlationId);
			logger.debug('useBaseFormControlComponent', 'handleCancelConfirmOk', 'response', response, correlationId);
			if (hasFailed(response)) {
				logger.error('useBaseFormControlComponent', 'handleCancelConfirmOk', 'response', response, correlationId);
				// TODO
				// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationId);

				const notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
				if (props.notify && notify)
					setNotify(correlationId, props.notifyMessageError);

				return;
			}
		}

		logger.debug('useBaseFormControlComponent', 'handleCancelConfirmOk', 'cancel', null, correlationId);
		await reset(correlationId, false);
		context.emit('cancel');
	};
	const handleClear = async () => {
		const correlationIdI = correlationId();
		if (dirty.value) {
			dialogClearConfirmSignal.value.open(correlationIdI);
			return;
		}

		logger.debug('useBaseFormControlComponent', 'clear', 'clear', null, correlationIdI);
		await reset(correlationId, true, true);
		context.emit('reset');
	};
	const handleClearConfirmOk = async (correlationId) => {
		dialogClearConfirmSignal.value.ok();

		logger.debug('useBaseFormControlComponent', 'clear', 'clear', null, correlationId);
		await reset(correlationId, true, true);
		context.emit('reset');
	};
	const handleClose = async () => {
		const correlationIdI = correlationId();
		if (dirty.value) {
			dialogCloseConfirmSignal.value.open(correlationIdI);
			return;
		}

		logger.debug('useBaseFormControlComponent', 'close', 'close', null, correlationIdI);
		await reset(correlationId, false);
		context.emit('cancel');
	};
	const handleCloseConfirmOk = async (correlationId) => {
		dialogCloseConfirmSignal.value.ok();

		logger.debug('useBaseFormControlComponent', 'close', 'close', null, correlationId);
	};
	const handleDelete = async () => {
		serverErrors.value = [];
		dialogDeleteConfirmSignal.value.open(correlationId());
	};
	const handleDeleteConfirmOk = async (correlationId) => {
		dialogDeleteConfirmSignal.value.ok();
		serverErrors.value = [];

		if (props.preCompleteDelete) {
			const response = await props.preCompleteDelete(correlationId);
			logger.debug('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationId);
			if (hasFailed(response)) {
				logger.error('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationId);
				// TODO
				// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationId);

				const notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
				if (props.notify && notify)
					setNotify(correlationId, props.notifyMessageError);

				return;
			}
		}

		logger.debug('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationId);
		await reset(correlationId, false);
		context.emit('delete');
	};
	const reset = async (correlationId, notify, previous) => {
		if (props.resetAdditional)
			props.resetAdditional(correlationId, previous);
		logger.debug('useBaseFormControlComponent', 'reset', null, null, correlationId);
		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		// invalid.value = props.validation.$invalid;
		// silentErrors.value = props.validation.$silentErrors;
		// dirty.value = props.validation.$anyDirty;
		resetFormValidation(correlationId);
		isSaving.value = false;

		notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
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
	const submit = async () => {
		const correlationIdI = correlationId();
		try {
			isSaving.value = true;
			serverErrors.value = [];

			const result = await props.validation.$validate();
			logger.debug('useBaseFormControlComponent', 'submit', 'result', result, correlationIdI);
			if (!result)
				return;

			if (props.preCompleteOk) {
				const response = await props.preCompleteOk(correlationIdI);
				logger.debug('useBaseFormControlComponent', 'submit', 'response', response, correlationIdI);
				if (hasFailed(response)) {
					logger.error('useBaseFormControlComponent', 'submit', 'response', response, correlationIdI);

					// TODO
					// LibraryClientVueUtility.handleError($refs.obs, instance.ctx.serverErrors, response, correlationIdI);

					if (props.notify)
						setNotify(correlationId, props.notifyMessageError);

					return;
				}
			}

			await props.validation.$reset();
			logger.debug('useBaseFormControlComponent', 'submit', 'ok', null, correlationIdI);
			context.emit('ok');

			if (props.notify && !String.isNullOrEmpty(props.notifyMessageSaved))
				setNotify(correlationIdI, props.notifyMessageSaved);
		}
		catch (err) {
			logger.exception('useBaseFormControlComponent', 'submit', err, correlationIdI);
		}
		finally {
			isSaving.value = false;
		}
	};

	onMounted(async () => {
		resetFormValidation(correlationId());
	});

	watch(() => dirty.value,
		(value) => {
			if (props.dirtyCallback)
				props.dirtyCallback(correlationId(), dirty);
		}
	);
	watch(() => invalid.value,
		(value) => {
			if (props.invalidCallback)
				props.invalidCallback(correlationId(), invalid);
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
		dialogCancelConfirmSignal,
		dialogClearConfirmSignal,
		dialogCloseConfirmSignal,
		dialogDeleteConfirmSignal,
		dirty,
		invalid,
		messageCancel,
		messageClear,
		messageClose,
		silentErrors,
		buttonCancelDisabled,
		buttonClearDisabled,
		buttonCloseDisabled,
		buttonDeleteDisabled,
		buttonOkDisabled,
		isCancelling,
		isClearing,
		isClosing,
		isDeleting,
		isLoading,
		overlayLoading,
		handleCancel,
		handleCancelConfirmOk,
		handleClear,
		handleClearConfirmOk,
		handleClose,
		handleCloseConfirmOk,
		handleDelete,
		handleDeleteConfirmOk,
		reset,
		submit
	};
};
</script>
