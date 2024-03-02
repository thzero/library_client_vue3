export const baseFormDialogControlProps = {
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
	buttonCancelIgnoreConfirm: {
		type: Boolean,
		default: false
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
	fullscreen: {
		type: Boolean,
		default: false
	},
	invalidOverride: {
		type: Boolean,
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
	notifyMessageSaved: {
		type: String,
		default: 'messages.saved'
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
	setAdditional: {
		type: Function,
		default: null
	},
	signal: {
		type: Boolean,
		default: false
	},
	validation: {
		type: Object,
		default: null
	},
	width: {
		type: String,
		default: '600px'
	}
};
