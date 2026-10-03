<script>
import { computed, onMounted } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useAdminBaseListingComponent } from '@thzero/library_client_vue3/components/admin/baseListing';

// The admin users listing, without its template. The app registers the store's
// adminUsers module; the framework package supplies the table headers through
// options.initializeHeaders.
export function useAdminUsersBaseListingComponent(props, context, options) {
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
		// users come from sign-in, never from this listing
		defaultItem: () => {
			if (options && LibraryCommonUtility.isFunction(options.defaultItem))
				return options.defaultItem();
			return {};
		},
		dialogDeletePreCompleteOkDelete: async (correlationIdI, dispatcher, id) => {
			return await dispatcher.adminUsers.deleteAdminUser(correlationIdI, id);
		},
		...options
	});

	const users = computed(() => {
		const list = LibraryClientUtility.$store.adminUsers ? LibraryClientUtility.$store.adminUsers.users : null;
		return list ? list.slice(0) : [];
	});

	onMounted(async () => {
		await LibraryClientUtility.$store.dispatcher.adminUsers.searchAdminUsers(correlationId(), {});
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
		users
	};
};
</script>
