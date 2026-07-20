<script>
import { onMounted, ref } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useBaseComponent } from '@thzero/library_client_vue3/components/base';

import TabSupport from '@thzero/library_client_vue3/components/support/tab';

// Composition-API port of the former baseAdmin (drawer + tab support + drawer toggle event bus).
// A consumer supplies its tabs via options.initializeTabs(tabSupport), invoked during setup so the
// tabs exist for the first render.
export function useBaseAdminComponent(props, context, options) {
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

	const drawer = ref(false);
	const tabSupport = ref(new TabSupport());

	const clickTab = (value) => {
		tabSupport.value.changeTab(value);
	};
	const initializeTabs = () => {
		if (options && LibraryCommonUtility.isFunction(options.initializeTabs))
			return options.initializeTabs(tabSupport.value);
	};

	initializeTabs();

	onMounted(() => {
		LibraryClientUtility.$EventBus.on('toggle-drawer', () => {
			drawer.value = !drawer.value;
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
		drawer,
		tabSupport,
		clickTab,
		initializeTabs
	};
};
</script>
