<script>
import { computed, onMounted, ref, watch } from 'vue';

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
	const isSearching = ref(false);
	const messageCancel = ref(LibraryClientUtility.$trans.t('questions.formDirty.cancel'));
	const messageClear = ref(LibraryClientUtility.$trans.t('questions.formDirty.clear'));
	const silentErrors = ref(true);
	const toggleDrawer = ref(false);

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
		return isClearing.value || isDeleting.value || isSearching.value;
	});
	const overlayLoading = computed(() => {
		return isSearching.value && props.autoSave;
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
		logger.debug('useBaseFormListingControlComponent', 'handleCancel', 'cancel', null, correlationIdI);
		context.emit('close');
	};
	const handleCancelConfirmOk = async(correlationId) => {
		dialogCancelConfirmSignal.value.ok();

		logger.debug('useBaseFormListingControlComponent', 'handleCancelConfirmOk', 'delete', null, correlationId);
		reset(correlationId, true, true);
		context.emit('close');
	};
	const handleClear = async () => {
		const correlationIdI = correlationId();
		if (dirty.value) {
			dialogClearConfirmSignal.value.open(correlationIdI);
			return;
		}

		logger.debug('useBaseFormListingControlComponent', 'clear', 'clear', null, correlationIdI);
		await reset(correlationIdI, true, true);
	};
	const handleClearConfirmOk = async (correlationId) => {
		dialogClearConfirmSignal.value.ok();

		logger.debug('useBaseFormListingControlComponent', 'clear', 'clear', null, correlationId);
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
			logger.debug('useBaseFormListingControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationId);
			if (hasFailed(response)) {
				logger.error('useBaseFormListingControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationId);
				// TODO
				// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationId);

				if (props.notify)
					setNotify(correlationId, props.notifyMessageError);

				return;
			}
		}

		logger.debug('useBaseFormListingControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationId);
		reset(correlationId, false);
		context.emit('delete');
	};
	const handleFilter = async () => {
		toggleDrawer.value = true;
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
		isSearching.value = false;

		notify = notify !== null || notify !== undefined ? notify : true;
		if (props.notify && notify)
			setNotify(correlationId, props.notifyMessageReset);
	};
	const resetForm = async (value) => {
		if (value) {
			invalid.value = value.$invalid;
			silentErrors.value = value.$silentErrors;
			dirty.value = value.$anyDirty;
		}
	};
	const submit = async () => {
		const correlationIdI = correlationId();
		try {
			isSearching.value = true;
			serverErrors.value = [];

			const result = await props.validation.$validate();
			await props.validation.$reset();
			logger.debug('useBaseFormListingControlComponent', 'submit', 'result', result, correlationIdI);
			if (!result)
				return;

			let response = { success: true, route: null };
			if (props.preCompleteOk) {
				response = await props.preCompleteOk(correlationIdI);
				logger.debug('useBaseFormListingControlComponent', 'submit', 'response', response, correlationIdI);
				if (hasFailed(response)) {
					context.emit('error', response.err);
					logger.error('useBaseFormListingControlComponent', 'submit', 'response', response, correlationIdI);
					// TODO
					// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationIdI);

					if (props.notify)
						setNotify(correlationId, props.notifyMessageError);

					return;
				}
			}

			logger.debug('useBaseFormListingControlComponent', 'submit', 'ok', null, correlationId);
			context.emit('ok', response);

			if (LibraryCommonUtility.isNull(options) || 
				(!LibraryCommonUtility.isNull(options) && LibraryCommonUtility.isNull(options.resetOnSubmit)) || 
				options.resetOnSubmit == true) {
				await reset(correlationIdI, false);
			}

			const notifySaved = options.notifySaved ?? true;
			if (props.notify && notifySaved &&!String.isNullOrEmpty(props.notifyMessageSearch))
				setNotify(correlationIdI, props.notifyMessageSearch);

			if (!String.isNullOrEmpty(response.route))
				LibraryClientUtility.$navRouter.push(response.route);
		}
		catch (err) {
			context.emit('error', err);
			logger.exception('useBaseFormListingControlComponent', 'submit', err, correlationId);
		}
		finally {
			isSearching.value = false;
			toggleDrawer.value = false;
		}
	};

	onMounted(async () => {
		await resetForm(props.validation);
	});

	watch(() => props.validation,
		async (value) => {
			// // console.log('v.invalid: ' + value.$invalid);
			// // console.log('v.error: ' + value.$error);
			// // console.log('v.errors: ' + JSON.stringify(value));
			// invalid.value = value.$invalid;
			// silentErrors.value = value.$silentErrors;
			// dirty.value = value.$anyDirty;
			// // console.log('v.invalid: ' + invalid.value);
			await resetForm(value);
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
		isSearching,
		messageCancel,
		messageClear,
		silentErrors,
		toggleDrawer,
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
		handleFilter,
		reset,
		submit
	};
};
</script>
