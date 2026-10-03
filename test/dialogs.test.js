import { describe, expect, it, vi } from 'vitest';

import { nextTick } from 'vue';

import { useBaseConfirmationDialogComponent } from '../components/baseConfirmationDialogComponent';
import { baseConfirmationDialogProps } from '../components/baseConfirmationDialogProps';
import { useDisplayDialogBaseComponent } from '../components/baseDisplayDialog';
import { baseDisplayDialogBaseProps } from '../components/baseDisplayDialogProps';

import { mountComposable, services } from './mount';

import LibraryClientConstants from '@thzero/library_client/constants';

const displayDialog = (attrs = {}, options) => mountComposable(useDisplayDialogBaseComponent, {
	props: baseDisplayDialogBaseProps,
	emits: [ 'cancel', 'ok' ],
	options,
	attrs
});

describe('useDisplayDialogBaseComponent', () => {
	it('tells the parent when it is cancelled', () => {
		const { wrapper, api } = displayDialog();

		// context.$emit is not a function: it threw, and the parent never heard
		api.dialogCancel();

		expect(wrapper.emitted('cancel')).toHaveLength(1);
	});

	it('tells the parent when it is closed with ok', async () => {
		const { wrapper, api } = displayDialog();

		await api.dialogOk();

		expect(wrapper.emitted('ok')).toHaveLength(1);
	});

	it('opens again after it is cancelled', async () => {
		// the parent's signal, as DialogSupport keeps it
		const { wrapper, api } = displayDialog({ onCancel: () => wrapper.setProps({ signal: false }) });
		await wrapper.setProps({ signal: true });
		expect(api.dialogSignal.value).toBe(true);

		api.dialogCancel();
		await nextTick();
		await wrapper.setProps({ signal: true });

		// the parent's signal stayed true, so opening it again changed nothing
		expect(api.dialogSignal.value).toBe(true);
	});

	it('works without options', () => {
		const { api } = displayDialog();

		// read options.fullscreenInternal with no guard
		expect(api.fullscreenInternal.value).toBe(false);
	});

	it('takes fullscreenInternal from the options', () => {
		const { api } = displayDialog({}, { fullscreenInternal: true });

		expect(api.fullscreenInternal.value).toBe(true);
	});

	it('sizes the scroll area from the window when asked to', () => {
		const { api } = displayDialog({ scrollableAutoResize: true });

		// dialogHeightI was never declared: a ReferenceError
		expect(api.scrollableHeightI.value).toBe(`height: ${Math.ceil((window.innerHeight - 200) * 0.5)}px;`);
	});

	it('uses a set scroll height', () => {
		const { api } = displayDialog({ scrollableAutoResize: true, scrollableHeight: '250' });

		expect(api.scrollableHeightI.value).toBe('height: 250px;');
	});

	it('renders markup with a correlation id', () => {
		const parser = services[LibraryClientConstants.InjectorKeys.SERVICE_MARKUP_PARSER];
		const render = vi.spyOn(parser, 'render');
		const { api } = displayDialog({ markup: 'text' });

		expect(api.markup.value).toBe('<p>text</p>');
		// it was handed the correlationId function
		expect(typeof render.mock.calls[0][0]).toBe('string');
		render.mockRestore();
	});
});

const confirmationDialog = (attrs = {}) => mountComposable(useBaseConfirmationDialogComponent, {
	props: baseConfirmationDialogProps,
	emits: [ 'cancel', 'error', 'ok' ],
	attrs
});

describe('useBaseConfirmationDialogComponent', () => {
	it('sends a correlation id with ok', async () => {
		const { wrapper, api } = confirmationDialog();

		await api.dialogOk();

		// the form controls' handle*ConfirmOk(correlationId) got undefined
		const [ correlationId ] = wrapper.emitted('ok')[0];
		expect(typeof correlationId).toBe('string');
		expect(correlationId.length).toBeGreaterThan(0);
	});

	it('sends the same correlation id it gave preCompleteOk', async () => {
		const preCompleteOk = vi.fn(async (correlationId) => ({ success: true, correlationId }));
		const { wrapper, api } = confirmationDialog({ preCompleteOk });

		await api.dialogOk();

		expect(wrapper.emitted('ok')[0][0]).toBe(preCompleteOk.mock.calls[0][0]);
	});

	it('does not send ok when preCompleteOk fails', async () => {
		const { wrapper, api } = confirmationDialog({ preCompleteOk: async () => ({ success: false }) });

		await api.dialogOk();

		expect(wrapper.emitted('ok')).toBeUndefined();
		expect(wrapper.emitted('error')).toHaveLength(1);
	});
});
