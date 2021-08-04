<script>
import { computed, getCurrentInstance } from 'vue';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import base from '../base';

export default {
	name: 'baseMarkdown',
	extends: base,
	props: {
		value: {
			type: String,
			default: ''
		}
	},
	setup (props) {
		const instance = getCurrentInstance();

		const serviceMarkup = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);

		const valueI = computed(() => {
			return props.value;
		});
		const display = computed(() => {
			const correlationId = instance.correlationId();
			return serviceMarkup.trimResults(correlationId, serviceMarkup.render(correlationId, valueI));
		});

		return Object.assign(base.setup(props), {
			display,
			valueI
		});
	}
	// computed: {
	// 	display() {
	// 		const correlationId = this.correlationId();
	// 		return this._serviceMarkup.trimResults(correlationId, instance._serviceMarkup.render(correlationId, this.value));
	// 	}
	// },
	// created() {
	// 	this._serviceMarkup = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);
	// }
};
</script>
