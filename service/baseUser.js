import LibraryClientConstants from '@thzero/library_client/constants';

import BaseUserService from '@thzero/library_client/service/baseUser';

class VueBaseUserService extends BaseUserService {
	constructor() {
		super();

		this._serviceStore = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceStore = this._injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);
	}

	async resetUser(correlationId) {
		await this._serviceStore.dispatcher.user.resetUser(correlationId);
	}

	async setAuthCompleted(correlationId) {
		await this._serviceStore.dispatcher.user.setUserAuthCompleted(correlationId, true);
	}

	async setClaims(correlationId, claims) {
		await this._serviceStore.dispatcher.user.setUserClaims(correlationId, claims);
	}

	async setLoggedIn(correlationId, value) {
		await this._serviceStore.dispatcher.user.setUserLoggedIn(correlationId, value);
	}
	
	async setTokenResult(correlationId, tokenResult) {
		await this._serviceStore.dispatcher.user.setUserTokenResult(correlationId, tokenResult);
	}

	async setUser(correlationId, user) {
		await this._serviceStore.dispatcher.user.setUser(correlationId, user);
	}

	get token() {
		if (this._serviceStore.state.user) 
			return this._serviceStore.state.user.token;
		return null;
	}

	get user() {
		if (this._serviceStore.state.user) 
			return this._serviceStore.state.user.user;
		return null;
	}
}

export default VueBaseUserService;
