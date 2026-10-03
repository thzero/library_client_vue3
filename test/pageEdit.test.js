import { afterEach, describe, expect, it, vi } from 'vitest';

import { useBasePageEditComponent } from '../components/basePageEdit';
import VueBaseUserService from '../service/baseUser';

import { mountComposable } from './mount';

// Captures the guard the composable registers, so a test can run a navigation
// through it without a router.
const guards = vi.hoisted(() => []);
vi.mock('vue-router', () => ({
	onBeforeRouteLeave: (guard) => guards.push(guard)
}));

describe('useBasePageEditComponent', () => {
	afterEach(() => {
		guards.length = 0;
		vi.restoreAllMocks();
	});

	const leave = async () => {
		const next = vi.fn();
		await guards[guards.length - 1]({}, {}, next);
		return next;
	};

	it('lets a clean page leave', async () => {
		mountComposable(useBasePageEditComponent);

		const next = await leave();
		expect(next).toHaveBeenCalledWith();
	});

	it('lets a dirty page leave once the user confirms', async () => {
		const { api } = mountComposable(useBasePageEditComponent);
		api.dirtyCheck('id', { value: true });
		vi.spyOn(window, 'confirm').mockReturnValue(true);

		const next = await leave();
		expect(next).toHaveBeenCalledWith();
	});

	// returning without calling next left the navigation pending
	it('cancels the navigation when the user stays', async () => {
		const { api } = mountComposable(useBasePageEditComponent);
		api.dirtyCheck('id', { value: true });
		vi.spyOn(window, 'confirm').mockReturnValue(false);

		const next = await leave();
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(false);
	});
});

describe('VueBaseUserService', () => {
	const newService = () => {
		const calls = [];
		const service = new VueBaseUserService();
		service._serviceStore = { dispatcher: { user: { setUserAuthCompleted: async (correlationId, value) => calls.push(value) } } };
		return { service, calls };
	};

	// sign-out passes false; the value was dropped and authCompleted stayed true
	it('passes the value it is given to the store', async () => {
		const { service, calls } = newService();

		await service.setAuthCompleted('id', false);
		await service.setAuthCompleted('id', true);

		expect(calls).toEqual([ false, true ]);
	});

	it('defaults to true', async () => {
		const { service, calls } = newService();

		await service.setAuthCompleted('id');

		expect(calls).toEqual([ true ]);
	});
});
