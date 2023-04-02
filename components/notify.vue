<script>
import { ref } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';

export function useNotify(props, context, options) {
	const notifyColor = ref(null);
	const notifyMessage = ref(null);
	const notifySignal = ref(false);
	const notifyTimeout = ref(3000);

	const setNotify = (correlationId, message, transformed) => {
		if (String.isNullOrEmpty(message))
			return;

		message = (!transformed ? LibraryClientUtility.$trans.t(message) : message);
		if (String.isNullOrEmpty(message))
			return;

		notifyColor.value = null;
		notifyMessage.value = (!transformed ? LibraryClientUtility.$trans.t(message) : message);
		notifySignal.value = true;
	};

	return {
		notifyColor,
		notifyMessage,
		notifySignal,
		notifyTimeout,
		setNotify
	};
};
</script>
