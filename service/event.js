import LibraryClientUtility from '@thzero/library_client/utility/index';

import EventService from '@thzero/library_client/service/event';

class VueEventService extends EventService {
	emit(channel, value) {
		LibraryClientUtility.$EventBus.emit(channel, value);
	}
}

export default VueEventService;
