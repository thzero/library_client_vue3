<script>
import { onMounted } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import { useBaseComponent } from './base';

export function useBaseAppComponent(props, context, options) {
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

	GlobalUtility.$EventBus.on('auth-refresh', async (user) => {
		const correlationIdI = correlationId();
		logger.debug('useBaseAppComponent', 'created', 'auth-refresh', user, correlationIdI);
		// const items = await initialize(correlationIdI);
		// if (!items)
		// 	return;
		// await Promise.all(items);
	});

	onMounted(async () => {
		(async () => {
			const correlationIdI = correlationId();
			const items = await initialize(correlationIdI);
			if (!items)
				return;
			await Promise.all(items);
		})().catch(err => {
			// eslint-disable-next-line
			console.error(err);
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
		success
	};
};
</script>
