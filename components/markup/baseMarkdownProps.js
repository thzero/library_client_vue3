export const baseMarkdownProps = {
	useGithub: {
		type: Boolean,
		default: true
	},
	// must be included in props
	modelValue: {
		type: String,
		default: ''
	},
	tag: {
		type: String,
		default: 'div',
		validator(value) {
			return [ 'div', 'span' ].includes(value)
		}
	}
};