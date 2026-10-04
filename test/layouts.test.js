import { afterEach, describe, expect, it } from 'vitest';

import LibraryClientConstants from '@thzero/library_client/constants';

import { useBaseAdminLayout } from '../layouts/baseAdminLayout';
import { useBaseMainLayout } from '../layouts/baseMainLayout';

import { mountComposable, services } from './mount';

// The layouts bind the loading overlay to isAuthCompleted, so a false here is an
// overlay that never goes away.
const install = (user, authCompleted) => {
	services[LibraryClientConstants.InjectorKeys.SERVICE_STORE] = {
		user,
		userAuthCompleted: authCompleted,
		userAuthIsLoggedIn: user !== null
	};
};

afterEach(() => {
	delete services[LibraryClientConstants.InjectorKeys.SERVICE_STORE];
});

describe.each([
	[ 'useBaseMainLayout', useBaseMainLayout ],
	[ 'useBaseAdminLayout', useBaseAdminLayout ]
])('%s', (name, composable) => {
	it('completes auth for a visitor who is not signed in', () => {
		// gated on serviceStore.user as well, so an anonymous visitor, whose user
		// stays null, sat under the overlay forever
		install(null, true);
		const { api } = mountComposable(composable);

		expect(api.isAuthCompleted.value).toBe(true);
	});

	it('completes auth for a signed-in user', () => {
		install({ id: 'a' }, true);
		const { api } = mountComposable(composable);

		expect(api.isAuthCompleted.value).toBe(true);
	});

	it('does not complete auth until the auth state resolves', () => {
		install(null, false);
		const { api } = mountComposable(composable);

		expect(api.isAuthCompleted.value).toBe(false);
	});
});
