<script>
import { computed, ref } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseLayout } from './baseLayout';

import DialogSupport from '@thzero/library_client_vue3/components/support/dialog';

export function useBaseMainLayout(props, context, options) {
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
	} = useBaseLayout(props, context, options);

	const serviceAuth = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_AUTH);
	const serviceStore = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);

	const closeOnContentClick = ref(true);
	const dialogSignOut = ref(new DialogSupport());
	const displayDrawer = ref(false);
	const displayFooter = ref(options ? options.displayFooter ?? true : true);

	const isAuthCompleted = computed(() => {
		return serviceStore.user != null ? serviceStore.userAuthCompleted : false;
	});
	const isLoggedIn = computed(() => {
		return serviceStore.user != null ? serviceStore.userAuthIsLoggedIn : false;
	});

	const clickAbout = () => {
		LibraryClientUtility.$navRouter.push('/about');
	};
	const clickOpenSource = () => {
		LibraryClientUtility.$navRouter.push('/openSource');
	};
	const clickPrivcy = () => {
		LibraryClientUtility.$navRouter.push('/privacy');
	};
	const clickSignIn = () => {
		LibraryClientUtility.$navRouter.push('/auth');
	};
	const clickSignOut = async () => {
		dialogSignOut.value.open();
	};
	const clickSupport = () => {
		LibraryClientUtility.$navRouter.push('/support');
	};
	const dialogSignOutOk = async () => {
		dialogSignOut.value.ok();
		await serviceAuth.signOut(correlationId());
	};
	const toggleDrawer = async () => {
		displayDrawer.value = !displayDrawer.value;
		LibraryClientUtility.$EventBus.emit('toggle-drawer');
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
		clickAbout,
		clickOpenSource,
		clickPrivcy,
		clickSignIn,
		clickSignOut,
		clickSupport,
		dialogSignOut,
		dialogSignOutOk,
		displayDrawer,
		displayFooter,
		isAuthCompleted,
		isLoggedIn,
		serviceAuth,
		serviceStore,
		toggleDrawer
	};
};
</script>
