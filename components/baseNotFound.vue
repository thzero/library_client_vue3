<script>
import { computed } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import base from './base';

export default {
	name: 'BaseNotFound',
	extends: base,
	setup(props) {
		const imageWidth = computed(() => {
			const width = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
			if (width > 512)
				return '512px';

			return width * 0.75 + 'px';
		});

		const clickHome = () => {
			GlobalUtility.$navRouter.push('/');
		};

		return Object.assign(base.setup(props), {
			clickHome,
			imageWidth
		});
	}
	// computed: {
	// 	imageWidth() {
	// 		const width = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
	// 		if (width > 512)
	// 			return '512px';

	// 		return width * 0.75 + 'px';
	// 	}
	// },
	// methods: {
	// 	clickHome() {
	// 		GlobalUtility.$navRouter.push('/');
	// 	}
	// }
};
</script>
