<script>
import { computed, onMounted, ref } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from './base';

export function useBaseAuthComponent(props, context, options) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	} = useBaseComponent(props, context, options);

	const serviceFeatures = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_FEATURES);
	const serviceAuth = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_AUTH);

	const allowRememberMe = ref(serviceFeatures && serviceFeatures.features ? serviceFeatures.features.RememberMe : false);
	const authenticated = ref(false);
	const disabled = ref(false);
	const features = ref(serviceFeatures.features);
	const isLoggedIn = ref(false);
	const rememberMe = ref(false);

	const display = computed(() => {
		return !isLoggedIn.value;
	});

	const signInGoogle = async () => {
		disabled.value = true;
		await serviceAuth.signIn(correlationId());
	};

	// onBeforeCreate(async () => {
	// 	authenticated.value = await serviceAuth.isAuthenticated;
	// 	if (authenticated.value)
	// 		LibraryClientUtility.$navRouter.push('/');
	// });
	(async () => {
		authenticated.value = await serviceAuth.isAuthenticated;
		if (authenticated.value)
			LibraryClientUtility.$navRouter.push('/');
	})();

	onMounted(async () => {
		await serviceAuth.signInCompleted();
		LibraryClientUtility.$EventBus.on('auth', isLoggedIn => {
			logger.debug('useBaseAuthComponent', 'mounted', 'isLoggedIn', isLoggedIn, this.correlationId());
			isLoggedIn.value = isLoggedIn;
			disabled.value = isLoggedIn;
		});
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
		allowRememberMe,
		authenticated,
		disabled,
		display,
		features,
		isLoggedIn,
		rememberMe,
		serviceAuth,
		signInGoogle
	};
};
</script>
