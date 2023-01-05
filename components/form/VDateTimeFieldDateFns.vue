
<script>
import { format, parse } from 'date-fns';

import VDateTimeFieldBase from './VDateTimeFieldBase';

export default {
	name: 'VtDatetimePicker',
	extends: VDateTimeFieldBase,
	methods: {
		convert(value) {
			return format(value, this.getDefaultDateFormat() + ' ' + this.getDefaultTimeMillisecondsFormat());
		},
		formatDateTime(value) {
			return this.selectedDatetime ? format(value, this.dateTimeFormat) : '';
		},
		getDefaultDateFormat() {
			return 'yyyy-MM-dd';
		},
		getDefaultTimeFormat() {
			return 'HH:mm';
		},
		getDefaultTimeMillisecondsFormat() {
			return 'HH:mm:ss';
		},
		// eslint-disable-next-line
		getOutputTimestamp(value) {
			return 0;
		},
		init() {
			if (!this.value)
				return;

			let initDateTime;
			if (this.datetime instanceof Date)
				initDateTime = this.datetime;
			else if (typeof this.value === 'number' || this.value instanceof Number)
				initDateTime = parse(this.datetime);
			else if (typeof this.value === 'string' || this.value instanceof String) {
				// see https://stackoverflow.com/a/9436948
				initDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
			}

			this.date = format(initDateTime, this.getDefaultDateFormat());
			this.time = format(initDateTime, this.getDefaultTimeFormat());
		}
	}
};
</script>

<style scoped>
</style>
