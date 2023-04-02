<script>
import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import Response from '@thzero/library_common/response';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

export function useBaseComponent(props, context, options) {
	const logger = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_LOGGER);

	const correlationId = () => {
		return LibraryCommonUtility.correlationId();
	};
	const error = (clazz, method, message, err, code, errors, correlationId) => {
		return Response.error(clazz, method, message, err, code, errors, correlationId);
	};
	const hasFailed = (response) => {
		return Response.hasFailed(response);
	};
	const hasSucceeded = (response) => {
		return Response.hasSucceeded(response);
	};
	const initialize = async () => {
		if (options && LibraryCommonUtility.isObject(options), LibraryCommonUtility.isFunction(options.initializeI))
			return await options.initializeI();
		return null;
	};
	const noBreakingSpaces = () => {
		return '\xa0';
	};
	const notImplementedError = () => {
		throw new NotImplementedError();
	};
	const success = (correlationId, results) => {
		return Response.success(correlationId, results);
	};
	const successResponse = (correlationId, results) => {
		return Response.success(correlationId, results);
	};

	return {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success,
		successResponse
	};
};
</script>
