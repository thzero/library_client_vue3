<script>
import { computed, ref, watch } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import { useBaseEditComponent } from '@thzero/library_client_vue3/components/baseEdit';
import { useNotify } from '@thzero/library_client_vue3/components/notify';

import DialogSupport from '../support/dialog';

export function useBaseFormListingControlComponent(props, context, options) {
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

	const dialogCancelConfirmSignal = ref(new DialogSupport());
	const dialogClearConfirmSignal = ref(new DialogSupport());
	const dialogDeleteConfirmSignal = ref(new DialogSupport());
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

	const handleCancel = async () => {
		const correlationIdI = correlationId();
		serverErrors.value = [];
		if (dirty.value) {
			dialogCancelConfirmSignal.value.open(correlationIdI);
			return;
		}

		serverErrors.value = [];
		reset(correlationIdI, true, true);
		logger.debug('useBaseFormDialogControlComponent', 'handleCancel', 'cancel', null, correlationIdI);
		context.emit('close');
	};
	const handleCancelConfirmOk = async(correlationId) => {
		dialogCancelConfirmSignal.value.ok();

		logger.debug('useBaseFormDialogControlComponent', 'handleCancelConfirmOk', 'delete', null, correlationId);
		reset(correlationId, true, true);
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

		logger.debug('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationId);
		reset(correlationId, false);
		context.emit('delete');
	};
	const reset = async (correlationId, notify, previous) => {
		if (props.resetAdditional)
			await props.resetAdditional(correlationId, previous);

		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		invalid.value = props.validation.$invalid;
		silentErrors.value = props.validation.$silentErrors;
		dirty.value = props.validation.$anyDirty;
		isSaving.value = false;

		notify = notify !== null || notify !== undefined ? notify : true;
		if (props.notify && notify)
			setNotify(correlationId, props.notifyMessageReset);
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

			let response = { success: true, route: null };
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
		}
	};

	watch(() => props.validation,
		(value) => {
			// console.log('v.invalid: ' + value.$invalid);
			// console.log('v.error: ' + value.$error);
			// console.log('v.errors: ' + JSON.stringify(value));
			invalid.value = value.$invalid;
			silentErrors.value = value.$silentErrors;
			dirty.value = value.$anyDirty;
			// console.log('v.invalid: ' + invalid.value);
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
		dialogDeleteConfirmSignal,
		dirty,
		invalid,
		silentErrors,
		messageCancel,
		messageClear,
		buttonCancelDisabled,
		buttonClearDisabled,
		buttonDeleteDisabled,
		buttonOkDisabled,
		isCanceling,
		isClearing,
		isDeleting,
		isLoading,
		overlayLoading,
		handleCancel,
		handleCancelConfirmOk,
		handleClear,
		handleClearConfirmOk,
		handleDelete,
		handleDeleteConfirmOk,
		reset,
		submit
	};
};
</script>
