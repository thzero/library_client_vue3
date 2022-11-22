import { createApp } from 'vue';

import GlobalUtility from '@thzero/library_client/utility/global';

import {} from '@thzero/library_common/utility/string';

// eslint-disable-next-line
// async function start(app, router, storeRequest, vuetify, bootFiles, starter) {
async function start(app, router, storeRequest, bootFiles, starter, options) {
	const framework = createApp(app);

	if (bootFiles && (bootFiles.length > 0)) {
		let obj;
		for (const bootFile of bootFiles) {
			if (typeof bootFile !== 'function')
				continue;

			try {
				try {
					await bootFile({
						framework,
						app,
						router,
						options
					});
					continue;
				}
				catch (err) {
					obj = new bootFile();
					await obj.execute(
						framework,
						app,
						router,
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

	GlobalUtility.$navRouter = router;

	let storeWrapper = null;
	try {
		storeWrapper = new storeRequest();
	}
	catch (err) {
		console.log(err);
		throw Error('Invalid store wrapper.');
	}

	let storeInitialized = null;
	try {
		storeInitialized = await storeWrapper.initialize();
	}
	catch (err) {
		console.log(err);
		throw Error('Invalid store.');
	}

	if (!starter) {
		framework.use(storeInitialized).use(router).mount('#app');
		return;
	}

	try {
		const result = starter({
			framework,
			app,
			router,
			store: GlobalUtility.$store
		});

		result
			// eslint-disable-next-line
			.then(values => {
				// new Vue(vueApp).$mount('#app');
				framework.use(storeInitialized).use(router).mount('#app');
			})
			.catch(err => {
				// eslint-disable-next-line
				console.error('boot error:', err);
			});
	}
	catch (err) {
		if (err && err.url) {
			window.location.href = err.url;
			return;
		}

		// eslint-disable-next-line
		console.error('boot error:', err);
	}
}

export default start;
