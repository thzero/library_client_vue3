import { createApp } from 'vue';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LIbraryCommonUtility from '@thzero/library_common/utility/index';

import {} from '@thzero/library_common/utility/string';

// eslint-disable-next-line
async function start(appComponent, router, storeRequest, bootFiles, starter, options) {
	const framework = createApp(appComponent);

	if (options) {
		if (options.idGeneratorOverride)
			LIbraryCommonUtility.setIdGenerator(options.idGeneratorOverride);
	}

	// if (bootFiles && (bootFiles.length > 0)) {
	// 	let obj;
	// 	for (const bootFile of bootFiles) {
	// 		if (typeof bootFile !== 'function')
	// 			continue;

	// 		try {
	// 			try {
	// 				await bootFile({
	// 					framework,
	// 					router,
	// 					options
	// 				});
	// 				continue;
	// 			}
	// 			catch (err) {
	// 				obj = new bootFile();
	// 				await obj.execute(
	// 					framework,
	// 					router,
	// 					options
	// 				);
	// 				continue;
	// 			}
	// 		}
	// 		catch (err) {
	// 			if (err && err.url) {
	// 				window.location.href = err.url;
	// 				return;
	// 			}

	// 			// eslint-disable-next-line
	// 			console.error('boot error:', err);
	// 			return;
	// 		}
	// 	}
	// }

	LibraryClientUtility.$navRouter = router;
	if (router)
		framework.use(router);

	let storeWrapper;
	let storeInitialize;
	let storeSetup;
	if (storeRequest) {
		try {
			storeWrapper = new storeRequest();
		}
		catch (err) {
			console.log(err);
			throw Error('Invalid store wrapper.');
		}

		if (storeWrapper) {
			try {
				storeInitialize = await storeWrapper.initialize();
			}
			catch (err) {
				console.log(err);
				throw Error('Invalid store initialization.');
			}

			try {
				storeSetup = storeWrapper.setup();
			}
			catch (err) {
				console.log(err);
				throw Error('Invalid store setup.');
			}
		}
	}

	if (storeInitialize && storeSetup)
		framework.use(storeInitialize).use(storeSetup.func, storeSetup.options).use(router);
	else if (storeInitialize)
		framework.use(storeInitialize).use(router);

	if (bootFiles && (bootFiles.length > 0)) {
		const store = LibraryClientUtility.$store;
		let obj;
		for (const bootFile of bootFiles) {
			if (typeof bootFile !== 'function')
				continue;

			try {
				try {
					await bootFile({
						framework,
						router,
						store,
						options
					});
					continue;
				}
				catch (err) {
					obj = new bootFile();
					await obj.execute(
						framework,
						router,
						store,
						options
					);
					continue;
				}
			}
			catch (err) {
				if (err && err.url) {
					window.location.href = err.url;
					return;
				}

				// eslint-disable-next-line
				console.error('boot error:', err);
				return;
			}
		}
	}

	framework.mount('#app');

	if (starter) {
		starter({
			framework,
			app,
			router,
			store: LibraryClientUtility.$store
		}).catch(err => {
			// eslint-disable-next-line
			console.error('boot error:', err);
		});
	}

	// if (!starter) {
	// 	framework.use(storeInitialized).use(router).mount('#app');
	// 	return;
	// }

	// try {
	// 	const result = starter({
	// 		framework,
	// 		app,
	// 		router,
	// 		store: LibraryClientUtility.$store
	// 	});

	// 	result
	// 		// eslint-disable-next-line
	// 		.then(values => {
	// 			// new Vue(vueApp).$mount('#app');
	// 			framework.use(storeInitialized).use(router).mount('#app');
	// 		})
	// 		.catch(err => {
	// 			// eslint-disable-next-line
	// 			console.error('boot error:', err);
	// 		});
	// }
	// catch (err) {
	// 	if (err && err.url) {
	// 		window.location.href = err.url;
	// 		return;
	// 	}

	// 	// eslint-disable-next-line
	// 	console.error('boot error:', err);
	// }
}

export default start;
