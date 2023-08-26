<script>
import { computed, onMounted, ref, watch } from 'vue';

import LibraryCommonUtility from '@thzero/library_common/utility/index';

import { useBaseEditComponent } from './baseEdit';

export function useBaseControlEditComponent(props, context, options) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success,
		successResponse,
		isSaving,
		serverErrors,
		setErrors
	} = useBaseEditComponent(props, context, options);

	const innerValue = ref(null);
	// const watchInner = ref(null);

	const vid = options && options.vidOverride ? options.vidOverride : props.vid;

	const convertValue = (value) => {
		if (options && LibraryCommonUtility.isObject(options) && LibraryCommonUtility.isFunction(options.convertValueI))
			return options.convertValueI(value);
		return value;
	};
	const errorI = computed(() => {
		if (props.readonly)
			return props.errorsReadonly ? (props.errorsReadonly.length > 0) : false;

		// return props.validation ? props.validation[vid] ? props.validation[vid].$silentErrors && (props.validation[vid].$silentErrors.length > 0) : false : false;
		const errors = [];
		if (props.errors)
			errors.push(...props.errors);
		if (props.validation && props.validation[vid])
			errors.push(...props.validation[vid].$silentErrors);
		return errors.length > 0;
	});
	const errorsI = computed(() => {
		if (props.readonly)
			return props.errorsReadonly;

		// return props.validation ? props.validation[vid] ? props.validation[vid].$silentErrors : [] : [];
		const errors = [];
		if (props.errors)
			errors.push(...props.errors);
		if (props.validation && props.validation[vid])
			errors.push(...props.validation[vid].$silentErrors);
		return errors;
	});
	const hideDetails = computed(() => {
		return (!errorsI.value || (errorsI.value && errorsI.value.length === 0));
	});
	const initValue = (value) => {
		innerValue.value = convertValue(value);
		// if (watchInner.value)
		// 	return;

		// watchInner.value = context.watch('innerValue', async (newVal) => {
		// 	context.emit('update:modelValue', newVal);
		// });
	};

	const innerValueUpdate = (value) => {
		if (props.change)
			props.change(value);

		context.emit('update:modelValue', value);
	};

	watch(() => props.modelValue,
		(value) => {
			initValue(value);
		}
	);
	watch(() => innerValue,
		(value) => {
			context.emit('update:modelValue', value);
		}
	);

	onMounted(async () => {
		initValue(props.modelValue);
	});

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
		successResponse,
		isSaving,
		serverErrors,
		setErrors,
		convertValue,
		errorI,
		errorsI,
		hideDetails,
		innerValue,
		innerValueUpdate,
		initValue
	}
};
</script>
