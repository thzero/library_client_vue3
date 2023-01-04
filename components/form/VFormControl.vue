<template>
	<div>
		<div class="headline text-center text-h6">
			{{ label }}
		</div>
		<!-- <div class="text-center">
			 dirty: {{ dirty }} invalid: {{ invalid }} disabled: {{ disabled }} buttonOkDisabled: {{ buttonOkDisabled }}
		</div> -->
		<div>
			<v-form>
				<slot />
				<div
					v-for="(item, index) in serverErrors"
					:key="index"
					class="red--text text--lighten-1 v-messages"
				>
					{{ item }}
				</div>
				<div>
					<slot name="before"/>
				</div>
				<div
					v-if="!autoSave"
					class="text-right"
				>
					<v-spacer />
					<slot name="buttons_pre"/>
					<v-btn
						v-if="buttonDelete"
						color="primary lighten-1"
						text
						@click="handleDelete"
						class="mr-2"
						:loading="isLoading"
					>
						{{ $t(buttonDeleteName) }}
					</v-btn>
					<v-btn
						v-if="buttonClear"
						color="primary lighten-1"
						text
						@click="handleClear"
						class="mr-2"
						:loading="isLoading"
					>
						{{ $t(buttonClearName) }}
					</v-btn>
					<v-btn
						v-if="buttonOk"
						:disabled="buttonOkDisabled"
						color="green darken-1"
						text
						@click="submit"
						:loading="isLoading"
					>
						{{ $t(buttonOkName) }}
					</v-btn>
					<slot name="buttons_post"/>
				</div>
				<div>
					<slot name="after"/>
				</div>
			</v-form>
		</div>
		<!-- <div
			v-if="!autoSave"
			class="text-right"
		>
			<v-spacer />
			<slot name="buttons_pre"/>
			<v-btn
				v-if="buttonDelete"
				color="primary lighten-1"
				text
				@click="handleDelete"
				class="mr-2"
				:loading="isLoading"
			>
				{{ $t(buttonDeleteName) }}
			</v-btn>
			<v-btn
				v-if="buttonClear"
				color="primary lighten-1"
				text
				@click="handleClear"
				class="mr-2"
				:loading="isLoading"
			>
				{{ $t(buttonClearName) }}
			</v-btn>
			<v-btn
				v-if="buttonOk"
				:disabled="buttonOkDisabled"
				color="green darken-1"
				text
				@click="submit"
				:loading="isLoading"
			>
				{{ $t(buttonOkName) }}
			</v-btn>
			<slot name="buttons_post"/>
		</div>
		<div>
			<slot name="after"/>
		</div> -->
		<v-overlay
			absolute
			:value="overlayLoading"
		>
			<v-card
				color="primary"
				dark
			>
				<v-card-text>
					Saving...
					<v-progress-linear
						indeterminate
						color="white"
						class="mb-0"
					></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-overlay>
		<VConfirmationDialog
			v-if="buttonDelete"
			:non-recoverable="nonRecoverable"
			:signal="dialogDeleteConfirmSignal.signal"
			@cancel="dialogDeleteConfirmSignal.cancelI()"
			@ok="handleDeleteConfirmOk"
		/>
	</div>
	<v-snackbar
		ref="notifyRef"
		v-model="notifySignal"
		:color="notifyColor"
		:timeout="notifyTimeout"
    >
		{{ notifyMessage }}
	</v-snackbar>
</template>

<script>
import VConfirmationDialog from '@/library_vue_vuetify/components/VConfirmationDialog';
import { useBaseFormControlComponent } from '@/library_vue/components/form/baseFormControl';
import { baseFormControlProps } from '@/library_vue/components/form/baseFormControlProps';

export default {
	name: 'VtFormControl',
	components: {
		VConfirmationDialog
	},
	props: {
		...baseFormControlProps
	},
	emits: ['ok'],
	setup(props, context) {
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
			buttonOkDisabled,
			dialogDeleteConfirmSignal,
			dirty,
			invalid,
			isClearing,
			isDeleting,
			isLoading,
			overlayLoading,
			handleClear,
			handleDelete,
			handleDeleteConfirmOk,
			notifyColor,
			notifyMessage,
			notifySignal,
			notifyTimeout,
			reset,
			setNotify,
			submit
		} = useBaseFormControlComponent(props, context);
		
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
			dialogDeleteConfirmSignal,
			dirty,
			invalid,
			isClearing,
			isDeleting,
			isLoading,
			overlayLoading,
			handleClear,
			handleDelete,
			handleDeleteConfirmOk,
			notifyColor,
			notifyMessage,
			notifySignal,
			notifyTimeout,
			reset,
			setNotify,
			submit
		};
	},
}
</script>

<style scoped>
</style>
