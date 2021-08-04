<script>
import { computed } from 'vue';

import base from './base';

export default {
	name: 'BaseVersion',
	extends: base,
	props: {
		value: {
			type: Object,
			default: null
		}
	},
	setup(props) {
		const innerVersion = computed(() => {
			return props.value;
		});

		return Object.assign(base.setup(props), {
			innerVersion
		});
	}
	// data () {
	// 	return {};
	// },
	// computed: {
	// 	innerVersion() {
	// 		return this.value;
	// 	}
	// }
};
</script>
