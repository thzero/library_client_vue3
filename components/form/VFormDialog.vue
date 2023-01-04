<template>
	<vue-fragment>
		<ValidationObserver
			ref="obs"
			v-slot="{ invalid }"
		>
			<v-dialog
				v-model="dialogSignal"
				v-resize="onResize"
				persistent
				:scrollable="scrollableI"
				:max-width="maxWidth"
				:fullscreen="fullscreen"
				@keydown.esc="handleCancel"
			>
				<v-card>
					<v-card-title class="headline">
						{{ label }}
					</v-card-title>
					<v-card-text
						:style="scrollableHeightI"
					>
						<v-form>
							<slot />
							<div
								v-for="(item, index) in serverErrors"
								:key="index"
								class="red--text text--lighten-1 v-messages"
							>
								{{ item }}
							</div>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer />
						<v-btn
							v-if="buttonDelete"
							color="error lighten-1"
							text
							@click="handleDelete"
							:loading="loading"
						>
							{{ $t('buttons.delete') }}
						</v-btn>
						<v-btn
							v-if="buttonClear"
							color="primary lighten-1"
							text
							@click="handleClear"
							:loading="loading"
						>
							{{ $t('buttons.clear') }}
						</v-btn>
						<v-btn
							v-if="buttonCancel"
							color="primary lighten-1"
							text
							@click="handleCancel"
							:loading="loading"
						>
							{{ $t('buttons.cancel') }}
						</v-btn>
						<v-btn
							v-if="buttonOk"
							:disabled="invalid || disabled || (invalidOverride != null ? invalidOverride : false)"
							color="green darken-1"
							text
							@click="submit"
							:loading="loading"
						>
							{{ $t('buttons.ok') }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</ValidationObserver>
		<VConfirmationDialog
			v-if="buttonDelete"
			:non-recoverable="true"
			:signal="dialogDeleteConfirmSignal.signal"
			@cancel="dialogDeleteConfirmSignal.cancelI()"
			@ok="handleDeleteConfirmOk"
		/>
	</vue-fragment>
</template>

<script>
import VueUtility from '@thzero/library_client_vue/utility/index';

import baseEdit from '@/library_vue/components/baseEdit';
import VConfirmationDialog from '../VConfirmationDialog';

import DialogSupport from '@/library_vue/components/support/dialog';

export default {
	name: 'VtFormDialog',
	components: {
		VConfirmationDialog
	},
	extends: baseEdit,
	props: {
		buttonCancel: {
			type: Boolean,
			default: true
		},
		buttonClear: {
			type: Boolean,
			default: true
		},
		buttonDelete: {
			type: Boolean,
			default: false
		},
		buttonOk: {
			type: Boolean,
			default: true
		},
		fullscreen: {
			type: Boolean,
			default: false
		},
		invalidOverride: {
			type: Boolean,
			default: null
		},
		label: {
			type: String,
			default: ''
		},
		maxWidth: {
			type: String,
			default: '300px'
		},
		preCompleteDelete: {
			type: Function,
			default: null
		},
		preCompleteOk: {
			type: Function,
			default: null
		},
		scrollable: {
			type: Boolean,
			default: false
		},
		scrollableAutoResize: {
			type: Boolean,
			default: false
		},
		scrollableAutoResizeFactor: {
			type: Number,
			default: 0.5
		},
		scrollableHeight: {
			type: String,
			default: null
		},
		signal: {
			type: Boolean,
			default: false
		}
	},
	data: () => ({
		dialogHeightI: 300,
		dialogDeleteConfirmSignal: new DialogSupport(),
		dialogSignal: false,
		disabled: false,
		executing: false
	}),
	computed: {
		fullscreenInternal() {
			return VueUtility.fullscreen(this.$vuetify);
		},
		loading() {
			return this.executing || this.dialogDeleteConfirmSignal.signal;
		},
		scrollableI() {
			return this.scrollable ? 'scrollable' : '';
		},
		scrollableHeightI() {
			return this.scrollableAutoResize ? 'height: ' + (!String.isNullOrEmpty(this.scrollableHeight) ? this.scrollableHeight : this.dialogHeightI) + 'px;' : '';
		}
	},
	watch: {
		// Handles external model changes.
		signal(value) {
			const correlationId = this.correlationId();
			this.$emit(value ? 'open' : 'close');
			this.logger.debug('FormDialog', 'signal', 'value', value, correlationId);
			this.dialogSignal = value;
			this.logger.debug('FormDialog', 'signal', 'dialogSignal', this.dialogSignal, correlationId);
		}
	},
	mounted() {
		this.onResize();
	},
	methods: {
		clear(correlationId) {
			this.serverErrors = [];
			this.logger.debug('FormDialog', 'clear', 'clear', null, correlationId);
			this.$nextTick(() => {
				this.$refs.obs.reset(correlationId);
			});
			this.disabled = false;
		},
		handleCancel() {
			this.executing = true;
			try {
				const correlationId = this.correlationId();
				this.serverErrors = [];
				this.dialogSignal = false;
				this.clear(correlationId);
				this.logger.debug('FormDialog', 'cancel', 'cancel', null, correlationId);
				this.$emit('cancel');
			}
			finally {
				this.executing = false;
			}
		},
		handleClear() {
			this.executing = true;
			try {
				this.clear(this.correlationId());
			}
			finally {
				this.executing = false;
			}
		},
		async handleDelete() {
			this.serverErrors = [];
			this.dialogDeleteConfirmSignal.open(this.correlationId());
		},
		async handleDeleteConfirmOk() {
			this.serverErrors = [];

			const correlationId = this.correlationId();

			this.dialogDeleteConfirmSignal.ok();

			if (this.preCompleteDelete) {
				const response = await this.preCompleteDelete(correlationId);
				this.logger.debug('FormDialog', 'handleDeleteConfirmOk', 'response', response, correlationId);
				if (this.hasFailed(response)) {
					VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationId);
					return;
				}
			}

			this.dialogSignal = false;
			this.logger.debug('FormDialog', 'handleDeleteConfirmOk', 'delete', null, correlationId);
			this.$emit('ok');
			this.clear(correlationId);
		},
		observer() {
			this.$refs.obs;
		},
		onResize() {
			const temp = window.innerHeight - 200;
			this.dialogHeightI = Math.ceil(temp * this.scrollableAutoResizeFactor);
		},
		async reset(correlationId, value) {
			const timer = setInterval(async () => {
				clearInterval(timer);
				const el = document.getElementsByClassName('v-card__text');
				if (el && el.length > 0)
					el[0].scrollTop = 0;
			}, 25);
			await this.resetDialog(correlationId, value);
		},
		// eslint-disable-next-line
		async resetDialog(correlationId, value) {
		},
		setErrors(errors) {
			this.$refs.obs.setErrors(errors);
		},
		async submit() {
			this.executing = true;
			try {
				this.serverErrors = [];

				const correlationId = this.correlationId();

				const result = await this.$refs.obs.validate(correlationId);
				this.logger.debug('FormDialog', 'submit', 'result', result, correlationId);
				if (!result)
					return;

				if (this.preCompleteOk) {
					const response = await this.preCompleteOk(correlationId);
					this.logger.debug('FormDialog', 'submit', 'response', response, correlationId);
					if (this.hasFailed(response)) {
						VueUtility.handleError(this.$refs.obs, this.serverErrors, response, correlationId);
						return;
					}
				}

				this.dialogSignal = false;
				this.logger.debug('FormDialog', 'submit', 'ok', null, correlationId);
				this.$emit('ok');
				this.clear(correlationId);
			}
			finally {
				this.executing = false;
			}
		},
		async validate(correlationId) {
			return await this.$refs.obs.validate(correlationId);
		}
	}
};
</script>

<style scoped>
</style>
