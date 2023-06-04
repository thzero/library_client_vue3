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
		success,
		successResponse
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

	// (async () => {
	// 	authenticated.value = serviceAuth.isAuthenticated;
	// 	if (authenticated.value)
	// 		LibraryClientUtility.$navRouter.push('/');
	// })();

	onMounted(async () => {
		// TODO: not sure what this was doing...
		// await serviceAuth.signInCompleted();

		authenticated.value = await serviceAuth.isAuthenticated();
		if (authenticated.value)
			LibraryClientUtility.$navRouter.push('/');

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
		successResponse,
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
