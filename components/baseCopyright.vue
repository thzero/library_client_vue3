<script>
import { computed } from 'vue';

import { useBaseComponent } from './base';

export function useBaseCopyrightComponent(props, context) {
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
	} = useBaseComponent(props, context);
	
	const author = computed(() => {
		return props.modelValue &&  props.modelValue.client && props.modelValue.client.author ? props.modelValue.client.author : '';
	});
	const authorUrl = computed(() => {
		return props.modelValue &&  props.modelValue.client && props.modelValue.client.author_url ? props.modelValue.client.author_url : '';
	});
	const copyright = computed(() => {
		return props.modelValue &&  props.modelValue.client && props.modelValue.client.copyright ? props.modelValue.client.copyright : '';
	});
	const hasAuthor = computed(() => {
		return props.modelValue &&  props.modelValue.client && props.modelValue.client.author;
	});
	const hasAuthorUrl = computed(() => {
		return props.modelValue &&  props.modelValue.client && props.modelValue.client.author_url && props.modelValue.client.author_url;
	});
	const hasCopyright = computed(() => {
		return props.modelValue &&  props.modelValue.client && props.modelValue.client.copyright && props.modelValue.client.author;
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
		author,
		authorUrl,
		copyright,
		hasAuthor,
		hasAuthorUrl,
		hasCopyright
	};
};
</script>
