export const baseFormListingControlProps = {
	buttonClear: {
		type: Boolean,
		default: true
	},
	buttonClearName: {
		type: String,
		default: 'buttons.clear'
	},
	buttonCancel: {
		type: Boolean,
		default: true
	},
	buttonCancelName: {
		type: String,
		default: 'buttons.cancel'
	},
	buttonCloseName: {
		type: String,
		default: 'buttons.close'
	},
	buttonDelete: {
		type: Boolean,
		default: false
	},
	buttonDeleteName: {
		type: String,
		default: 'buttons.delete'
	},
	buttonOk: {
		type: Boolean,
		default: true
	},
	buttonOkDisabledOverride: {
		type: Function,
		default: null
	},
	buttonOkName: {
		type: String,
		default: 'buttons.ok'
	},
	debug: {
		type: Boolean,
		default: false
	},
	filterDisabled: {
		type: Boolean,
		default: false
	},
	filterDrawer: {
		type: Boolean,
		default: false
	},
	invalidOverride: {
		type: Boolean,
		default: null
	},
	notify: {
		type: Boolean,
		default: true
	},
	notifyMessageError: {
		type: String,
		default: 'messages.error'
	},
	notifyMessageReset: {
		type: String,
		default: 'messages.reset'
	},
	notifyMessageSearch: {
		type: String,
		default: null
	},
	preCompleteDelete: {
		type: Function,
		default: null
	},
	preCompleteOk: {
		type: Function,
		default: null
	},
	resetAdditional: {
		type: Function,
		default: null
	},
	scrollable: {
		type: Boolean,
		default: false
	},
	scrollableAutoResize: {
		type: Boolean,
		default: true
	},
	scrollableAutoResizeFactor: {
		type: Number,
		default: 0.5
	},
	scrollableHeight: {
		type: String,
		default: '500'
	},
	validation: {
		type: Object,
		default: null
	},
	visibleFilters: {
		type: Boolean,
		default: true
	},
	visibleListing: {
		type: Boolean,
		default: true
	}
};
