<script>
import { ref } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useBaseEditComponent } from '@thzero/library_client_vue3/components/baseEdit';

import DialogSupport from '@thzero/library_client_vue3/components/support/dialog';

export function useAdminBaseListingComponent(props, context, options) {
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

	const dialogDeleteSignal = ref(new DialogSupport());
	const dialogDeleteItemId = ref(null);
	const dialogEditSignal = ref(new DialogSupport());
	const dialogEditItemTitle = ref('');
	const headers = ref([]);
	const lookups = ref([]);

	// the wrapping component supplies a template ref to its <EditDialog> so we can call reset() on open
	const editDialogRef = options && options.editDialogRef ? options.editDialogRef : ref(null);

	const defaultItem = () => {
		if (options && LibraryCommonUtility.isFunction(options.defaultItem))
			return options.defaultItem();
		notImplementedError();
	};
	const dialogDeleteCancel = async () => {
		dialogDeleteSignal.value.cancel();
		dialogDeleteItemId.value = null;
	};
	const dialogDeleteOk = async () => {
		dialogDeleteSignal.value.ok();
		dialogDeleteItemId.value = null;
	};
	const dialogDeleteOpen = async (item) => {
		dialogDeleteItemId.value = item.id;
		dialogDeleteSignal.value.open();
	};
	const dialogDeletePreCompleteOkDelete = async (correlationIdI, dispatcher, id) => {
		if (options && LibraryCommonUtility.isFunction(options.dialogDeletePreCompleteOkDelete))
			return await options.dialogDeletePreCompleteOkDelete(correlationIdI, dispatcher, id);
		notImplementedError();
	};
	const dialogDeletePreCompleteOk = async () => {
		return await dialogDeletePreCompleteOkDelete(correlationId(), LibraryClientUtility.$store.dispatcher, dialogDeleteItemId.value);
	};
	const dialogEditCancel = async () => {
		dialogEditSignal.value.cancel();
	};
	const dialogEditOk = async () => {
		dialogEditSignal.value.ok();
	};
	const dialogEditOpen = async (item, isNew) => {
		const title = isNew ? 'titles.new' : 'titles.edit';
		dialogEditItemTitle.value = LibraryClientUtility.$trans.t(title);
		await editDialogRef.value.reset(correlationId(), LibraryCommonUtility.cloneDeep(item ? item : LibraryCommonUtility.instantiate(defaultItem())));
		dialogEditSignal.value.open();
	};
	const getLookupName = (lookupsI, id) => {
		if (!id || !lookupsI)
			return '';

		const results = lookupsI.find(l => l.id == id);
		return results ? results.name : '';
	};
	const initializeHeaders = () => {
		if (options && LibraryCommonUtility.isFunction(options.initializeHeaders))
			return options.initializeHeaders();
		notImplementedError();
	};

	// old base initialized these in created()
	headers.value = initializeHeaders();

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
		dialogDeleteSignal,
		dialogDeleteItemId,
		dialogEditSignal,
		dialogEditItemTitle,
		headers,
		lookups,
		editDialogRef,
		defaultItem,
		dialogDeleteCancel,
		dialogDeleteOk,
		dialogDeleteOpen,
		dialogDeletePreCompleteOk,
		dialogDeletePreCompleteOkDelete,
		dialogEditCancel,
		dialogEditOk,
		dialogEditOpen,
		getLookupName,
		initializeHeaders
	};
};
</script>
