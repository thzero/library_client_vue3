<script>
import { computed } from 'vue';

import Constants from '@/constants';

import base from '../components/base';

export default {
	name: 'BaseLayout',
	extends: base,
	setup() {
		const features = computed(() => {
			return Constants.Features;
		});

		return Object.assign(base.setup(), {
			features
		});
	}
	// computed: {
	// 	features() {
	// 		return Constants.Features;
	// 	}
	// }
};
</script>

<style scoped>
</style>
