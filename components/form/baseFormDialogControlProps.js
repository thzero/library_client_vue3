export const baseFormDialogControlProps = {
	buttonCancel: {
		type: Boolean,
		default: true
	},
	buttonClear: {
		type: Boolean,
		default: true
	},
	buttonDelete: {
		type: Boolean,
		default: false
	},
	buttonOk: {
		type: Boolean,
		default: true
	},
	fullscreen: {
		type: Boolean,
		default: false
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
	resetDialog: {
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
