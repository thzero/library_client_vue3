<template>
	<v-dialog
		v-model="display"
		:width="dialogWidth"
	>
		<template #activator="{ on }">
			<v-text-field
				v-bind="textFieldProps"
				:disabled="disabled"
				:loading="loading"
				:label="label"
				:value="formattedDateTime"
				readonly
				v-on="on"
			>
				<template #progress>
					<slot name="progress">
						<v-progress-linear
							color="primary"
							indeterminate
							absolute
							height="2"
						/>
					</slot>
				</template>
			</v-text-field>
		</template>

		<v-card>
			<v-card-text class="px-0 py-0">
				<v-tabs
					v-model="activeTab"
					fixed-tabs
				>
					<v-tab key="calendar">
						<slot name="dateIcon">
							<v-icon>event</v-icon>
						</slot>
					</v-tab>
					<v-tab
						key="timer"
						:disabled="dateSelected"
					>
						<slot name="timeIcon">
							<v-icon>access_time</v-icon>
						</slot>
					</v-tab>
					<v-tab-item key="calendar">
						<v-date-picker
							v-model="date"
							v-bind="datePickerProps"
							full-width
							@input="showTimePicker"
						/>
					</v-tab-item>
					<v-tab-item key="timer">
						<v-time-picker
							ref="timerRef"
							v-model="time"
							class="v-time-picker-custom"
							v-bind="timePickerProps"
							full-width
						/>
					</v-tab-item>
				</v-tabs>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<slot
					name="actions"
					:parent="this"
				>
					<v-btn
						color="primary lighten-1"
						text
						@click="clearHandler"
					>
						{{ clearText }}
					</v-btn>
					<v-btn
						color="primary lighten-1"
						text
						@click="cancelHandler"
					>
						{{ cancelText }}
					</v-btn>
					<v-btn
						color="green darken-1"
						text
						@click="okHandler"
					>
						{{ okText }}
					</v-btn>
				</slot>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from 'vue';

const DEFAULT_CANCEL_TEXT = 'CANCEL';
const DEFAULT_CLEAR_TEXT = 'CLEAR';
const DEFAULT_DATE = '';
const DEFAULT_DIALOG_WIDTH = 340;
const DEFAULT_OK_TEXT = 'OK';
const DEFAULT_TIME = '00:00:00';
const OUTPUT_TYPE_DATE = 'date';
const OUTPUT_TYPE_TIMESTAMP = 'timestamp';

import baseControlEdit from '@/library_vue/components/baseControlEdit';

export default {
	name: 'VtDatetimePickerBase',
	extends: baseControlEdit,
	props: {
		cancelText: {
			type: String,
			default: DEFAULT_CANCEL_TEXT
		},
		change: {
			type: Function,
			default: () => {}
		},
		clearText: {
			type: String,
			default: DEFAULT_CLEAR_TEXT
		},
		dateFormat: {
			type: String,
			default: null
		},
		datePickerProps: {
			type: Object,
			default: null
		},
		disabled: {
			type: Boolean
		},
		dialogWidth: {
			type: Number,
			default: DEFAULT_DIALOG_WIDTH
		},
		label: {
			type: String,
			default: ''
		},
		loading: {
			type: Boolean
		},
		okText: {
			type: String,
			default: DEFAULT_OK_TEXT
		},
		outputType: {
			type: String,
			default: OUTPUT_TYPE_DATE,
			validator: (val) => [OUTPUT_TYPE_DATE, OUTPUT_TYPE_TIMESTAMP].includes(val)
		},
		textFieldProps: {
			type: Object,
			default: null
		},
		timeFormat: {
			type: String,
			default: null
		},
		timePickerProps: {
			type: Object,
			default: null
		},
		timePickerProps: {
			type: Object,
			default: null
		}
	},
	setup (props) {
		const instance = getCurrentInstance();

		const activeTab = ref(0);
		const date = ref(DEFAULT_DATE);
		const display = ref(false);
		const innerOutputType = ref(props.outputType);
		const time = ref(DEFAULT_TIME);

		const dateSelected = computed(() => {
			return !date.value;
		});
		const dateTimeFormat = computed(() => {
			return (dateFormat.value ? dateFormat.value : instance.ctx.getDefaultDateFormat()) + ' ' + (timeFormat.value ? timeFormat.value : instance.ctx.getDefaultTimeFormat());
		});
		const formattedDateTime = computed(() => {
			return instance.ctx.getOutputDateTime(selectedDateTime.value);
		});
		const selectedDateTime = computed(() => {
			if (date.value && time.value) {
				let datetimeString = date.value + ' ' + time.value;
				if (time.value.length === 5)
					datetimeString += ':00';

				const date = instance.ctx.convert(datetimeString);
				return date;
			}

			return null;
		});

		const cancelHandler = () => {
			instance.ctx.resetPicker();
		};
		const clearHandler = () => {
			instance.ctx.resetPicker();
			date.value = DEFAULT_DATE;
			time.value = DEFAULT_TIME;
			instance.ctx.$emit('input', null);
		};
		// eslint-disable-next-line
		const convert = (value) => {
			return '';
		};
		// eslint-disable-next-line
		const formatDateTime = (value) => {
			return '';
		};
		const getDefaultDateFormat = () => {
			return '';
		};
		const getDefaultTimeFormat = () => {
			return '';
		};
		const getDefaultTimeMillisecondsFormat = () => {
			return '';
		};
		const getOutputDateTime = (value) => {
			return instance.ctx.formatDateTime(value);
		};
		// eslint-disable-next-line
		const getOutputTimestamp = (value) => {
			return 0;
		};
		const okHandler = () => {
			const output = innerOutputType.value == OUTPUT_TYPE_DATE ? instance.ctx.getOutputDateTime(selectedDateTime.value) : instance.ctx.getOutputTimestamp(selectedDateTime.value);
			instance.ctx.$emit('input', output);
			if (instance.ctx.change)
				instance.ctx.change();
			instance.ctx.resetPicker();
		};
		const resetPicker = () => {
			display.value = false;
			activeTab.value = 0;
			if (instance.ctx.$refs.timer)
				instance.ctx.$refs.timer.selectingHour = true;
		};
		const showTimePicker = () => {
			activeTab.value = 1;
		};

		watch(() => props.outputType,
			(value) => {
				innerOutputType.value = value;
			}
		);

		return Object.assign(baseControlEdit.setup(props), {
			activeTab,
			date,
			display,
			dateSelected,
			dateTimeFormat,
			formattedDateTime,
			innerOutputType,
			selectedDateTime,
			time,
			cancelHandler,
			clearHandler,
			convert,
			formatDateTime,
			getDefaultDateFormat,
			getDefaultTimeFormat,
			getDefaultTimeMillisecondsFormat,
			getOutputDateTime,
			getOutputTimestamp,
			okHandler,
			resetPicker,
			showTimePicker
		});
	},
	// data: () => ({
	// 	display: false,
	// 	activeTab: 0,
	// 	date: DEFAULT_DATE,
	// 	innerOutputType: OUTPUT_TYPE_DATE,
	// 	time: DEFAULT_TIME
	// }),
	// computed: {
	// 	dateSelected() {
	// 		return !this.date;
	// 	},
	// 	dateTimeFormat() {
	// 		return (this.dateFormat ? this.dateFormat : this.getDefaultDateFormat()) + ' ' + (this.timeFormat ? this.timeFormat : this.getDefaultTimeFormat());
	// 	},
	// 	formattedDateTime() {
	// 		return this.getOutputDateTime(this.selectedDateTime);
	// 	},
	// 	selectedDateTime() {
	// 		if (this.date && this.time) {
	// 			let datetimeString = this.date + ' ' + this.time;
	// 			if (this.time.length === 5)
	// 				datetimeString += ':00';

	// 			const date = this.convert(datetimeString);
	// 			return date;
	// 		}

	// 		return null;
	// 	}
	// },
	// watch: {
	// 	outputType(newVal) {
	// 		this.innerOutputType = newVal;
	// 	},
	// 	value(newVal) {
	// 		this.init(newVal);
	// 	}
	// },
	// created() {
	// 	this.innerOutputType = this.outputType;
	// 	this.init(this.value);
	// },
	// mounted() {
	// 	this.init(this.value);
	// },
	// methods: {
	// 	cancelHandler() {
	// 		this.resetPicker();
	// 	},
	// 	clearHandler() {
	// 		this.resetPicker();
	// 		this.date = DEFAULT_DATE;
	// 		this.time = DEFAULT_TIME;
	// 		this.$emit('input', null);
	// 	},
	// 	// eslint-disable-next-line
	// 	convert(value) {
	// 		return '';
	// 	},
	// 	// eslint-disable-next-line
	// 	formatDateTime(value) {
	// 		return '';
	// 	},
	// 	getDefaultDateFormat() {
	// 		return '';
	// 	},
	// 	getDefaultTimeFormat() {
	// 		return '';
	// 	},
	// 	getDefaultTimeMillisecondsFormat() {
	// 		return '';
	// 	},
	// 	getOutputDateTime(value) {
	// 		return this.formatDateTime(value);
	// 	},
	// 	// eslint-disable-next-line
	// 	getOutputTimestamp(value) {
	// 		return 0;
	// 	},
	// 	// eslint-disable-next-line
	// 	init(value) {
	// 	},
	// 	okHandler() {
	// 		const output = this.innerOutputType == OUTPUT_TYPE_DATE ? this.getOutputDateTime(this.selectedDateTime) : this.getOutputTimestamp(this.selectedDateTime);
	// 		this.$emit('input', output);
	// 		if (this.change)
	// 			this.change();
	// 		this.resetPicker();
	// 	},
	// 	resetPicker() {
	// 		this.display = false;
	// 		this.activeTab = 0;
	// 		if (this.$refs.timer)
	// 			this.$refs.timer.selectingHour = true;
	// 	},
	// 	showTimePicker() {
	// 		this.activeTab = 1;
	// 	}
	// }
};
</script>

<style scoped>
</style>
