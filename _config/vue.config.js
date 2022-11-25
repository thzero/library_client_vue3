
const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let configEnv = process.env.NODE_ENV;
console.log('vue.config.NODE_ENV', configEnv);
const config = process.env._CONFIG;
console.log('vue.config._CONFIG', config);
if (config) {
	const filename = path.join(__dirname, `./src/config/${configEnv}.json`);
	console.log('vue.config.filename', filename);
	fs.writeFileSync(filename, config);
	const contents = fs.readFileSync(filename, 'utf8');
	console.log('vue.config.file', contents);
}
else
	configEnv = 'development';
console.log('vue.config.NODE_ENV', configEnv);

module.exports = defineConfig({

    configureWebpack: {
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /locales/,
					loader: '@alienfast/i18next-loader'
					// options here
					// query: { overrides: [ '../node_modules/lib/locales' ] }
				}
			]
		},
		plugins: [
			// new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
			new webpack.ContextReplacementPlugin(
				/highlight\.js\/lib\/languages$/,
				new RegExp(`^./(${['javascript'].join('|')})$`)
			)
		],
		resolve: {
			alias: {
				'local-config': path.join(__dirname, `./src/config/${configEnv}.json`)
			}
		}
	},

	css: {
		extract: { ignoreOrder: true }
	},
  transpileDependencies: [
    'quasar'
  ],

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
});
