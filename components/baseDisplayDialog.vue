<script>
import { computed, getCurrentInstance, ref } from 'vue';
import { useDisplay } from 'vuetify';

import VueUtility from '@thzero/library_client_vue3/utility/index';

import LibraryConstants from '@thzero/library_client/constants';

import base from './base';

export default {
	name: 'BaseDisplayDialog',
	extends: base,
	props: {
		// must be included in props
		value: {
			type: null,
			default: null
		},
		label: {
			type: String,
			default: ''
		},
		maxWidth: {
			type: String,
			default: '600px'
		},
		scrollable: {
			type: Boolean,
			default: true
		},
		scrollableAutoResize: {
			type: Boolean,
			default: false
		},
		scrollableAutoResizeFactor: {
			type: Number,
			default: 0.5
		},
		scrollableHeight: {
			type: String,
			default: null
		},
		signal: {
			type: Boolean,
			default: false
		}
	},
	setup (props) {
		const useDisplayI = useDisplay();

		const instance = getCurrentInstance();

		const serviceMarkup = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);

		const dialogSignal = ref(false);
		const internalItem = ref(null);

		const description = computed(() => {
			return instance.ctx.markup(instance.ctx.correlationId(), props.value);
		});
		const fullscreenInternal = computed(() => {
			return VueUtility.fullscreen(useDisplayI);
		});
		const scrollableI = computed(() => {
			return scrollable.value ? 'scrollable' : '';
		});
		const scrollableHeightI = computed(() => {
			return scrollableAutoResize.value ? 'height: ' + (!String.isNullOrEmpty(scrollableHeight.value) ? scrollableHeight.value : dialogHeightI.value) + 'px;' : '';
		});

		const dialogCancel = () => {
			dialogSignal.value = false;
			instance.ctx.$emit('cancel');
		};
		const dialogOk = async () => {
			dialogSignal.value = false;
			instance.ctx.$emit('ok');
		};
		const markup = (correlationId, value) => {
			if (!value)
				return null;
			return instance.ctx.serviceMarkup.trimResults(correlationId, instance.ctx.serviceMarkup.render(correlationId, value));
		};

		watch(signal, async (value) => {
			dialogSignal.value = value;
		});

		return Object.assign(base.setup(props), {
			description,
			dialogCancel,
			dialogOk,
			dialogSignal,
			fullscreenInternal,
			internalItem,
			markup,
			serviceMarkup,
			scrollableI,
			scrollableHeightI
		});
	},
	// data: () => ({
	// 	dialogSignal: false,
	// 	internalItem: null
	// }),
	// computed: {
	// 	description() {
	// 		return this.markup(this.correlationId(), this.value);
	// 	},
	// 	fullscreenInternal() {
	// 		return VueUtility.fullscreen(this.$vuetify);
	// 	},
	// 	scrollableI() {
	// 		return this.scrollable ? 'scrollable' : '';
	// 	},
	// 	scrollableHeightI() {
	// 		return this.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(this.scrollableHeight) ? this.scrollableHeight : this.dialogHeightI) + 'px;' : '';
	// 	}
	// },
	// watch: {
	// 	// Handles external model changes.
	// 	signal(value) {
	// 		this.dialogSignal = value;
	// 	}
	// },
	// created() {
	// 	this._serviceMarkup = Vue.prototype.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_MARKUP_PARSER);
	// },
	// methods: {
	// 	dialogCancel() {
	// 		this.dialogSignal = false;
	// 		this.$emit('cancel');
	// 	},
	// 	async dialogOk() {
	// 		this.dialogSignal = false;
	// 		this.$emit('ok');
	// 	},
	// 	markup(correlationId, value) {
	// 		if (!value)
	// 			return null;
	// 		return this._serviceMarkup.trimResults(correlationId, this._serviceMarkup.render(correlationId, value));
	// 	}
	// }
};
</script>
