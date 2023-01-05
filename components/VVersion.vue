<template>
	<div>
		<span v-if="version !== null">{{ $t('version.label') }} {{ $t('version.majorMinorDate', version.client) }}&nbsp;-&nbsp;{{ $t('version.majorMinorDate', version.server) }}</span>
	</div>
</template>

<script>
import { computed } from 'vue';

import { useBaseVersionComponent } from '@/library_vue/components/baseVersion';

export default {
	name: 'VtVersion',
	props: {
		modelValue: {
			type: Object,
			default: null
		}
	},
	setup(props, context) {
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
			version
		} = useBaseVersionComponent(props, context);

		const innerVersion = computed(() => {
			return props.version;
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
			version
		};
	}
};
</script>

<style scoped>
</style>
