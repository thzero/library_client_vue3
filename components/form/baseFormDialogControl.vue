<script>
import { computed, onMounted, ref, watch } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
// import LibraryClientVueUtility from '@thzero/library_client_vue/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useBaseEditComponent } from '@/library_vue/components/baseEdit';

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
		isSaving,
		serverErrors,
		setErrors
	} = useBaseEditComponent(props, context, options);

	const dialogHeightI = ref(300);
	const dialogDeleteConfirmSignal = ref(new DialogSupport());
	const dialogSignal = ref(false);
	const dirty = ref(false);
	const loading = ref(false);
	const invalid = ref(true);
	const notifyColor = ref(null);
	const notifyMessage = ref(null);
	const notifySignal = ref(false);
	const notifyTimeout = ref(3000);

	const buttonOkDisabled = computed(() => {
		if (dirty.value === false)
			return true;
		return invalid.value;
	});
	const scrollableI = computed(() => {
		return props.scrollable ? 'scrollable' : '';
	});
	const scrollableHeightI = computed(() => {
		return props.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(props.scrollableHeight) ? props.scrollableHeight : dialogHeightI).value + 'px;' : '';
	});

	const handleClear = () => {
		const correlationIdI = correlationId();
		logger.debug('useBaseFormDialogControlComponent', 'clear', 'clear', null, correlationIdI);
		reset(correlationIdI, false);
	};
	const handleClose = () => {
		const correlationIdI = correlationId();
		serverErrors.value = [];
		dialogSignal.value = false;
		reset(correlationIdI);
		logger.debug('useBaseFormDialogControlComponent', 'cancel', 'cancel', null, correlationIdI);
		context.emit('close');
	};
	const handleDelete = async () => {
		serverErrors.value = [];
		dialogDeleteConfirmSignal.value.open(this.correlationId());
	};
	const handleDeleteConfirmOk = async() => {
		serverErrors.value = [];

		const correlationIdI = correlationId();

		dialogDeleteConfirmSignal.value.ok();

		if (props.preCompleteDelete) {
			const response = await props.preCompleteDelete(correlationIdI);
			logger.debug('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
			if (hasFailed(response)) {
				logger.error('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
				// TODO
				// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationIdI);
				
				const notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
				if (props.notify && notify)
					setNotify(correlationId, props.notifyMessageError);

				return;
			}
		}

		dialogSignal.value = false;
		logger.debug('useBaseFormDialogControlComponent', 'handleDeleteConfirmOk', 'delete', null, correlationIdI);
		context.emit('ok');
		clear(correlationIdI);
	};
	const onResize = () => {
		const temp = window.innerHeight - 200;
		dialogHeightI.value = Math.ceil(temp * props.scrollableAutoResizeFactor);
	};
	const reset = async (correlationId, notify, options) => {
		if (props.resetDialog)
			props.resetDialog(correlationId, options);
		serverErrors.value = [];
		await props.validation.$validate();
		await props.validation.$reset();
		loading.value = false;

		notify = notify !== null || notify !== undefined ? notify : true;
		if (props.notify && notify)
			setNotify(correlationIdI, props.notifyMessageReset);
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
			loading.value = true;

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
					logger.error('useBaseFormDialogControlComponent', 'submit', 'response', response, correlationIdI);
					// TODO
					// LibraryClientVueUtility.handleError(this.$refs.obs, this.serverErrors.value, response, correlationIdI);
					
					const notify = LibraryCommonUtility.isNotNull(notify) ? notify : true;
					if (props.notify && notify)
						setNotify(correlationId, props.notifyMessageError);

					return;
				}
			}

			dialogSignal.value = false;
			logger.debug('useBaseFormDialogControlComponent', 'submit', 'ok', null, correlationId);
			context.emit('ok');
			handleClear(correlationId);

			if (props.notify && !String.isNullOrEmpty(props.notifyMessageSaved))
				setNotify(correlationIdI, props.notifyMessageSaved);

			if (!String.isNullOrEmpty(response.route))
				LibraryClientUtility.$navRouter.push(response.route);
		}
		catch (err) {
			logger.exception('useBaseFormDialogControlComponent', 'submit', err, correlationId);
		}
		finally {
			loading.value = false;
		}
	};

	watch(() => props.signal,
		(value) => {
			const correlationIdI = correlationId();
			context.emit(value ? 'open' : 'close');
			logger.debug('useBaseFormDialogControlComponent', 'signal', 'value', value, correlationIdI);
			dialogSignal.value = value;
			logger.debug('useBaseFormDialogControlComponent', 'signal', 'dialogSignal', dialogSignal.value, correlationIdI);
		}
	);
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

	onMounted(async () => {
		onResize();
	});

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
		dialogHeightI,
		dialogDeleteConfirmSignal,
		dialogSignal,
		dirty,
		invalid,
		handleClear,
		handleClose,
		handleDelete,
		handleDeleteConfirmOk,
		loading,
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		onResize,
		reset,
		scrollableI,
		scrollableHeightI,
		setNotify,
		submit
	};
};
</script>
