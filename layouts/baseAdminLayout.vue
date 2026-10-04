<script>
import { computed, ref } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseLayout } from '@thzero/library_client_vue3/layouts/baseLayout';

import DialogSupport from '@thzero/library_client_vue3/components/support/dialog';

export function useBaseAdminLayout(props, context, options) {
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
		features
	} = useBaseLayout(props, context);

	const serviceAuth = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_AUTH);
	const serviceStore = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);

	const closeOnContentClick = ref(true);
	const dialogSignOut = ref(new DialogSupport());

	// authCompleted alone marks that auth resolved, with or without a user;
	// gating on a user left the loading overlay up forever for a visitor who is
	// not signed in. The `&&` also handed the Boolean signal prop a null.
	const isAuthCompleted = computed(() => {
		return serviceStore.userAuthCompleted;
	});
	const isLoggedIn = computed(() => {
		return serviceStore.user && serviceStore.userAuthIsLoggedIn;
	});

	const clickAbout = () => {
		LibraryClientUtility.$navRouter.push('/about');
	};
	const clickSignIn = async () => {
		LibraryClientUtility.$navRouter.push('/auth');
	};
	const dialogSignOutOk = async () => {
		dialogSignOut.value.ok();
		await serviceAuth.signOut(correlationId());
	};

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
		features,
		closeOnContentClick,
		dialogSignOut,
		isAuthCompleted,
		isLoggedIn,
		clickAbout,
		clickSignIn,
		dialogSignOutOk
	};
};
</script>
