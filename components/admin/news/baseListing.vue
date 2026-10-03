<script>
import { computed, onMounted } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useAdminBaseListingComponent } from '@thzero/library_client_vue3/components/admin/baseListing';

// The admin news listing, without its template. The app registers the store's
// adminNews module; the framework package supplies the table headers through
// options.initializeHeaders.
export function useAdminNewsBaseListingComponent(props, context, options) {
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
	} = useAdminBaseListingComponent(props, context, {
		// a new item starts empty; null would leave the edit dialog nothing to bind to
		defaultItem: () => {
			if (options && LibraryCommonUtility.isFunction(options.defaultItem))
				return options.defaultItem();
			return {};
		},
		dialogDeletePreCompleteOkDelete: async (correlationIdI, dispatcher, id) => {
			return await dispatcher.adminNews.deleteAdminNews(correlationIdI, id);
		},
		...options
	});

	const news = computed(() => {
		const list = LibraryClientUtility.$store.adminNews ? LibraryClientUtility.$store.adminNews.news : null;
		return list ? list.slice(0) : [];
	});

	onMounted(async () => {
		await LibraryClientUtility.$store.dispatcher.adminNews.searchAdminNews(correlationId(), {});
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
		initializeHeaders,
		news
	};
};
</script>
