<script>
import { computed } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import base from './base';

export default {
	name: 'BaseLoadingOverlay',
	extends: base,
	props: {
		message: {
			type: String,
			default: null
		},
		signal: {
			type: Boolean,
			default: false
		},
		timeout: {
			type: Number,
			default: null
		}
	},
	setup (props) {
		const displayMessage = computed(() => {
			return !String.isNullOrEmpty(props.message) ? props.message : LibraryClientUtility.$trans.t('messages.loading');
		});

		return Object.assign(base.setup(props), {
			displayMessage
		});
	}
};
</script>
