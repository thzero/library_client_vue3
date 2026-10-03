import { describe, expect, it } from 'vitest';

// Every module in the package loads: catches imports that resolve to nothing,
// undefined identifiers at module scope and syntax errors. Most .vue files here
// are composables with no default export, so loading is all this checks.
const modules = import.meta.glob([
	'../boot/**/*.js',
	'../components/**/*.{js,vue}',
	'../layouts/**/*.{js,vue}',
	'../service/**/*.js',
	'../utility/**/*.js',
	'../constants.js',
	'../openSource.js'
]);

describe('modules', () => {
	it('finds the modules', () => {
		expect(Object.keys(modules).length).toBeGreaterThan(40);
	});

	it.each(Object.keys(modules))('%s loads', async (key) => {
		expect(await modules[key]()).toBeDefined();
	});
});
