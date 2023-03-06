<script>
import { computed, onMounted, ref } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import Response from '@thzero/library_common/response';

import { useBasePageEditComponent } from '@/library_vue/components/basePageEdit';

export function useBaseSettingsComponent(props, context, options) {
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
		setErrors,
		beforeUnload,
		dirty,
		dirtyCheck,
		leaveCheck
	} = useBasePageEditComponent(props, context, options);

	const serviceStore = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);
	const serviceUsers = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_USER);

	const fab = ref(false);
	const requestReset = ref(0);

	const hasPicture = computed(() => {
		return (serviceStore.user != null && serviceStore.user.external != null && !String.isNullOrEmpty(serviceStore.user.external.picture));
	});
	const name = computed(() => {
		return (serviceStore.user != null && serviceStore.user.external != null && !String.isNullOrEmpty(serviceStore.user.external.name) ? serviceStore.user.external.name : '');
	});
	const picture = computed(() => {
		return (serviceStore.user != null && serviceStore.user.external != null && !String.isNullOrEmpty(serviceStore.user.external.picture) ? serviceStore.user.external.picture : '');
	});
	const user = computed(() => {
		return serviceStore.user;
	});
	
	const cancel = async () => {
		await reset(correlationId(), true);
	};
	const close = async () => {
	};
	const ok = async () => {
		return true;
	};
	const open = async () => {
	};
	const preComplete = async (correlationId) => {
		const responses = [];

		await preCompleteI(correlationId, responses);

		const response = Response.success(correlationId);
		for (const item of responses)
			response.success &= item.success;
		return response;
	};
	// eslint-disable-next-line
	const preCompleteI = async (correlationId, value) =>  {
	};
	const reset = async (correlationId, notify) => {
		if (options && LibraryCommonUtility.isObject(options) && options.formRef)
			await options.formRef.value.reset(correlationId, notify);
		// setTimeout(async () => {
		// 	if (options && LibraryCommonUtility.isObject(options) && options.formRef)
		// 		await options.formRef.value.reset(correlationId, notify);
		// },
		// 150);
	};
	// eslint-disable-next-line

	onMounted(async () => {
		await reset(correlationId(), false);
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
		isSaving,
		serverErrors,
		setErrors,
		beforeUnload,
		dirty,
		dirtyCheck,
		leaveCheck,
		cancel,
		close,
		fab,
		hasPicture,
		name,
		ok,
		open,
		picture,
		preComplete,
		preCompleteI,
		requestReset,
		reset,
		serviceStore,
		serviceUsers,
		user
	};
};
</script>
