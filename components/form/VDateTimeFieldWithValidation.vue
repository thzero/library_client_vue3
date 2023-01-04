<template>
	<VDateTimeField
		v-model="innerValue"
		slot-scope="{ errors, valid }"
		:error-messages="errors"
		:success="valid"
		v-bind="$attrs"
		:date-format="dateFormat"
		:output-type="innerOutputType"
		:time-format="timeFormat"
		:cancel-text="$t('buttons.cancel')"
		:clear-text="$t('buttons.clear')"
		:ok-text="$t('buttons.ok')"
		v-on="$listeners"
	/>
</template>

<script>
import VDateTimeField from './VDateTimeField';

import base from '@/library_vue/components/base';

export default {
	name: 'VtDateTimePickerWithValidation',
	components: {
		VDateTimeField
	},
	extends: base,
	props: {
		// must be included in props
		value: {
			type: [Date, String, Number],
			default: null
		},
		dateFormat: {
			type: String,
			default: null
		},
		outputType: {
			type: String,
			default: 'date'
		},
		rules: {
			type: [Object, String],
			default: ''
		},
		rulesBail: {
			type: Boolean,
			default: true
		},
		rulesImmediate: {
			type: Boolean,
			default: false
		},
		timeFormat: {
			type: String,
			default: null
		},
		vid: {
			type: String,
			default: ''
		}
	},
	data: () => ({
		innerOutputType: 'date',
		innerValue: ''
	}),
	watch: {
		// Handles internal model changes.
		innerValue(newVal) {
			this.$emit('input', newVal);
		},
		outputType(newVal) {
			this.innerOutputType = newVal;
		},
		// Handles external model changes.
		value(newVal) {
			this.innerValue = newVal;
		}
	},
	created() {
		this.innerOutputType = this.outputType;
		this.innerValue = this.value;
	},
	methods: {
		validation() {
			return this.$refs.prv;
		}
	}
};
</script>

<style scoped>
</style>
