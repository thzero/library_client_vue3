![GitHub package.json version](https://img.shields.io/github/package-json/v/thzero/library_client_vue3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# library_client_vue3

An opinionated library for building a Vue 3 single page application on [library_client](https://github.com/thzero/library_client): the boot sequence, the Vue services, and the composables behind the application's pages, dialogs and forms. It has no markup of its own; [library_client_vue3_vuetify3](https://github.com/thzero/library_client_vue3_vuetify3) provides the Vuetify components built on it.

## Requirements

### NodeJs

[NodeJs](https://nodejs.org) version 22+.

### Vite

Applications are built with [Vite](https://vitejs.dev). The `_config` folder holds the files to start from (see [Project files](#project-files)).

## Installation

[![NPM](https://nodei.co/npm/@thzero/library_client_vue3.png?compact=true)](https://npmjs.org/package/@thzero/library_client_vue3)

```
npm install @thzero/library_client_vue3
```

It installs `@thzero/library_client`, `@thzero/library_common`, `vue`, `vue-router`, `vue-i18n`, `@vuelidate/core` and the rest of what it needs. It requires `vuetify` (`^4`) as a peer.

A complete application usually adds:

| Package | For |
|---|---|
| [library_client_vue3_store_pinia](https://github.com/thzero/library_client_vue3_store_pinia) | the store |
| [library_client_vue3_vuetify3](https://github.com/thzero/library_client_vue3_vuetify3) | the Vuetify components |
| [library_client_service_rest_fetch](https://github.com/thzero/library_client_service_rest_fetch) or [library_client_service_rest_axios](https://github.com/thzero/library_client_service_rest_axios) | calls to a server |
| [library_client_firebase_vue](https://github.com/thzero/library_client_firebase_vue) | sign in, and route authorization |

## Project files

Copy these from `_config` into the application's root folder:

* `vite.config.js`: also writes the configuration from the `_CONFIG` environment variable when a build provides one, maps the `local-config` and `open-source-config` imports, and generates `src/openSource.js`, the credits list, from the `openSource.js` of each installed `@thzero` package.
* `jsconfig.json`, `.eslintrc.js`, `.eslintignore`, `.browserslistrc`, `.editorconfig`

Add the version fields after `version` in the application's `package.json`; the version service and the version display read them:

```json
  "version_major": 0,
  "version_minor": 1,
  "version_patch": 0,
  "version_date": "MM/DD/YYYY",
```

The supported browsers are listed in `.browserslistrc`, copied from `_config` above. To add vendor prefixes to the CSS as well, install `autoprefixer` (`npm install -D autoprefixer`) and add this at the end of `package.json`; Vite reads it:

```json
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  }
```

## Configuration

Create `src/config/development.json` and `src/config/production.json`, kept out of source control. The format is described in [library_client](https://github.com/thzero/library_client#configuration).

## Application setup

The following lists the folders and files that make up a basic application on this library.

### index.html

Vite serves `index.html` from the application's root folder (not `public`) and loads `src/main.js` from it. Files in `public`, such as the icons, are served from `/`.

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0" />

		<meta http-equiv="cache-control" content="max-age=0" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="-1" />
		<meta http-equiv="pragma" content="no-cache" />

		<link rel="icon" href="/icons/favicon.ico" />
		<link rel="manifest" href="/manifest.json" />
		<meta name="msapplication-TileColor" content="#ffffff" />
		<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
		<meta name="theme-color" content="#ffffff" />
		<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
		<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
		<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
		<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
		<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
		<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
		<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
		<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
		<link rel="shortcut icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
		<link rel="shortcut icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<link rel="shortcut icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
		<link rel="shortcut icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

		<!-- optional: the Roboto font, and the styles for markdown rendered with the markdown-body class -->
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css" />

		<title><name of your application></title>
	</head>
	<body>
		<noscript>
			<strong>We're sorry but <name of your application> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
		</noscript>
		<div id="app"></div>
		<script type="module" src="/src/main.js"></script>
	</body>
</html>
```

The icon fonts are installed as packages (`@mdi/font`, `material-design-icons-iconfont`) and imported in `main.js`, rather than linked from a CDN.

### Constants

Keep the keys for the application's own injectable services in `src/constants.js`:

```js
const AppConstants = {
	InjectorKeys: {
		// keys for the application's injectable services, for example
		// SERVICE_LAUNCHES: 'serviceLaunches'
	}
};

export default AppConstants;
```

### Boot files

A boot file is a class with an `execute(framework, router, store, options)` method, or a function taking `{ framework, router, store, options }`. Each runs, in order, before the application mounts.

**Services**, `src/boot/services.js`: extend the Vue root services and supply the services the application needs (see [library_client](https://github.com/thzero/library_client#boot) for which ones must be supplied).

```js
import RootServicesBoot from '@thzero/library_client_vue3/boot/rootServices';

class ServiceBoot extends RootServicesBoot {
	_initialize() {
		super._initialize();

		// the application's own services
		this._injectService(AppConstants.InjectorKeys.SERVICE_LAUNCHES, new launchesService());
	}

	_initializeSecurity() {
		return new securityService();
	}

	_initializeVersion() {
		return new versionService();
	}
}

export default ServiceBoot;
```

`boot/adminServices` adds the admin news and users services, for an application with an admin area.

**Translations**, `src/boot/i18n.js`:

```js
import Vuei18nBaseBoot from '@thzero/library_client_vue3/boot/basei18n';

const resources = {};
const modules = import.meta.glob('@/locales/*.json', { eager: true });
for (const locale of [ 'en' ])
	resources[locale] = modules[`/src/locales/${locale}.json`];

export default class Vuei18nBoot extends Vuei18nBaseBoot {
	_initMessages() {
		return resources;
	}
}
```

**Validation**, `src/boot/validate.js`: extend `@thzero/library_client_vue3/boot/baseValidation` and add any validation extensions in `_initialize(extend)`.

### Services

Services are classes registered with the injector in the services boot, and looked up by key.

**Version**, `src/service/version.js`: reports the version fields from `package.json`. Vite imports `package.json` through `import.meta.glob`:

```js
import VersionService from '@thzero/library_client/service/version';

const modules = import.meta.glob('../../package.json', { eager: true });
// eslint-disable-next-line camelcase
const { version_major, version_minor, version_patch, version_date, copyright, author, author_url } = modules['../../package.json'];

class AppVersionService extends VersionService {
	async _version(correlationId) {
		return this._generate(correlationId, version_major, version_minor, version_patch, version_date, copyright, author, author_url);
	}
}

export default AppVersionService;
```

**Custom services** can live anywhere under `src`; `src/service` is recommended. A custom service extends `Service` and looks up the services it uses in `init`:

```js
import AppConstants from '@/constants';
import LibraryClientConstants from '@thzero/library_client/constants';

import Service from '@thzero/library_client/service/index';

class LaunchesService extends Service {
	constructor() {
		super();

		this._serviceCommunicationRest = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceCommunicationRest = this._injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_COMMUNICATION_REST);
	}

	async retrieve(correlationId, id) {
		this._enforceNotEmpty('LaunchesService', 'retrieve', id, 'id', correlationId);

		return await this._serviceCommunicationRest.getById(correlationId, LibraryClientConstants.ExternalKeys.BACKEND, 'launches', id);
	}
}

export default LaunchesService;
```

Register it in the services boot under a key from `src/constants.js`:

```js
this._injectService(AppConstants.InjectorKeys.SERVICE_LAUNCHES, new LaunchesService());
```

### Other boot files

**Other boot files** in this package: `boot/eventBus` (the event bus the components and services use; include it), `boot/asyncComputed`, `boot/scrollTo` and `boot/webComponents`. The UI boot comes from [library_client_vue3_vuetify3](https://github.com/thzero/library_client_vue3_vuetify3).

### Main.js

Replace the code in `src/main.js` with the following. Remove the boot files the application does not use.

```js
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';

import bootStarter from '@thzero/library_client_firebase_vue/boot/starter';
import bootEventBus from '@thzero/library_client_vue3/boot/eventBus';
import booti18n from '@/boot/i18n';
import bootServices from '@/boot/services';
import bootServicesAdmin from '@/boot/servicesAdmin';
import bootUi from '@/boot/ui';
import bootValidate from '@/boot/validate';
// import bootAsyncComputed from '@thzero/library_client_vue3/boot/asyncComputed';
// import bootWebComponents from '@thzero/library_client_vue3/boot/webComponents';
import bootCookieComply from '@thzero/library_client_vue3_vuetify3/boot/cookie';

import router from '@/router';

import store from '@/store/pinia';

import start from '@thzero/library_client_vue3/boot/main';

import App from '@/components/App.vue';

start(App, router, store, [ booti18n, bootEventBus, bootServices, bootServicesAdmin, bootValidate, bootUi, bootCookieComply ], bootStarter, {
	// optional: the id generator's alphabet and lengths
	idGenerator: {
		alphabet: '<alphabet>',
		lengthLong: 16,
		lengthShort: 8
	}
});
```

`start(appComponent, router, store, bootFiles, starter, options)` creates the application, installs the store (a store class, such as one from [library_client_vue3_store_pinia](https://github.com/thzero/library_client_vue3_store_pinia)) and the router, runs each boot file in order, runs the starter, and mounts on `#app`.

* **`bootStarter`**: sign in and route authorization from [library_client_firebase_vue](https://github.com/thzero/library_client_firebase_vue). Pass `null` for an application without them.
* **`bootServicesAdmin`**: only for an application with an admin area; it extends `@thzero/library_client_vue3/boot/adminServices`:

```js
import AdminServicesBaseBoot from '@thzero/library_client_vue3/boot/adminServices';

class AdminServiceBoot extends AdminServicesBaseBoot {
	_initialize() {
		super._initialize();
	}
}

export default AdminServiceBoot;
```

* **`bootUi`** and **`bootCookieComply`**: from [library_client_vue3_vuetify3](https://github.com/thzero/library_client_vue3_vuetify3#ui-boot).
* **`options.idGenerator`**: optional; `alphabet`, `lengthLong`, `lengthShort` and `override` configure the id generator from `library_common`.

### App.vue

Put the root component's logic in a composable, `src/components/app.vue`, built on `useBaseAppComponent`. `initializeI` runs once when the application mounts:

```js
<script>
import LibraryClientConstants from '@thzero/library_client/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseAppComponent } from '@thzero/library_client_vue3/components/baseApp';

export function useAppComponent(props, context, options) {
	const {
		correlationId,
		error,
		hasFailed,
		hasSucceeded,
		initialize,
		logger,
		noBreakingSpaces,
		notImplementedError,
		success
	} = useBaseAppComponent(
		props,
		context,
		{
			initializeI: async () => {
				return [
					serviceStore.dispatcher.initialize(correlationId())
				];
			}
		}
	);

	const serviceStore = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_STORE);

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
		serviceStore
	};
};
</script>
```

and use it from `src/components/App.vue`:

```html
<template>
	<router-view />
</template>

<script>
import { useAppComponent } from '@/components/app';

export default {
	name: 'App',
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
			serviceStore
		} = useAppComponent();

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
			serviceStore
		};
	}
};
</script>
```

### Router

* Delete the `router` folder, if the project template created one.
* Add a `router.js` file to the `src` folder.
* Set it up as follows.

Each page is a child of a layout route. Route authorization is set in each route's `meta`, and enforced by [library_client_firebase_vue](https://github.com/thzero/library_client_firebase_vue#protecting-routes). The layouts and `VtNotFound` come from [library_client_vue3_vuetify3](https://github.com/thzero/library_client_vue3_vuetify3).

```js
import { createRouter, createWebHistory } from 'vue-router';

import LibraryClientUtility from '@thzero/library_client/utility/index';

const routes = [
	{
		path: '/',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'default',
				component: () => import('./components/Home.vue'),
				meta: {
					requiresAuth: false
				}
			}
		]
	},
	{
		path: '/openSource',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'openSource',
				component: () => import('./components/OpenSource.vue'),
				meta: {
					requiresAuth: false
				}
			}
		]
	},
	{
		path: '/privacy',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'privacy',
				component: () => import('./components/Privacy.vue'),
				meta: {
					requiresAuth: false
				}
			}
		]
	},
	{
		path: '/settings',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'settings',
				component: () => import('./components/Settings.vue'),
				meta: {
					requiresAuth: true
				}
			}
		]
	},
	{
		path: '/about',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'about',
				component: () => import('./components/About.vue'),
				meta: {
					requiresAuth: false
				}
			}
		]
	},
	{
		path: '/support',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'support',
				component: () => import('./components/Support.vue'),
				meta: {
					requiresAuth: true
				}
			}
		]
	},
	{
		path: '/auth',
		component: () => import('@thzero/library_client_vue3_vuetify3/layouts/AuthLayout.vue'),
		children: [
			{
				path: '',
				name: 'auth',
				component: () => import('./components/Auth.vue'),
				meta: {
					requiresAuth: false
				}
			}
		]
	},
	{
		path: '/admin',
		component: () => import('@thzero/library_client_vue3_vuetify3/layouts/AdminLayout.vue'),
		children: [
			{
				path: '',
				name: 'admin',
				component: () => import('./components/admin/Admin.vue'),
				meta: {
					requiresAuth: true,
					requiresAuthRoles: [ 'admin' ]
				}
			}
		]
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('@thzero/library_client_vue3_vuetify3/layouts/BlankLayout.vue'),
		children: [
			{
				path: '',
				name: 'notFound',
				component: () => import('@thzero/library_client_vue3_vuetify3/components/VtNotFound.vue'),
				meta: {
					requiresAuth: false
				}
			}
		]
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

router.beforeResolve((to, from, next) => {
	if (to.matched.some(record => record.meta.notFound)) {
		LibraryClientUtility.$navRouter.push('/notFound');
		return;
	}

	next();
});

export default router;
```

The catch-all route renders `VtNotFound` for any path nothing else matches. The `beforeResolve` hook sends a route marked `meta: { notFound: true }` to `/notFound`, for an application that keeps a separate not found route.

## Composables

The components are composables: functions a component calls from `setup()`, returning the state and handlers its template uses. Most take `(props, context, options)`, and the `*Props.js` files beside them hold the matching props. Each builds on `useBaseComponent`, which provides `correlationId()`, `logger`, `hasFailed`, `hasSucceeded`, `success`, `error` and `initialize`.

| Area | Composables |
|---|---|
| Base | `useBaseComponent`, `useBaseEditComponent`, `useBaseControlEditComponent`, `useBasePageEditComponent`, `useNotify` |
| Application and layouts | `useBaseAppComponent`, `useBaseLayout`, `useBaseMainLayout`, `useBaseAdminLayout`, `useBaseAdminComponent` |
| Dialogs | `useDisplayDialogBaseComponent`, `useBaseConfirmationDialogComponent`, `useBaseLoadingOverlayComponent` |
| Forms | `useBaseFormControlComponent`, `useBaseFormDialogControlComponent`, `useBaseFormListingControlComponent` |
| Pages | `useBaseAboutComponent`, `useBaseAuthComponent`, `useBaseCopyrightComponent`, `useBaseMarkdownComponent`, `useBaseNotFoundComponent`, `useBaseOpenSourceComponent`, `useBasePrivacyComponent`, `useBaseSettingsComponent`, `useBaseSupportComponent`, `useBaseVersionComponent` |
| Admin | `useAdminBaseListingComponent`, `useAdminNewsBaseListingComponent`, `useAdminUsersBaseListingComponent` |

A composable lives in a `.vue` file with no default export, so import it by name:

```js
import { useBaseFormDialogControlComponent } from '@thzero/library_client_vue3/components/form/baseFormDialogControl';
```

The admin listings expect the store's `adminNews` and `adminUsers` modules (see [library_client_vue3_store_pinia](https://github.com/thzero/library_client_vue3_store_pinia#modules)).

## Locales

For translation, create `src/locales/en.json` (one file per locale) and load it in the translations boot above. English is the default. This is everything this package and [library_client_vue3_vuetify3](https://github.com/thzero/library_client_vue3_vuetify3) look up; add the application's own text beside it. Text in braces, such as `{max}`, is filled in by the library.

```json
{
	"auth": {
		"google": "Google",
		"rememberMe": "Remember Me"
	},
	"buttons": {
		"cancel": "Cancel",
		"clear": "Clear",
		"close": "Close",
		"delete": "Delete",
		"filter": "Filter",
		"ok": "Ok"
	},
	"errors": {
		"duplicateName": "There is already a {objectType} with the name of '{name}'.",
		"duplicateNumber": "There is already a {objectType} with the number of '{number}'.",
		"duplicateOrder": "There is already a {objectType} with order '{order}'.",
		"error": "An error occurred, please try again.",
		"invalidPermissions": "You do not have permission to perform the requested action.",
		"invalidRequest": "Invalid request.",
		"notFound": "You have been led astray.",
		"objectChanged": "The '{objectType}' has changed, please refresh and try again.",
		"params": {
		},
		"quotaExceeded": "You have reached your quota of {quota} '{quotaType}'.",
		"tagLine": {
			"max": "No more than {max} tags."
		}
	},
	"forms": {
		"externalId": "External Id",
		"id": "Id",
		"name": "Name",
		"roles": "Roles"
	},
	"messages": {
		"error": "An error occurred, please try again.",
		"loading": "Loading...",
		"reset": "Reset",
		"saved": "Saved"
	},
	"news": {
		"actions": "Actions",
		"article": "Article",
		"name": "Name",
		"publishDate": "Publish Date",
		"requiresAuth": "Authenticated",
		"statusName": "Status",
		"sticky": "Sticky"
	},
	"openSource": {
		"client": "Client",
		"license": "License",
		"resource": "Resource",
		"server": "Server"
	},
	"questions": {
		"areYouSure": "Are you sure?",
		"areYouSureNonRecoverable": "Are you sure? This cannot be undone.",
		"formDirty": {
			"cancel": "You made changes, are you sure you wish to leave?",
			"clear": "You made changes, are you sure you wish to reset?",
			"close": "You made changes, are you sure you wish to close?"
		}
	},
	"strings": {
		"privacy": {
			"text1": "<your privacy policy, in markdown>"
		}
	},
	"titles": {
		"application": "<your application name>",
		"contact": {
			"contributing": "{email} Contributing",
			"inquiry": "{email} Inquiry"
		},
		"edit": "Edit",
		"home": "Home",
		"new": "New",
		"profile": "Profile",
		"settings": "Settings",
		"signIn": "Sign In",
		"signOut": "Sign Out"
	},
	"users": {
		"actions": "Actions",
		"externalId": "External Id",
		"id": "Id",
		"name": "Name",
		"roles": "Roles"
	},
	"version": {
		"label": "Version",
		"majorMinorDate": "{major}.{minor}.{patch} {date}"
	}
}
```

The `errors` entries other than `notFound` and `tagLine` translate errors from the server. `LibraryClientVueUtility.applyError` (`@thzero/library_client_vue3/utility`) looks up `errors.<code>` for an error's code, falling back to `errors.error`, and fills in its parameters; a parameter marked for translation is looked up in `errors.params` (for example `"news": "news"`).

See [Vue I18n](https://vue-i18n.intlify.dev) for the message format.

## Development

```
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev); the composables are tested through a small mounted component. The `test` folder and the configuration files are not published.

## License

[MIT](license.md)
