import LibraryClientUtility from '@thzero/library_client/utility/index';

import RootServicesBaseBoot from '@thzero/library_client/boot/rootServices';

import eventService from '../service/event';
import routerService from '../service/router';
import translateService from '../service/translate';

class VueRootServicesBaseBoot extends RootServicesBaseBoot {
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

export default VueRootServicesBaseBoot;
