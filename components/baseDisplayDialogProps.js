export const baseDisplayDialogBaseProps = {
	markup: {
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
};
