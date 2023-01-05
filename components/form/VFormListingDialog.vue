<template>
	<div>
		<v-dialog
			v-model="dialogSignal"
			persistent
			:fullscreen="isFullscreen"
			@keydown.esc="handleClose"
		>
			<v-card
				:style="!isFullscreen ? { maxWidth: maxWidth, width: width, margin: 'auto', } : {}"
			>
				<!-- <div class="text-center">
					dirty: {{ dirty }} invalid: {{ invalid }} disabled: {{ disabled }} buttonOkDisabled: {{ buttonOkDisabled }}
				</div> -->
				<v-card-item>
					<div class="text-center text-h5">{{ label }}</div>
					<v-form>
						<slot :buttonOkDisabled="buttonOkDisabled" :loading="loading" />
						<div
							v-for="(item, index) in serverErrors"
							:key="index"
							class="red--text text--lighten-1 v-messages"
						>
							{{ item }}
						</div>
					</v-form>
					<v-snackbar
						ref="notifyRef"
						v-model="notifySignal"
						:color="notifyColor"
						:timeout="notifyTimeout"
					>
						{{ notifyMessage }}
					</v-snackbar>
				</v-card-item>

				<v-card-text style="overflow-y: auto;" class="scroll">
					<slot name="listing"/>
				</v-card-text>

				<v-card-actions align="right">
					<v-spacer />
					<v-btn
						variant="flat"
						color="primary"
						@click="handleClose"
					>
						{{ $t('buttons.close') }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { computed, ref } from 'vue';

import { useBaseFormDialogControlComponent } from '@/library_vue/components/form/baseFormDialogControl';
import { baseFormDialogControlProps } from '@/library_vue/components/form/baseFormDialogControlProps';
import { useDisplayComponent } from '@/library_vue_vuetify/components/display';

export default {
	name: 'VtFormListingDialog',
	props: {
		...baseFormDialogControlProps
	},
	emits: ['close', 'ok', 'open'],
	setup (props, context) {
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
			isSaving,
			serverErrors,
			setErrors,
			// buttonOkDisabled,
			dialogHeightI,
			dialogDeleteConfirmSignal,
			dialogSignal,
			dirty,
			invalid,
			handleClear,
			handleClose,
			handleDelete,
			handleDeleteConfirmOk,
			loading,
			notifyColor,
			notifyMessage,
			notifySignal,
			notifyTimeout,
			onResize,
			reset,
			scrollableI,
			scrollableHeightI,
			setNotify,
			submit
		} = useBaseFormDialogControlComponent(props, context);

		const display = useDisplayComponent();

		const internalItem = ref(null);

		const isFullscreen = computed(() => {
			return display.isFullscreen.value;
		});

		const buttonOkDisabled = computed(() => {
			return invalid.value;
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
			isSaving,
			serverErrors,
			setErrors,
			buttonOkDisabled,
			dialogHeightI,
			dialogDeleteConfirmSignal,
			dialogSignal,
			dirty,
			invalid,
			handleClear,
			handleClose,
			handleDelete,
			handleDeleteConfirmOk,
			loading,
			notifyColor,
			notifyMessage,
			notifySignal,
			notifyTimeout,
			onResize,
			reset,
			scrollableI,
			scrollableHeightI,
			setNotify,
			submit,
			isFullscreen,
			internalItem
		};
	}
};
</script>

<style scoped>
</style>
