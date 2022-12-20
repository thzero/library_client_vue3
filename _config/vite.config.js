// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

import fs from 'fs';
import path from 'path';

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

console.log(`\tOpenSource...`);

let file;
const items = [];
let data;
for (const item of dirs) {
  try {
    file = path.join(dir, item, 'openSource.js');
    console.log(`\t${file}...`);
    if (!fs.existsSync(file)){
      console.log(`\t...not found.`);
      continue;
    }

    data = fs.readFileSync(file, {encoding:'utf8', flag:'r'});
    // items.push(['@thzero', item, 'openSource.js'].join('/'));
    items.push(data.replace('export default', ``));
    console.log(`\t...processed.`);
  }
  catch(err) {
    console.log(`\t...failed.`, err);
  }
}

try {
  let openSourceJs = `export default () => { return [ ${items.join(`, `)} ]; }`;
  fs.writeFileSync(path.join(__dirname, 'src', 'openSource.js'), openSourceJs);
} catch (err) {
  console.log(err);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'local-config': fileURLToPath(new URL(`./src/config/${configEnv}.json`, import.meta.url)),
      'open-source-config': fileURLToPath(new URL(`./src/openSource.js`, import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
