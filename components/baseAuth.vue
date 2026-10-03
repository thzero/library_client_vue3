<script>
import { computed, onMounted, onUnmounted, ref } from 'vue';

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

	// features is a method on the service; read as a property, RememberMe was always undefined
	const featuresI = serviceFeatures ? serviceFeatures.features() : null;
	const allowRememberMe = ref(featuresI ? featuresI.RememberMe ?? false : false);
	const authenticated = ref(false);
	const disabled = ref(false);
	const features = ref(featuresI);
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

	const onAuth = (value) => {
		// was this.correlationId(), and a parameter named isLoggedIn that hid the ref
		logger.debug('useBaseAuthComponent', 'onAuth', 'isLoggedIn', value, correlationId());
		isLoggedIn.value = value;
		disabled.value = value;
	};

	onMounted(async () => {
		// TODO: not sure what this was doing...
		// await serviceAuth.signInCompleted();

		authenticated.value = await serviceAuth.isAuthenticated();
		if (authenticated.value)
			LibraryClientUtility.$navRouter.push('/');

		LibraryClientUtility.$EventBus.on('auth', onAuth);
	});

	onUnmounted(() => {
		LibraryClientUtility.$EventBus.off('auth', onAuth);
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
