import LibraryClientUtility from '@thzero/library_client/utility/index';

import AdminServicesBaseBoot from '@thzero/library_client/boot/adminServices';

import eventService from '@thzero/library_client_vue3/service/event';
import routerService from '@thzero/library_client_vue3/service/router';
import translateService from '@thzero/library_client_vue3/service/translate';

class VueAdminServicesBaseBoot extends AdminServicesBaseBoot {
	async _initialize() {
		await super._initialize();
	}

	_initializeInjector(framework, injector) {
		LibraryClientUtility.$injector = injector;
	}

	_initializeEvent(injector) {
		return new eventService(injector);
	}

	_initializeRouter(injector) {
		return new routerService(injector);
	}

	_initializeTranslate(injector) {
		return new translateService(injector);
	}
}

export default VueAdminServicesBaseBoot;
