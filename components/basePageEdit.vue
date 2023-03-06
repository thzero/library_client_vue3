<script>
import { onMounted, onUnmounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseEditComponent } from './baseEdit';

export function useBasePageEditComponent(props, context, options) {
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
		setErrors
	} = useBaseEditComponent(props, context, options);

	const dirty = ref(false);

	const dirtyCheck = (correlationId, controlDirtyState) => {
		return dirty.value = controlDirtyState.value;
	};
	const leaveCheck = () => { 
		if (!dirty.value)
			return true;

		const result = window.confirm(LibraryClientUtility.$trans.t('questions.formDirty'));
		return result;
	};
	const beforeUnload = (event) => {
		if (!dirty.value)
			return;

		return event.returnValue = LibraryClientUtility.$trans.t('questions.formDirty');
	};
	
	onBeforeRouteLeave(async (to, from, next) => {
		if (!leaveCheck())
			return;

		next();
	});
	onMounted(async () => {
		window.addEventListener('beforeunload', beforeUnload);
	});
	onUnmounted(async () => {
		window.removeEventListener('beforeunload', beforeUnload);
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
		leaveCheck
	};
};
</script>
