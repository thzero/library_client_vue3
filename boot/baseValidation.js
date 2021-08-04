import { defineRule } from 'vee-validate';

// import { ValidationObserver, ValidationProvider, extend } from 'vee-validate/dist/vee-validate.full.min';

class BaseValidate {
	// eslint-disable-next-line
	async execute(Vue, app, router, store) {
		defineRule('required', value => {
			if (!value || !value.length) {
				return 'This field is required';
			}

			return true;
		});
// 	// eslint-disable-next-line
// 	async execute(Vue, app, router, store) {
// 		extend('decimal', {
// 			validate: (value, { decimals = '*', separator = '.' } = {}) => {
// 				if (value === null || value === undefined || value === '') {
// 					return {
// 						valid: false
// 					};
// 				}
// 				if (Number(decimals) === 0) {
// 					return {
// 						valid: /^-?\d*$/.test(value)
// 					};
// 				}
// 				const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
// 				const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);
// 				return {
// 					valid: regex.test(value),
// 					data: {
// 						serverMessage: 'Only decimal values are available'
// 					}
// 				};
// 			},
// 			message: '{serverMessage}'
// 		});

// 		extend('name', {
// 			getMessage: field => 'The ' + field + ' field may only contain alphanumeric and space characters',
// 			// eslint-disable-next-line
// 			validate(value, args) {
// 				const regEx = /^[a-zA-Z0-9]+(['\-a-zA-Z0-9 ]*)*$/;
// 				return regEx.test(value);
// 			}
// 		});

// 		extend('tagLine', {
// 			getMessage: field => 'The ' + field + ' field may only contain alphanumeric, space, and punctuation characters',
// 			// eslint-disable-next-line
// 			validate(value, args) {
// 				const regEx = /^[a-zA-Z0-9]+([',.!& \-a-zA-Z0-9 ]*)*$/;
// 				return regEx.test(value);
// 			}
// 		});

		this._initialize();

// 		Vue.component('ValidationObserver', ValidationObserver);
// 		Vue.component('ValidationProvider', ValidationProvider);
	}

	// eslint-disable-next-line
	_initialize(extend) {
	}
}

export default BaseValidate;
