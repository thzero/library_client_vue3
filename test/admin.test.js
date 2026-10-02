import { afterEach, describe, expect, it, vi } from 'vitest';

import { ref } from 'vue';

import { flushPromises } from '@vue/test-utils';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useAdminNewsBaseListingComponent } from '../components/admin/news/baseListing';
import { useAdminUsersBaseListingComponent } from '../components/admin/users/baseListing';

import { mountComposable } from './mount';

const headers = () => [ { title: 'name', key: 'name' } ];

afterEach(() => {
	delete LibraryClientUtility.$store;
});

describe('useAdminNewsBaseListingComponent', () => {
	const install = () => {
		const dispatcher = {
			adminNews: {
				deleteAdminNews: vi.fn(async () => ({ success: true })),
				searchAdminNews: vi.fn(async () => {})
			}
		};
		LibraryClientUtility.$store = { dispatcher, adminNews: { news: [ { id: 'a' }, { id: 'b' } ] } };
		return dispatcher;
	};

	it('searches when mounted', async () => {
		const dispatcher = install();

		mountComposable(useAdminNewsBaseListingComponent, { options: { initializeHeaders: headers } });
		await flushPromises();

		expect(dispatcher.adminNews.searchAdminNews).toHaveBeenCalledWith(expect.any(String), {});
	});

	it('lists the store news as a copy', () => {
		install();
		const { api } = mountComposable(useAdminNewsBaseListingComponent, { options: { initializeHeaders: headers } });

		expect(api.news.value).toEqual([ { id: 'a' }, { id: 'b' } ]);
		expect(api.news.value).not.toBe(LibraryClientUtility.$store.adminNews.news);
	});

	it('lists nothing before the first search', () => {
		install();
		LibraryClientUtility.$store.adminNews.news = null;
		const { api } = mountComposable(useAdminNewsBaseListingComponent, { options: { initializeHeaders: headers } });

		expect(api.news.value).toEqual([]);
	});

	it('takes its headers from the options', () => {
		install();
		const { api } = mountComposable(useAdminNewsBaseListingComponent, { options: { initializeHeaders: headers } });

		expect(api.headers.value).toEqual(headers());
	});

	it('deletes through the store', async () => {
		const dispatcher = install();
		const { api } = mountComposable(useAdminNewsBaseListingComponent, { options: { initializeHeaders: headers } });

		await api.dialogDeleteOpen({ id: 'a' });
		await api.dialogDeletePreCompleteOk();

		expect(dispatcher.adminNews.deleteAdminNews).toHaveBeenCalledWith(expect.any(String), 'a');
	});

	it('opens the editor on an empty item for a new one', async () => {
		install();
		const reset = vi.fn(async () => {});
		const editDialogRef = ref({ reset });
		const { api } = mountComposable(useAdminNewsBaseListingComponent, { options: { initializeHeaders: headers, editDialogRef } });

		await api.dialogEditOpen(null, true);

		// a null default item left the dialog nothing to bind to
		expect(reset).toHaveBeenCalledWith(expect.any(String), {});
		expect(api.dialogEditSignal.value.signal).toBe(true);
	});
});

describe('useAdminUsersBaseListingComponent', () => {
	const install = () => {
		const dispatcher = {
			adminUsers: {
				deleteAdminUser: vi.fn(async () => ({ success: true })),
				searchAdminUsers: vi.fn(async () => {})
			}
		};
		LibraryClientUtility.$store = { dispatcher, adminUsers: { users: [ { id: 'u' } ] } };
		return dispatcher;
	};

	it('searches when mounted', async () => {
		const dispatcher = install();

		mountComposable(useAdminUsersBaseListingComponent, { options: { initializeHeaders: headers } });
		await flushPromises();

		expect(dispatcher.adminUsers.searchAdminUsers).toHaveBeenCalledWith(expect.any(String), {});
	});

	it('lists the store users', () => {
		install();
		const { api } = mountComposable(useAdminUsersBaseListingComponent, { options: { initializeHeaders: headers } });

		expect(api.users.value).toEqual([ { id: 'u' } ]);
	});

	it('deletes through the store', async () => {
		const dispatcher = install();
		const { api } = mountComposable(useAdminUsersBaseListingComponent, { options: { initializeHeaders: headers } });

		await api.dialogDeleteOpen({ id: 'u' });
		await api.dialogDeletePreCompleteOk();

		expect(dispatcher.adminUsers.deleteAdminUser).toHaveBeenCalledWith(expect.any(String), 'u');
	});
});
