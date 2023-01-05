<template>
	<v-dialog
		v-model="dialogSignal"
		persistent
		:scrollable="scrollableI"
		:max-width="maxWidth"
		@keydown.esc="dialogCancel()"
	>
		<v-card>
			<v-card-title class="headline">
				{{ label }}
			</v-card-title>
			<v-card-text
				:style="scrollableHeightI"
			>
				<slot />

				<!-- eslint-disable vue/no-v-html -->
				<div
					class="markdown-body"
					style="vertical-align: top;"
					v-html="description"
				/>
				<!--eslint-enable-->
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn
					color="primary"
					text
					@click.stop="dialogCancel()"
				>
					{{ $t('buttons.cancel') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import baseDisplayDialog from '@/library_vue/components/baseDisplayDialog';

export default {
	name: 'VtDisplayDialog',
	extends: baseDisplayDialog
};
</script>
