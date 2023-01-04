<template>
	<v-overlay
		opacity="1.0"
		z-index="5"
		:value="!signal"
	>
		<v-container>
			<v-row
				justify="center"
				class="mb-8"
			>
				<v-img
					src="/icons/icon.png"
					:width="imageWidth"
				/>
			</v-row>
			<v-row justify="center">
				<v-progress-circular
					indeterminate
					:size="progressSize"
				/>
			</v-row>
			<v-row justify="center">
				<span class="headline pt-8">{{ $t('messages.loading') }}</span>
			</v-row>
		</v-container>
	</v-overlay>
</template>

<script>
import { computed } from 'vue';

import VueUtility from '@thzero/library_client_vue3/utility/index';

export default {
	name: 'VtLoadingOverlay',
	props: {
		signal: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const imageWidth = computed(() => {
			return VueUtility.overlayImageWidth();
		});
		const progressSize = computed(() => {
			return VueUtility.overlayProgressSize();
		});

		return {
			imageWidth,
			progressSize
		};
	},
	// computed: {
	// 	imageWidth() {
	// 		return VueUtility.overlayImageWidth();
	// 	},
	// 	progressSize() {
	// 		return VueUtility.overlayProgressSize();
	// 	}
	// }
};
</script>

<style scoped>
</style>
