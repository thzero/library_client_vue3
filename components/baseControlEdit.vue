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
	// The field's validation: the vid names it, as a path when the rule is nested
	// ('innerValue.name'); a plain name only ever found rules at the top level.
	const validationI = () => {
		if (!props.validation || String.isNullOrEmpty(vid))
			return null;
		return vid.split('.').reduce((value, key) => (value ? value[key] : null), props.validation) ?? null;
	};
	const errorI = computed(() => {
		return (errorsI.value ?? []).length > 0;
	});
	const errorsI = computed(() => {
		const errors = [];
		if (props.readonly) {
			if (props.errorsReadonly)
				errors.push(...props.errorsReadonly);
		}
		else if (props.errors)
			errors.push(...props.errors);
		// a readonly field can still be required, as one filled in from a lookup
		// is; readonly used to hide its validation, so nothing said it was missing
		const validation = validationI();
		if (validation && validation.$silentErrors)
			errors.push(...validation.$silentErrors);
		return errors;
	});
	// The label, marked when the field's rule has a required validator, so a
	// required field says so before it is ever empty.
	const labelI = (label) => {
		if (String.isNullOrEmpty(label))
			return label;
		const validation = validationI();
		return (validation && validation.required) ? `${label} *` : label;
	};
	// The attributes for the field's input, without the label, which goes
	// through labelI; bound with inheritAttrs off, so the plain label cannot
	// replace the marked one.
	const attrsI = (attrs) => {
		const { label, ...rest } = attrs ?? {};
		return rest;
	};
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
	const validateNumericField = (evt) => {
		// evt = evt || window.event;

		let exp = `^[${(props.min < 0 ? '-' : '')}0-9,${(props.type === 'decimal' ? '\\.' : '')}]+$`;

		let key = null;
		if (evt.type === 'paste') {
			exp = `^${(props.min < 0 ? '-?' : '')}(?:\\d+|\\d{1,3}(?:,\\d{3})+)?(?:${(props.type === 'decimal' ? '\\.' : '')}\\d+)?$`
			// Handle paste
			key = evt.clipboardData.getData('text/plain');
		} else {
			// Handle key press
			const charCode = evt.keyCode || evt.which;
			if (!((charCode >= 48 && charCode <= 57) || charCode === 31 || charCode === 44 || charCode === 45 || charCode === 46)) {
				evt.returnValue = false;
				if (evt.preventDefault)
					evt.preventDefault();
				return true;
			}
			key = String.fromCharCode(charCode);
		}

		const regex2 = new RegExp(exp);
		if (!regex2.test(key)) {
			evt.returnValue = false;
			if (evt.preventDefault)
				evt.preventDefault();
		}

		return true;
	};
	const validateNumericFieldMinMax = (value) => {
		const n = Number(value);
		if (!isNaN(n) && (props.min && n < props.min)) {
			innerValue.value = props.min;
			innerValueUpdate(innerValue.value);
		}
		if (!isNaN(n) && (props.max && n > props.max)) {
			innerValue.value = props.max;
			innerValueUpdate(innerValue.value);
		}
	};

	watch(() => props.modelValue,
		(value) => {
			initValue(value);
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
		attrsI,
		errorsI,
		hideDetails,
		labelI,
		innerValue,
		initValue,
		innerValueUpdate,
		validateNumericField,
		validateNumericFieldMinMax
	}
};
</script>
