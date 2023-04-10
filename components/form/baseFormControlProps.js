export const baseFormControlProps = {
	autoSave: {
		type: Boolean,
		default: false
	},
	buttonCancel: {
		type: Boolean,
		default: false
	},
	buttonCancelName: {
		type: String,
		default: 'buttons.cancel'
	},
	buttonClear: {
		type: Boolean,
		default: true
	},
	buttonClearName: {
		type: String,
		default: 'buttons.clear'
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
	buttonOkName: {
		type: String,
		default: 'buttons.ok'
	},
	dirtyCallback: {
		type: Function,
		default: () => null
	},
	disabled: {
		type: Boolean,
		default: false
	},
	invalidCallback: {
		type: Function,
		default: () => null
	},
	label: {
		type: String,
		default: ''
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
	preCompleteCancel: {
		type: Function,
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
	readonly: {
		type: Boolean,
		default: null
	},
	resetForm: {
		type: Function,
		default: null
	},
	validation: {
		type: Object,
		default: null
	}
};
