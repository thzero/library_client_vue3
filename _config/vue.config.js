
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

const dir = path.join(__dirname, 'node_modules', '@thzero');
const dirs = fs.readdirSync(dir);

console.log('\tOpenSource...');

let file;
const items = [];
let data;
for (const item of dirs) {
  try {
    file = path.join(dir, item, 'openSource.js');
    console.log(`\t${file}...`);
    if (!fs.existsSync(file)) {
      console.log('\t...not found.');
      continue;
    }

    data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    // items.push(['@thzero', item, 'openSource.js'].join('/'));
    items.push(data.replace('export default', ''));
    console.log('\t...processed.');
  }
  catch (err) {
    console.log('\t...failed.', err);
  }
}

try {
  const openSourceJs = `/* eslint-disable */\n/* GENERATED FILE - DO NOT EDIT */\nexport default () => { return [ ${items.join(`, `)} ]; }`;
  fs.writeFileSync(path.join(__dirname, 'src', 'openSource.js'), openSourceJs);
} catch (err) {
  console.log(err);
}

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
				'local-config': path.join(__dirname, `./src/config/${configEnv}.json`),
				'open-source-config': path.join(__dirname, './src/openSource.js')
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
