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
		return props.validation ? props.validation[vid] ? props.validation[vid].$silentErrors && (props.validation[vid].$silentErrors.length > 0) : false : true;
	});
	const errorsI = computed(() => {
		return props.validation ? props.validation[vid] ? props.validation[vid].$silentErrors : [] : [];
	});
	const hideDetails = computed(() => {
		return (!errorsI || (errorsI && errorsI.length === 0));
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
