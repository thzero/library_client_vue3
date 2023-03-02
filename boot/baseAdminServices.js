import LibraryClientUtility from '@thzero/library_client/utility/index';

import AdminServicesBaseBoot from '@thzero/library_client/boot/adminBaseServices';

import eventService from '../service/event';
import routerService from '../service/router';
import translateService from '../service/translate';

class VueAdminServicesBaseBoot extends AdminServicesBaseBoot {
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
