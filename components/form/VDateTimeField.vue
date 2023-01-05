
<script>
import { getCurrentInstance } from 'vue';

import dayjs from 'dayjs';

import vDateTimeFieldBase from './VDateTimeFieldBase';

export default {
	name: 'VtDatetimePicker',
	extends: vDateTimeFieldBase,
	setup (props) {
		const instance = getCurrentInstance();

		const convert = (value) => {
			return dayjs(value, instance.ctx.getDefaultDateFormat() + ' ' + instance.ctx.getDefaultTimeMillisecondsFormat()).valueOf();
		};
		const formatDateTime = (value) => {
			return value ? dayjs(value).format(dateTimeFormat.value) : '';
		};
		const getDefaultDateFormat = () => {
			return 'YYYY-MM-DD';
		};
		const getDefaultTimeFormat = () => {
			return 'HH:mm';
		};
		const getDefaultTimeMillisecondsFormat = () => {
			return 'HH:mm:ss';
		};
		const getOutputTimestamp = (value) => {
			return value ? dayjs(value).valueOf() : 0;
		};
		const init = (newVal) => {
			if (!newVal)
				return;

			let initDateTime;
			if (datetime.value instanceof Date)
				initDateTime = dayjs(props.modelValue);
			else if (typeof newVal === 'number' || newVal instanceof Number)
				initDateTime = dayjs(props.modelValue);
			else if (typeof newVal === 'string' || newVal instanceof String)
				initDateTime = dayjs(props.modelValue, dateTimeFormat.value);

			date.value = initDateTime.format(instance.ctx.getDefaultDateFormat());
			time.value = initDateTime.format(instance.ctx.getDefaultTimeFormat());
		};

		return Object.assign(vDateTimeFieldBase.setup(props), {
			convert,
			formatDateTime,
			getDefaultDateFormat,
			getDefaultTimeFormat,
			getDefaultTimeMillisecondsFormat,
			getOutputTimestamp,
			init,
		});
	},
	// methods: {
	// 	convert(value) {
	// 		return dayjs(value, this.getDefaultDateFormat() + ' ' + this.getDefaultTimeMillisecondsFormat()).valueOf();
	// 	},
	// 	formatDateTime(value) {
	// 		return value ? dayjs(value).format(this.dateTimeFormat) : '';
	// 	},
	// 	getDefaultDateFormat() {
	// 		return 'YYYY-MM-DD';
	// 	},
	// 	getDefaultTimeFormat() {
	// 		return 'HH:mm';
	// 	},
	// 	getDefaultTimeMillisecondsFormat() {
	// 		return 'HH:mm:ss';
	// 	},
	// 	// eslint-disable-next-line
	// 	getOutputTimestamp(value) {
	// 		return value ? dayjs(value).valueOf() : 0;
	// 	},
	// 	init(newVal) {
	// 		if (!newVal)
	// 			return;

	// 		let initDateTime;
	// 		if (this.datetime instanceof Date)
	// 			initDateTime = dayjs(this.value);
	// 		else if (typeof newVal === 'number' || newVal instanceof Number)
	// 			initDateTime = dayjs(this.value);
	// 		else if (typeof newVal === 'string' || newVal instanceof String)
	// 			initDateTime = dayjs(this.value, this.dateTimeFormat);

	// 		this.date = initDateTime.format(this.getDefaultDateFormat());
	// 		this.time = initDateTime.format(this.getDefaultTimeFormat());
	// 	}
	// }
};
</script>

<style scoped>
</style>
