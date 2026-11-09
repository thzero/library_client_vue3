import Constants from '../constants';
import LibraryClientConstants from '@thzero/library_client/constants';
import LibraryCommonConstants from '@thzero/library_common/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

class LibraryClientVueUtility {
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
				param.value = LibraryClientUtility.$trans.t(`${suffix}.${param.value}`);
			}
			messageParams[field] = param.value;
		}

		if (String.isNullOrEmpty(messageCode))
			messageCode = Constants.ErrorCodes.Default;

		const field = (error.field ? error.field : LibraryCommonConstants.ErrorFields.Generic);

		// The message for the error's own code, then one for its type alone (a
		// validation's 'any.required', with the field as {field}), then the
		// message the server sent, then the default. A missing translation came
		// back as its key, so the user saw 'errors.fameFactionId.any.required'.
		const keys = [ `${Constants.ErrorCodes.Suffix}.${messageCode}` ];
		if (error.type)
			keys.push(`${Constants.ErrorCodes.Suffix}.${error.type}`);
		for (const key of keys) {
			if (LibraryClientVueUtility._translationExists(key))
				return { message: LibraryClientUtility.$trans.t(key, { field: LibraryClientVueUtility._fieldName(error.field), ...messageParams }), field };
		}
		if (!String.isNullOrEmpty(error.message))
			return { message: error.message, field };
		return { message: LibraryClientUtility.$trans.t(`${Constants.ErrorCodes.Suffix}.${Constants.ErrorCodes.Default}`), field };
	}

	// The messages a failed response's errors come to, translated as applyError
	// does; field errors as well as generic ones, since a form can only show
	// them all together.
	static errorMessages(response) {
		if (!response || !Array.isArray(response.errors))
			return [];
		const messages = [];
		for (const item of response.errors) {
			const error = LibraryClientVueUtility.applyError(item);
			if (error && !String.isNullOrEmpty(error.message) && !messages.includes(error.message))
				messages.push(error.message);
		}
		return messages;
	}

	static checkId(to, from, next) {
		return LibraryClientVueUtility.checkHasParams(to, from, next, 'id');
	}

	static checkHasParams(to, from, next, keys) {
		if (!to || !to.params) {
			LibraryClientVueUtility.invalid(next);
			return false;
		}

		if (!keys)
			return true;

		if (!Array.isArray(keys))
			keys = [ keys ];

		for (const key of keys) {
			if (!to.params[key] || (String.isNullOrEmpty(to.params[key])) || (to.params[key] === 'null') || (to.params[key] === 'undefined')) {
				LibraryClientVueUtility.invalid(next);
				return false;
			}
		}

		if (next)
			next();

		return true;
	}

	// Puts a failed response's messages in serverErrors, the list a form shows,
	// field errors included: they used to go to vee-validate's setErrors, which
	// Vue 3 forms do not have. An object with setErrors still gets them by field.
	static handleError(object, serverErrors, response) {
		if (!serverErrors || !response)
			return;

		for (const message of LibraryClientVueUtility.errorMessages(response)) {
			if (!serverErrors.includes(message))
				serverErrors.push(message);
		}

		if (!object || (typeof object.setErrors !== 'function'))
			return;

		const errors = {};
		for (const item of (response.errors ?? [])) {
			const error = LibraryClientVueUtility.applyError(item);
			if (!error || (error.field === LibraryCommonConstants.ErrorFields.Generic))
				continue;
			(errors[error.field] ??= []).push(error.message);
		}
		object.setErrors(errors);
	}

	static invalid(next) {
		if (next) {
			next('/');
			return;
		}

		LibraryClientUtility.$navRouter.push('/');
	}

	// innerWidth and innerHeight are optional, and default to the window's. Pass
	// them from a reactive source, such as vuetify's useDisplay, when the caller
	// wraps this in a computed: window.innerWidth is not reactive, so a computed
	// that reads it is evaluated once and never again.
	static overlayImageWidth(innerWidth, innerHeight) {
		const outer = (innerWidth ?? window.innerWidth);
		const height = (innerHeight ?? window.innerHeight);
		const width = (outer > height ? height : outer);
		if (width > 512)
			return '512px';

		return width *.75 + 'px';
	}

	static overlayProgressSize(innerWidth, innerHeight) {
		const width = (innerWidth ?? window.innerWidth);
		const height = (innerHeight ?? window.innerHeight);
		return (width > height ? height : width) * .25;
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
		if (!options || !Array.isArray(options))
			return [];

		prefix = (prefix && prefix !== '') ? prefix + '.' : '';

		const output = options.map(l => {
			let id = l;
			if (funcId)
				id = funcId(l);

			let name = id;
			if (trans) {
				let nameLookup = id;
				if (funcName)
					nameLookup = funcName(l);
				nameLookup = prefix + nameLookup;

				name = trans(nameLookup);
				if (String.isNullOrEmpty(name) || name === nameLookup)
					name = trans(nameLookup + '.title');
			}
			else if (funcName)
				name = funcName(l);

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
		return LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_SETTINGS);
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

	// The field as the user knows it, from errors.fields.<field>, else as sent.
	static _fieldName(field) {
		if (String.isNullOrEmpty(field))
			return field;
		const key = `${Constants.ErrorCodes.Suffix}.fields.${field}`;
		return LibraryClientVueUtility._translationExists(key) ? LibraryClientUtility.$trans.t(key) : field;
	}

	static _translationExists(key) {
		const trans = LibraryClientUtility.$trans;
		if (!trans)
			return false;
		if (typeof trans.te === 'function')
			return trans.te(key);
		return trans.t(key) !== key;
	}
}

export default LibraryClientVueUtility;
