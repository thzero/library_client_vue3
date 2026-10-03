import { defineComponent, h } from 'vue';

import { mount } from '@vue/test-utils';

import LibraryClientConstants from '@thzero/library_client/constants';
import LibraryClientUtility from '@thzero/library_client/utility/index';

// the services the base composables resolve through the injector
export const services = {
	[LibraryClientConstants.InjectorKeys.SERVICE_LOGGER]: { debug() {}, error() {}, exception() {}, info2() {} },
	[LibraryClientConstants.InjectorKeys.SERVICE_MARKUP_PARSER]: {
		render: (correlationId, markup) => `<p>${markup}</p>`,
		trimResults: (correlationId, value) => value
	}
};
LibraryClientUtility.$injector = { getService: (key) => services[key] ?? null };
LibraryClientUtility.$trans = { t: (key) => key };

// Mounts a renderless component around a composable, so a test can drive it
// through the component's props and emits; returns the wrapper and what the
// composable returned.
export const mountComposable = (composable, { props = {}, emits = [], options, attrs = {} } = {}) => {
	let api;
	const Component = defineComponent({
		props,
		emits,
		setup(propsI, context) {
			api = composable(propsI, context, options);
			return () => h('div');
		}
	});
	const wrapper = mount(Component, { props: attrs });
	return { wrapper, api };
};

// the minimum of a vuelidate instance the form composables touch
export const validation = (valid = true) => ({
	$validate: async () => valid,
	$reset: async () => {},
	$invalid: !valid,
	$silentErrors: [],
	$anyDirty: true
});
