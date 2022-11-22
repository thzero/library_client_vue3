import { createPinia, defineStore } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

// import adminNews from './admin/news';
// import adminUsers from './admin/users';

import news from './news/pinia';
import user from './user/pinia';

class BaseStore {
	async initialize() {
		this.pinia = createPinia();

		this.actionDispatcher = {};

		const storeConfig = this._init();

		// enable strict mode (adds overhead!) for dev mode only
		// this.store.strict = process.env.DEV;

		// const pluginPersist = this._initPluginPersist();
		// if (pluginPersist)
			//this.store.plugins = [pluginPersist.plugin];

		// this.actionDispatcher = this.store.dispatcher;
		// delete this.store.dispatcher;

		// // const vuexStore = new Vuex.Store(this.store);
		// this.store = createStore(this.store);
		// this.store.dispatcher = this.actionDispatcher;

		const pluginPersist = this._initPluginPersist();
		if (pluginPersist) {
			//this.store.plugins = [pluginPersist.plugin];
			storeConfig.persist = pluginPersist;
			this.pinia.use(piniaPersist);
		}

		this.actionDispatcher = storeConfig.dispatcher;

		const logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);

		const storeFunc = defineStore('main', storeConfig);
		GlobalUtility.$store = storeFunc(this.pinia);
		GlobalUtility.$store.$logger = logger;

		// this._addModule('adminNews', adminNews);
		// this._addModule('adminUsers', adminUsers);
		this._addModule('news', news, logger);
		this._addModule('user', user, logger);
		// this._initModules();
		GlobalUtility.$store.dispatcher = this.actionDispatcher;

		console.debug(GlobalUtility);
		console.debug(GlobalUtility.$store);
		console.debug(GlobalUtility.$store.dispatcher);

		return this.pinia;
	}

	_addModule(name, storeConfig, logger) {
		this.actionDispatcher[name] = storeConfig.dispatcher;
		delete storeConfig.dispatcher;
		const storeFunc = defineStore(name, storeConfig);
		GlobalUtility.$store[name] = storeFunc(this.pinia);
		GlobalUtility.$store[name].$logger = logger;
	}

	_init() {
		throw new NotImplementedError();
	}

	_initModules() {
		throw new NotImplementedError();
	}

	_initPluginPersist() {
		return null;
	}
}

export default BaseStore;
