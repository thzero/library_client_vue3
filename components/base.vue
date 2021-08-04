<script>
import LibraryConstants from '@thzero/library_client/constants';

import LibraryUtility from '@thzero/library_common/utility';
import GlobalUtility from '@thzero/library_client/utility/global';

import Response from '@thzero/library_common/response';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

export default {
	name: 'Base',
	setup(props) {
		// const correlationId = () => {
		// 	return LibraryUtility.generateId();
		// };

		return {
			// correlationId
		};
	},
	data: () => ({
		logger: null,
		utility: null,
		serverErrors: []
	}),
	async created() { // TODO: to setup() https://javascript.plainenglish.io/differences-between-vue-2-and-vue-3-ee627e2c83a8
		this.logger = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_LOGGER);
	},
	methods: { // TODO: to setup() https://javascript.plainenglish.io/differences-between-vue-2-and-vue-3-ee627e2c83a8
		correlationId() {
			return LibraryUtility.generateId();
		},
		clone(value) {
			return LibraryUtility.cloneDeep(value);
		},
		error(clazz, method, message, err, code, errors, correlationId) {
			return Response.error(clazz, method, message, err, code, errors, correlationId);
		},
		getDateHuman(date) {
			return LibraryUtility.getDateHuman(date);
		},
		noBreakingSpaces() {
			return '\xa0';
		},
		notImplementedError() {
			throw new NotImplementedError();
		},
		observerIsNull(value) {
			return !value || Object.keys(value).length === 0;
		},
		success(correlationId) {
			return Response.success(correlationId);
		}
	}
};
</script>
