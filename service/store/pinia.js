import LibraryClientUtility from '@thzero/library_client/utility/index';

import Service from '@thzero/library_client/service/index';

class PiniaStoreService extends Service {
	get dispatcher() {
		return LibraryClientUtility.$store.dispatcher;
	}

	get getters() {
		return LibraryClientUtility.$store;
	}

	get state() {
		return LibraryClientUtility.$store;
	}
}

export default PiniaStoreService;
