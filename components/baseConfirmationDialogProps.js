export const baseConfirmationDialogProps = {
	completeOk: {
		type: Function,
		default: null
	},
	message: {
		type: String,
		default: null
	},
	messageRaw: {
		type: Boolean,
		default: false
	},
	nonRecoverable: {
		type: Boolean,
		default: false
	},
	preCompleteOk: {
		type: Function,
		default: null
	},
	signal: {
		type: Boolean,
		default: false
	}
};
