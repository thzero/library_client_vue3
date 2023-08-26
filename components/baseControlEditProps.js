export const useBaseControlEditProps = {
	change: {
		type: Function,
		default: () => {}
	},
	clearable: {
		type: Boolean,
		default: true
	},
	disabled: {
		type: Boolean,
		default: false
	},
	errors: {
		type: Array,
		default: null
	},
	errorsReadonly: {
		type: Array,
		default: null
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
