import { afterEach, describe, expect, it, vi } from 'vitest';

import mitt from 'mitt';

import { flushPromises } from '@vue/test-utils';

import LibraryClientConstants from '@thzero/library_client/constants';
import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseComponent } from '../components/base';
import { useBaseAdminComponent } from '../components/baseAdmin';
import { useBaseAuthComponent } from '../components/baseAuth';
import { useBaseControlEditComponent } from '../components/baseControlEdit';
import { useBaseControlEditProps } from '../components/baseControlEditProps';
import { useDisplayDialogBaseComponent } from '../components/baseDisplayDialog';
import { baseDisplayDialogBaseProps } from '../components/baseDisplayDialogProps';
import { useBaseLoadingOverlayComponent } from '../components/baseLoadingOverlay';
import { baseLoadingOverlayProps } from '../components/baseLoadingOverlayProps';

import { mountComposable, services } from './mount';

describe('useBaseComponent', () => {
	it('initializes with no options', async () => {
		const { api } = mountComposable(useBaseComponent);

		// a comma in the condition dropped the options check: a TypeError
		expect(await api.initialize()).toBeNull();
	});

	it('runs initializeI from the options', async () => {
		const { api } = mountComposable(useBaseComponent, { options: { initializeI: async () => [ 1 ] } });

		expect(await api.initialize()).toEqual([ 1 ]);
	});
});

describe('useBaseAuthComponent', () => {
	const install = (features) => {
		services[LibraryClientConstants.InjectorKeys.SERVICE_AUTH] = { isAuthenticated: async () => false, signIn: async () => {} };
		services[LibraryClientConstants.InjectorKeys.SERVICE_FEATURES] = { features: () => features };
		LibraryClientUtility.$EventBus = mitt();
	};

	afterEach(() => {
		delete services[LibraryClientConstants.InjectorKeys.SERVICE_AUTH];
		delete services[LibraryClientConstants.InjectorKeys.SERVICE_FEATURES];
	});

	it('allows remember me when the feature is on', () => {
		install({ RememberMe: true });
		const { api } = mountComposable(useBaseAuthComponent);

		// read features as a property, so RememberMe was always undefined
		expect(api.allowRememberMe.value).toBe(true);
		expect(api.features.value).toEqual({ RememberMe: true });
	});

	it('does not allow remember me when the feature is off', () => {
		install({ RememberMe: false });
		const { api } = mountComposable(useBaseAuthComponent);

		expect(api.allowRememberMe.value).toBe(false);
	});

	it('follows the auth event', async () => {
		install({});
		const { api } = mountComposable(useBaseAuthComponent);
		await flushPromises();

		// threw on this.correlationId(), and set .value on the boolean parameter
		LibraryClientUtility.$EventBus.emit('auth', true);

		expect(api.isLoggedIn.value).toBe(true);
		expect(api.disabled.value).toBe(true);
	});

	it('stops listening when unmounted', async () => {
		install({});
		const { wrapper } = mountComposable(useBaseAuthComponent);
		await flushPromises();
		expect(LibraryClientUtility.$EventBus.all.get('auth')).toHaveLength(1);

		wrapper.unmount();

		expect(LibraryClientUtility.$EventBus.all.get('auth') ?? []).toHaveLength(0);
	});
});

describe('useBaseControlEditComponent', () => {
	const field = (attrs) => mountComposable(useBaseControlEditComponent, {
		props: { ...useBaseControlEditProps, min: { type: Number, default: null }, max: { type: Number, default: null }, type: { type: String, default: 'decimal' } },
		emits: [ 'update:modelValue' ],
		attrs
	});
	const paste = (text) => ({ type: 'paste', clipboardData: { getData: () => text }, preventDefault: vi.fn() });
	const keypress = (char, keyCode) => ({ type: 'keypress', keyCode: keyCode ?? char.charCodeAt(0), which: char.charCodeAt(0), preventDefault: vi.fn() });

	it('accepts a pasted decimal', () => {
		const { api } = field({ type: 'decimal' });
		const evt = paste('1.5');

		api.validateNumericField(evt);

		// the template literal turned \d into a literal d, so this needed "1.d"
		expect(evt.preventDefault).not.toHaveBeenCalled();
	});

	it('refuses a pasted decimal in an integer field', () => {
		const { api } = field({ type: 'integer' });
		const evt = paste('1.5');

		api.validateNumericField(evt);

		expect(evt.preventDefault).toHaveBeenCalled();
	});

	it('accepts a pasted whole number', () => {
		const { api } = field({ type: 'integer' });
		const evt = paste('1,234');

		api.validateNumericField(evt);

		expect(evt.preventDefault).not.toHaveBeenCalled();
	});

	it('falls back to which when keyCode is 0', () => {
		const { api } = field({ type: 'decimal' });
		const evt = keypress('5', 0);

		// read theEvent.which, an undefined name
		api.validateNumericField(evt);

		expect(evt.preventDefault).not.toHaveBeenCalled();
	});

	it('refuses a letter', () => {
		const { api } = field({ type: 'decimal' });
		const evt = keypress('a');

		api.validateNumericField(evt);

		expect(evt.preventDefault).toHaveBeenCalled();
	});
});

describe('useBaseLoadingOverlayComponent', () => {
	it('uses the loading message by default', () => {
		// was an Options component extending base.vue, which has no default export
		const { api } = mountComposable(useBaseLoadingOverlayComponent, { props: baseLoadingOverlayProps });

		expect(api.displayMessage.value).toBe('messages.loading');
	});

	it('uses the message it is given', () => {
		const { api } = mountComposable(useBaseLoadingOverlayComponent, { props: baseLoadingOverlayProps, attrs: { message: 'wait' } });

		expect(api.displayMessage.value).toBe('wait');
	});
});

describe('useDisplayDialogBaseComponent names', () => {
	it('carries no edit state', () => {
		const { api } = mountComposable(useDisplayDialogBaseComponent, { props: baseDisplayDialogBaseProps, emits: [ 'cancel', 'ok' ] });

		// a display dialog never saves; it once destructured these from
		// useBaseComponent, which does not return them, and passed on undefined
		expect('isSaving' in api).toBe(false);
		expect('serverErrors' in api).toBe(false);
		expect('setErrors' in api).toBe(false);
	});
});

describe('useBaseAboutComponent', () => {
	it('titles the inquiry email from titles.contact, beside contributing', async () => {
		const { useBaseAboutComponent } = await import('../components/baseAbout');
		const { api } = mountComposable(useBaseAboutComponent, { options: { emails: { contributing: 'c@x', inquiry: 'i@x' } } });

		// looked up titles.inquiry, which the apps never define, so the raw key showed
		expect(api.emailsInquiryTitle.value).toBe('titles.contact.inquiry');
		expect(api.emailsContributingTitle.value).toBe('titles.contact.contributing');
	});
});

describe('useBaseAdminComponent', () => {
	it('toggles the drawer once per event after a second visit', async () => {
		LibraryClientUtility.$EventBus = mitt();

		mountComposable(useBaseAdminComponent).wrapper.unmount();
		const { api } = mountComposable(useBaseAdminComponent);
		const before = api.drawer.value;

		// the first visit's listener stayed: one event flipped it twice
		LibraryClientUtility.$EventBus.emit('toggle-drawer');

		expect(api.drawer.value).toBe(!before);
		expect(LibraryClientUtility.$EventBus.all.get('toggle-drawer')).toHaveLength(1);
	});
});

describe('useBaseSettingsComponent', () => {
	it('turns every space and symbol in a gamer tag, not only the first', async () => {
		services[LibraryClientConstants.InjectorKeys.SERVICE_STORE] = { user: null, getters: { user: { getUserSettings: () => ({}) } } };
		try {
			const { useBaseSettingsComponent } = await import('../components/baseSettings');
			const { api } = mountComposable(useBaseSettingsComponent, { options: {} });
			api.resetAdditionalI('id');

			api.gamerTagDisplay.value = 'a b c\'d\'e';
			await flushPromises();

			// replace() with a string changes only the first match: "a_b c-d'e"
			expect(api.gamerTag.value).toBe('a_b_c-d-e');
		}
		finally {
			delete services[LibraryClientConstants.InjectorKeys.SERVICE_STORE];
		}
	});
});
