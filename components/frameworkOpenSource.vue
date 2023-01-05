<script>
import { useBaseOpenSourceComponent } from '@/library_vue/components/baseOpenSource';

export function useFrameworkOpenSourceComponent(props, context, options) {
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
		combineDependencies,
		data,
		dependenciesClient,
		dependenciesServer,
		// initializeDependenciesClientBase,
		key,
		serviceStore
	} = useBaseOpenSourceComponent(props, context, Object.assign(options, {
			initializeDependenciesClient: () => {
				return [
					{
						category: 'client',
						name: 'vuetify',
						url: 'https://github.com/vuetifyjs/vuetify',
						licenseName: 'MIT',
						licenseUrl: 'https://github.com/vuetifyjs/vuetify/blob/master/LICENSE.md'
					},
					{
						category: 'client',
						name: '@thzero/library_client_vue3_vuetify3_components',
						url: 'https://github.com/thzero/library_client_vue3_vuetify3_components',
						licenseName: 'MIT',
						licenseUrl: 'https://github.com/thzero/library_client_vue3_vuetify3_components/blob/master/license.md'
					}
				];
			}
		})
	);

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
		// initializeDependenciesClientBase,
		key,
		serviceStore
	};
};
</script>
