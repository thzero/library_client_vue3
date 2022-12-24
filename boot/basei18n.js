import { createI18n } from 'vue-i18n';

import GlobalUtility from '@thzero/library_client/utility/global';

import Basei18n from '@thzero/library_client/boot/basei18n';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

class VueBasei18n extends Basei18n {
	// eslint-disable-next-line
	async execute(framework, app, router) {
		// Set i18n instance on app
		let options = {
			locale: 'en-us',
			fallbackLocale: 'en',
			fallbackWarn: false,
			messages: this._initMessages(), // messages,
			missingWarn: false,
			silentTranslationWarn: true,
		};
		this._initOptions(options);
		const i18n = createI18n(options);
		framework.use(i18n);
		GlobalUtility.i18n = i18n.global;
		GlobalUtility.$trans = i18n.global;
	}

	_initMessages() {
		throw new NotImplementedError();
	}

	_initOptions(options) {
	}
}

export default VueBasei18n;
