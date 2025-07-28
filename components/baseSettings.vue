<script>
import { computed, onMounted, ref, watch } from 'vue';

import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import Response from '@thzero/library_common/response';

import { useBasePageEditComponent } from '@thzero/library_client_vue3/components/basePageEdit';

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
		successResponse,
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

	const gamerTag = ref('');
	const gamerTagDisplay = ref('');
	const fab = ref(false);
	const requestReset = ref(0);

	let gamerTagDisplayWatcher = null;

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
	const preCompleteOkI = async (correlationId, value) =>  {
		const settings = serviceStore.getters.user.getUserSettings();
		settings.gamerTag = gamerTag.value;
		settings.gamerTagDisplay = gamerTagDisplay.value;
		return settings;
	};
	const resetAdditionalI = (correlationId) =>  {
		try {
			if (gamerTagDisplayWatcher)
				gamerTagDisplayWatcher();
			gamerTagDisplayWatcher = null;

			const settings = serviceStore.getters.user.getUserSettings();
			// load display first, so watch doesn't overwrite it...
			gamerTagDisplay.value = !String.isNullOrEmpty(settings.gamerTagDisplay) ? settings.gamerTagDisplay : '';
			gamerTag.value = !String.isNullOrEmpty(settings.gamerTag) ? settings.gamerTag : '';
			if (String.isNullOrEmpty(settings.gamerTag))
				gamerTagDisplay.value = '';

			return settings;
		}
		finally {
			gamerTagDisplayWatcher = watch(() => gamerTagDisplay.value,
				(value, prev) => {
					gamerTag.value = toGamerTag(gamerTagDisplay.value);
				}
			);
		}
	};
	const toGamerTag = (tag) => {
		if (!tag)
			return;

		//  '"_\-=\.,a-zA-Z0-9 
		tag = tag.replace(' ', '_').replace("'", '-').replace('"', '-').replace('=', '-').replace(',','_');
		if (options.toGamerTagAdditional)
			tag = options.toGamerTagAdditional(tag);
		return tag;
	};

	onMounted(async () => {
		if (options && LibraryCommonUtility.isObject(options) && options.formRef && options.formRef.value)
			await options.formRef.value.reset(correlationId, false);
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
		beforeUnload,
		dirty,
		dirtyCheck,
		leaveCheck,
		cancel,
		close,
		gamerTag,
		gamerTagDisplay,
		fab,
		hasPicture,
		name,
		ok,
		open,
		picture,
		preComplete,
		preCompleteI,
		preCompleteOkI,
		resetAdditionalI,
		requestReset,
		serviceStore,
		serviceUsers,
		user
	};
};
</script>
