<script>
import { computed, onMounted, ref, watch } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

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
		logger.debug('baseFormDialogControl', 'clear', 'clear', null, correlationIdI);
		reset(correlationIdI, false);
	};
	const handleClose = () => {
		const correlationIdI = correlationId();
		serverErrors.value = [];
		dialogSignal.value = false;
		reset(correlationIdI);
		logger.debug('baseFormDialogControl', 'cancel', 'cancel', null, correlationIdI);
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
			logger.debug('baseFormDialogControl', 'handleDeleteConfirmOk', 'response', response, correlationIdI);
			if (hasFailed(response)) {
				// TODO
				return;
			}
		}

		dialogSignal.value = false;
		logger.debug('BaseFormDialogControl', 'handleDeleteConfirmOk', 'delete', null, correlationIdI);
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

		message = (!transformed ? GlobalUtility.$trans.t(message) : message);
		if (String.isNullOrEmpty(message))
			return;

		notifyColor.value = null;
		notifyMessage.value = (!transformed ? GlobalUtility.$trans.t(message) : message);
		notifySignal.value = true;
	};
	const submit = async () => {
		const correlationIdI = correlationId();
		try {
			loading.value = true;

			serverErrors.value = [];

			const result = await props.validation.$validate();
			await props.validation.$reset();
			logger.debug('BaseFormDialogControl', 'submit', 'result', result, correlationIdI);
			if (!result)
				return;

			let response = { success: true, route: null };
			if (props.preCompleteOk) {
				response = await props.preCompleteOk(correlationIdI);
				logger.debug('BaseFormDialogControl', 'submit', 'response', response, correlationIdI);
				if (hasFailed(response)) {
					// VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationIdI); // TODO
					return;
				}
			}

			dialogSignal.value = false;
			logger.debug('BaseFormDialogControl', 'submit', 'ok', null, correlationId);
			context.emit('ok');
			handleClear(correlationId);

			if (props.notify && !String.isNullOrEmpty(props.notifyMessageSaved))
				setNotify(correlationIdII, props.notifyMessageSaved);

			if (!String.isNullOrEmpty(response.route))
				GlobalUtility.$navRouter.push(response.route);
		}
		catch (err) {
			logger.exception('BaseFormDialogControl', 'submit', err, correlationId);
		}
		finally {
			loading.value = false;
		}
	};

	onMounted(async () => {
		onResize();
	});

	watch(() => props.signal,
		(value) => {
			const correlationIdI = correlationId();
			context.emit(value ? 'open' : 'close');
			logger.debug('BaseFormDialogControl', 'signal', 'value', value, correlationIdI);
			dialogSignal.value = value;
			logger.debug('BaseFormDialogControl', 'signal', 'dialogSignal', dialogSignal.value, correlationIdI);
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
