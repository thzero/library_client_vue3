/*
module.exports = {
	chainWebpack: config => {
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap(options => ({
				...options,
				compilerOptions: {
					// treat any tag that starts with ion- as custom elements
					isCustomElement: tag => tag.startsWith('vue-')
				}
			}))
	},
*/

export default async () => {
	window.customElements.define('vue-fragment', class extends HTMLElement {});
};
