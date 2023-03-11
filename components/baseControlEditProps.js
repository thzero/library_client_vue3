export const useBaseControlEditProps = {
	change: {
		type: Function,
		default: () => {}
	},
	disabled: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	},
	validation: {
		type: Object,
		default: null
	},
	vid: {
		type: String,
		default: ''
	},
	// must be included in props
	modelValue: {
		default: null
	}
};
