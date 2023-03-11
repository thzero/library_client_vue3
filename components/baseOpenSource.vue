<script>
import { onMounted, ref } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import { useBaseComponent } from './base';

export function useBaseOpenSourceComponent(props, context, options) {
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
	} = useBaseComponent(props, context);

	const serviceStore = LibraryClientUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);
	const data = ref('800px');
	const dependenciesClient = ref([]);
	const dependenciesServer = ref([]);

	const combineDependencies = (target, source, category) => {
		let output = target !== null && Array.isArray(target) ? target : [];

		if (source && Array.isArray(source)) {
			source.forEach(element => {
				if (element.category !== category)
					return;
				if (output.filter(l => l.name === element.name).length > 0)
					return;
				output.push(element);
			});
		}

		output = output.sort((a, b) => a.name.localeCompare(b.name));
		return output;
	};
	const initializeDependenciesClientBase = async () => {
		const temp = await import('open-source-config');
		const openSournce = temp.useDependenciesClientBase();
		let output = [];
		let items;
		for (const source of openSournce) {
			items = source();
			output = combineDependencies(output, items, 'client');
		}
		return output;
	};
	const key = (index, prefix, secondary) => {
		return prefix + '' + index + '' + secondary;
	};

	onMounted(async () => {
		dependenciesClient.value = combineDependencies(
			await initializeDependenciesClientBase(),
			'client');
		
		if (options && LibraryCommonUtility.isObject(options) && LibraryCommonUtility.isFunction(options.initializeDependenciesClientFramework))
			dependenciesClient.value = combineDependencies(
				dependenciesClient.value,
				await options.initializeDependenciesClientFramework(),
				'client');

		if (options && LibraryCommonUtility.isObject(options) && LibraryCommonUtility.isFunction(options.initializeDependenciesClient))
			dependenciesClient.value = combineDependencies(
				dependenciesClient.value,
				await options.initializeDependenciesClient(),
				'client');

		const response = await serviceStore.dispatcher.requestOpenSource();
		if (hasFailed(response))
			return;
		dependenciesServer.value = response.results;
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
		combineDependencies,
		data,
		dependenciesClient,
		dependenciesServer,
		key,
		serviceStore
	};
};
</script>
