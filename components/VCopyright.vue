<template>
	<span v-if="modelValue !== null">
		© <span v-if="hasCopyright">{{ copyright }}</span>
		<a
			v-if="hasAuthor"
			class="ml-1"
			target="_blank"
			:href="authorUrl"
		>{{ author }}</a>
	</span>
</template>

<script>
import { useBaseCopyrightComponent } from '@/library_vue/components/baseCopyright';

export default {
	name: 'VtCopyright',
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
			author,
			authorUrl,
			copyright,
			hasAuthor,
			hasAuthorUrl,
			hasCopyright
		} = useBaseCopyrightComponent(props, context);

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
			author,
			authorUrl,
			copyright,
			hasAuthor,
			hasAuthorUrl,
			hasCopyright
		};
	}
};
</script>

<style scoped>
</style>
