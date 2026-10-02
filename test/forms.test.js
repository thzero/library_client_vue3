import { describe, expect, it, vi } from 'vitest';

import { flushPromises } from '@vue/test-utils';

import { useBaseFormControlComponent } from '../components/form/baseFormControl';
import { baseFormControlProps } from '../components/form/baseFormControlProps';
import { useBaseFormDialogControlComponent } from '../components/form/baseFormDialogControl';
import { baseFormDialogControlProps } from '../components/form/baseFormDialogControlProps';
import { useBaseFormListingControlComponent } from '../components/form/baseFormListingControl';
import { baseFormListingControlProps } from '../components/form/baseFormListingControlProps';

import { mountComposable, validation } from './mount';

const failed = async () => ({ success: false });

describe('useBaseFormControlComponent', () => {
	const formControl = (attrs = {}) => mountComposable(useBaseFormControlComponent, {
		props: baseFormControlProps,
		emits: [ 'cancel', 'delete', 'ok', 'reset' ],
		attrs: { validation: validation(), ...attrs }
	});

	it('shows the error when a delete fails', async () => {
		const { wrapper, api } = formControl({ preCompleteDelete: failed });

		// read a notify declared on the same line: a ReferenceError, so the error never showed
		await api.handleDeleteConfirmOk('id');

		expect(api.notifySignal.value).toBe(true);
		expect(api.notifyMessage.value).toBe('messages.error');
		expect(wrapper.emitted('delete')).toBeUndefined();
	});

	it('shows the error when a cancel fails', async () => {
		const { wrapper, api } = formControl({ preCompleteCancel: failed });

		await api.handleCancelConfirmOk('id');

		expect(api.notifySignal.value).toBe(true);
		expect(api.notifyMessage.value).toBe('messages.error');
		expect(wrapper.emitted('cancel')).toBeUndefined();
	});

	it('shows no error when notify is off', async () => {
		const { api } = formControl({ preCompleteDelete: failed, notify: false });

		await api.handleDeleteConfirmOk('id');

		expect(api.notifySignal.value).toBe(false);
	});

	it('deletes when preCompleteDelete succeeds', async () => {
		const { wrapper, api } = formControl({ preCompleteDelete: async () => ({ success: true }) });

		await api.handleDeleteConfirmOk('id');

		expect(wrapper.emitted('delete')).toHaveLength(1);
	});
});

describe('useBaseFormDialogControlComponent', () => {
	const formDialog = (attrs = {}, options) => mountComposable(useBaseFormDialogControlComponent, {
		props: baseFormDialogControlProps,
		emits: [ 'close', 'delete', 'error', 'ok', 'open', 'reset' ],
		options,
		attrs: { validation: validation(), ...attrs }
	});

	const opened = async (attrs, options) => {
		const result = formDialog(attrs, options);
		await result.wrapper.setProps({ signal: true });
		await flushPromises();
		expect(result.api.dialogSignal.value).toBe(true);
		return result;
	};

	it('stays open when the save fails', async () => {
		const { wrapper, api } = await opened({ preCompleteOk: failed });

		await api.submit();

		// the finally closed it whatever happened, losing what the user entered
		expect(api.dialogSignal.value).toBe(true);
		expect(api.notifyMessage.value).toBe('messages.error');
		expect(wrapper.emitted('ok')).toBeUndefined();
	});

	it('stays open when the form is invalid', async () => {
		const { api } = await opened({ validation: validation(false) });

		await api.submit();

		expect(api.dialogSignal.value).toBe(true);
	});

	it('stays open when the save throws', async () => {
		const { api } = await opened({ preCompleteOk: async () => { throw new Error('down'); } });

		await api.submit();

		expect(api.dialogSignal.value).toBe(true);
	});

	it('closes when the save succeeds', async () => {
		const { wrapper, api } = await opened({ preCompleteOk: async () => ({ success: true }) });

		await api.submit();

		expect(api.dialogSignal.value).toBe(false);
		expect(wrapper.emitted('ok')).toHaveLength(1);
	});

	it('stays open after a save when signalOnSubmit is false', async () => {
		const { api } = await opened({ preCompleteOk: async () => ({ success: true }) }, { signalOnSubmit: false });

		await api.submit();

		expect(api.dialogSignal.value).toBe(true);
	});

	it('sends the error with a correlation id', async () => {
		const { wrapper, api } = await opened({ preCompleteOk: failed });

		await api.submit();

		// it was handed the correlationId function
		expect(typeof wrapper.emitted('error')[0][1]).toBe('string');
	});

	it('applies the set scroll height', () => {
		const { api } = formDialog();

		// read .value off the string '500': "height: undefinedpx;"
		expect(api.scrollableHeightI.value).toBe('height: 500px;');
	});

	it('sizes the scroll area from the window with no set height', () => {
		const { api } = formDialog({ scrollableHeight: null });

		expect(api.scrollableHeightI.value).toBe(`height: ${Math.ceil((window.innerHeight - 200) * 0.5)}px;`);
	});

	it('notifies on reset only when asked', async () => {
		const { api } = formDialog();

		// the lookup dialogs pass null and expect no notification
		await api.reset('id', null);
		expect(api.notifySignal.value).toBe(false);

		await api.reset('id', true);
		expect(api.notifyMessage.value).toBe('messages.reset');
	});
});

describe('useBaseFormListingControlComponent', () => {
	const listing = (attrs = {}) => mountComposable(useBaseFormListingControlComponent, {
		props: baseFormListingControlProps,
		emits: [ 'close', 'delete', 'error', 'ok', 'reset' ],
		attrs: { validation: validation(), ...attrs }
	});

	it('notifies on reset only when asked', async () => {
		const { api } = listing();

		await api.reset('id', null);
		expect(api.notifySignal.value).toBe(false);

		await api.reset('id');
		expect(api.notifySignal.value).toBe(false);

		await api.reset('id', true);
		expect(api.notifyMessage.value).toBe('messages.reset');
	});
});
