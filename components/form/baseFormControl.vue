<script>
import { computed, ref, watch } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
// import LibraryClientVueUtility from '@thzero/library_client_vue/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useBaseEditComponent } from '@/library_vue/components/baseEdit';

import DialogSupport from '@/library_vue/components/support/dialog';

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
		isSaving,
		serverErrors,
		setErrors
	} = useBaseEditComponent(props, context, options);
	
	if (!props.dirtyCheck)
		throw Error('Requires dirtyCheck callback.');

	const dialogDeleteConfirmSignal = ref(new DialogSupport());
	const dirty = ref(false);
	const invalid = ref(true);
	const isClearing = ref(false);
	const notifyColor = ref(null);
	const notifyMessage = ref(null);
	const notifySignal = ref(false);
	const notifyTimeout = ref(3000);

	const buttonOkDisabled = computed(() => {
		if (dirty.value === false)
			return true;
		return (invalid.value || props.disabled);
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
	
	const handleClear = async (correlationId) => {
		isClearing.value = true;
		try {
			logger.debug('useBaseFormControlComponent', 'clear', 'clear', null, correlationId);
			await reset(correlationId);
		}
		finally {
			isClearing.value = false;
		}
	};
	const handleDelete = async () => {
		serverErrors.value = [];
		dialogDeleteConfirmSignal.value.open(correlationId());
	};
	const handleDeleteConfirmOk = async () => {
		serverErrors.value = [];

		const correlationIdI = correlationId();

		dialogDeleteConfirmSignal.value.ok();

		if (props.preCompleteDelete) {
			const response = await props.preCompleteDelete(correlationIdI);
			logger.debug('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
			if (hasFailed(response)) {
				logger.error('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
				// TODO
				// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationIdI);
				
				const notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
				if (props.notify && notify)
					setNotify(correlationId, props.notifyMessageError);

				return;
			}
		}

		logger.debug('useBaseFormControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationId);
		await handleClear(correlationId);
	};
	const reset = async (correlationId, notify, options) => {
		if (props.resetForm)
			props.resetForm(correlationId, options);
		logger.debug('useBaseFormControlComponent', 'clear', null, null, correlationId);
		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		isSaving.value = false;

		notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
		if (props.notify && notify)
			setNotify(correlationId, props.notifyMessageReset);
	};
	const setNotify = (correlationId, message, transformed) => {
		if (String.isNullOrEmpty(message))
			return;

		message = (!transformed ? LibraryClientUtility.$trans.t(message) : message);
		if (String.isNullOrEmpty(message))
			return;

		notifyColor.value = null;
		notifyMessage.value = (!transformed ? LibraryClientUtility.$trans.t(message) : message);
		notifySignal.value = true;
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
				
					const notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
					if (props.notify && notify)
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

	watch(() => props.validation,
		(value) => {
			// console.log('v.invalid: ' + value.$invalid);
			// console.log('v.error: ' + value.$error);
			// console.log('v.errors: ' + JSON.stringify(value));
			invalid.value = value.$invalid;
			dirty.value = value.$anyDirty;
			// console.log('v.invalid: ' + invalid.value);
		}
	);
	watch(() => dirty.value,
		(value) => {
			props.dirtyCheck(correlationId(), dirty);
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
		buttonOkDisabled,
		dialogDeleteConfirmSignal,
		dirty,
		invalid,
		isClearing,
		isDeleting,
		isLoading,
		overlayLoading,
		handleClear,
		handleDelete,
		handleDeleteConfirmOk,
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		reset,
		setNotify,
		submit
	};
};
</script>
