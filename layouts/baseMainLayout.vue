<script>
import { computed, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import { useBaseLayout } from './baseLayout';

import DialogSupport from '@/library_vue/components/support/dialog';

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

	const serviceAuth = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_AUTH);
	const serviceStore = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);

	const closeOnContentClick = ref(true);
	const dialogSignOut = ref(new DialogSupport());
	const drawer = ref(false);

	const isAuthCompleted = computed(() => {
		return serviceStore.user != null ? serviceStore.userAuthCompleted : false;
	});
	const isLoggedIn = computed(() => {
		return serviceStore.user != null ? serviceStore.userAuthIsLoggedIn : false;
	});

	const clickAbout = () => {
		GlobalUtility.$navRouter.push('/about');
	};
	const clickOpenSource = () => {
		GlobalUtility.$navRouter.push('/openSource');
	};
	const clickSignIn = () => {
		GlobalUtility.$navRouter.push('/auth');
	};
	const clickSignOut = async () => {
		dialogSignOut.value.open();
	};
	const clickSupport = () => {
		GlobalUtility.$navRouter.push('/support');
	};
	const dialogSignOutOk = async () => {
		dialogSignOut.value.ok();
		await serviceAuth.signOut(correlationId());
	};
	const toggleDrawer = async () => {
		drawer.value = !drawer.value;
		GlobalUtility.$EventBus.emit('toggle-drawer');
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
		clickSignIn,
		clickSignOut,
		clickSupport,
		dialogSignOut,
		dialogSignOutOk,
		drawer,
		isAuthCompleted,
		isLoggedIn,
		serviceAuth,
		serviceStore,
		toggleDrawer
	};
};
</script>
