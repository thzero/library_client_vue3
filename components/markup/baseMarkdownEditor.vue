<script>
import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

// Vue3 Options-API port of the former baseMarkdownEditor. VtMarkdownEditor extends this and renders
// <VtTextAreaWithValidation v-model="innerValue"> alongside the rendered `preview`. Two-way binding
// is exposed via the standard modelValue / update:modelValue contract.
export default {
	name: 'baseMarkdownEditor',
	props: {
		modelValue: {
			type: String,
			default: ''
		},
		vid: {
			type: String,
			default: ''
		}
	},
	emits: ['update:modelValue'],
	data: () => ({
		innerValue: '',
		watchStop: null
	}),
	computed: {
		preview() {
			const correlationId = LibraryCommonUtility.correlationId();
			return this._serviceMarkup.trimResults(correlationId, this._serviceMarkup.render(correlationId, this.innerValue ? this.innerValue : ''));
		}
	},
	watch: {
		// eslint-disable-next-line
		modelValue(newValue, preValue) {
			this.initValue(newValue);
		}
	},
	created() {
		this._serviceMarkup = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_MARKUP_PARSER);
	},
	mounted() {
		this.initValue(this.modelValue);
	},
	methods: {
		initValue(value) {
			this.innerValue = value;
			if (this.watchStop)
				return;

			this.watchStop = this.$watch('innerValue', async (newVal) => {
				this.$emit('update:modelValue', newVal);
			});
		}
	}
};
</script>
