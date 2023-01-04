import { unref } from 'vue';

import Constants from '../constants';
import LibraryConstants from '@thzero/library_client/constants';
import LibraryCommonConstants from '@thzero/library_common/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

class Utility {
	static applyError(error, messageParams) {
		if (!error)
			return null;

		if (!error.code && !String.isNullOrEmpty(error.message)) {
			return {
				message: error.message,
				field: (error.field ? error.field : LibraryCommonConstants.ErrorFields.Generic)
			};
		}

		let messageCode = error.code;
		if (error.type)
			messageCode = `${messageCode}.${error.type}`;
		if (error.prefix)
			messageCode = `${error.prefix}.${messageCode}`;
		messageParams = { ...messageParams, ...error.params };

		let param;
		for (const field in messageParams) {
			param = messageParams[field];
			if (param.il8n) {
				let suffix = param.suffix;
				if (String.isNullOrEmpty(suffix))
					suffix = Constants.ErrorCodes.SuffixParams;
				param.value = GlobalUtility.$trans.t(`${suffix}.${param.value}`);
			}
			messageParams[field] = param.value;
		}

		if (String.isNullOrEmpty(messageCode))
			messageCode = Constants.ErrorCodes.Default;

		return {
			message: GlobalUtility.$trans.t(`${Constants.ErrorCodes.Suffix}.${messageCode}`, messageParams),
			field: (error.field ? error.field : LibraryCommonConstants.ErrorFields.Generic)
		};
	}

	static checkId(to, from, next) {
		return Utility.checkHasParams(to, from, next, 'id');
	}

	static checkHasParams(to, from, next, keys) {
		if (!to || !to.params) {
			Utility.invalid(next);
			return false;
		}

		if (!keys)
			return true;

		if (!Array.isArray(keys))
			keys = [ keys ];

		for (const key of keys) {
			if (!to.params[key] || (String.isNullOrEmpty(to.params[key])) || (to.params[key] === 'null') || (to.params[key] === 'undefined')) {
				Utility.invalid(next);
				return false;
			}
		}

		if (next)
			next();

		return true;
	}

	static fullscreen(vuetify) {
		return Utility.fullscreenDisplay(vuetify.display);
	}

	static fullscreenDisplay(display) {
		return unref(unref(display).xs);
	}

	static handleError(object, serverErrors, response) {
		if (!object || !serverErrors || !response)
			return;

		let errors = {};
		let error;
		for (const field in response.errors) {
			error = Utility.applyError(response.errors[field]);
			if (error.field === LibraryCommonConstants.ErrorFields.Generic) {
				serverErrors.push(error.message);
				continue;
			}
			// eslint-disable-next-line
			if (!errors.hasOwnProperty(error.field))
				errors[error.field] = [];
			errors[error.field].push(error.message);
		}

		object.setErrors(errors);
		// object.validation().applyResult({
		//     errors: [ GlobalUtility.$trans.t(`${Constants.ErrorCodes.Suffix}.${messageCode}`, messageParams) ],
		//     valid: false,
		//     failedRules: {} // should be empty since this is a manual error.
		//   })
	}

	static invalid(next) {
		if (next) {
			next('/');
			return;
		}

		GlobalUtility.$navRouter.push('/');
	}

	static overlayImageWidth() {
		let width = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
		if (width > 512)
			return '512px';

		return width *.75 + 'px';
	}

	static overlayProgressSize() {
		return (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * .25;
	}

	static randomKeyGen() {
		const high = 100000000000;
		const low = 0;
		return Math.floor(Math.random() * (high - low) + low);
	}

	static selectBlank(array, prompt) {
		if (!array)
			return array;

		prompt = prompt ? '<' + prompt + '>' : '';

		const temp = array.slice(0);
		temp.unshift({ id: null, name: prompt });
		return temp;
	}
	
	static selectOptions(options, trans, prefix, funcId, funcName, funcValue) {
		if (!options || !trans || !Array.isArray(options))
			return [];

		prefix = (prefix && prefix !== '') ? prefix + '.' : '';

		const output = options.map(l => {
			let id = l;
			if (funcId)
				id = funcId(l);

			let nameLookup = id;
			if (funcName)
				nameLookup = funcName(l);
			nameLookup = prefix + nameLookup;
			let name = trans(nameLookup);
			if (String.isNullOrEmpty(name) || name === nameLookup)
				name = trans(nameLookup + '.title');

			let value = l;
			if (funcValue)
				value = funcValue(l);

			return {
				id: id,
				name: name,
				value: value
			};
		});
		return output;
	}

	static settings() {
		return GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_SETTINGS);
	}

	static updateArrayById(array, object) {
		if (!object)
			return;

		// let index = array.findIndex(function(element) {
		// 	return element && element.id == object.id
		// })
		// if (index === -1)
		// 	array.push(object)
		// else
		// 	array[index] = object

		// return array
		let result = [
			...array.filter(element => element.id !== object.id),
			object
		];
		return result;
	}
}

export default Utility;
