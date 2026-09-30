import fs from 'fs';
import path from 'path';
import { fileURLToPath, URL } from 'node:url'

// Utilities
import { defineConfig } from 'vite'

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

import { manualChunksPlugin } from 'vite-plugin-webpackchunkname'

let configEnv = process.env.NODE_ENV;
console.log('vue.config.NODE_ENV', configEnv);
if (!configEnv)
	configEnv = 'development';
const config = process.env._CONFIG;
console.log('vue.config._CONFIG', config);
if (config) {
	const filename = path.join(__dirname, `./src/config/${configEnv}.json`);
	console.log('vue.config.filename', filename);
	fs.writeFileSync(filename, config);
	const contents = fs.readFileSync(filename, 'utf8');
	console.log('vue.config.file', contents);
}
console.log('vue.config._CONFIG_ENV', configEnv);

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
  const openSourceJs = `/* eslint-disable */\n/* GENERATED FILE - DO NOT EDIT */\nexport function useDependenciesClientBase () { return [ ${items.join(`, `)} ]; }`;
  fs.writeFileSync(path.join(__dirname, 'src', 'openSource.js'), openSourceJs);
} catch (err) {
  console.log(err);
}

// https://vitejs.dev/config/
export default defineConfig({optimizeDeps: {
    force: configEnv === 'development'
  },
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    // manualChunksPlugin(),
  ],
  build: {
    rollupOptions: {
      // output: {
      //   manualChunks: (id) => {
      //     if (id.includes('/src/')) {
      //       return 'app';
      //     }
      //     if (id.includes('/async-mutex')) {
      //       return 'app';
      //     }
      //     if (id.includes('/decimal.js-light')) {
      //       return 'app';
      //     }
      //     if (id.includes('/thenby')) {
      //       return 'app';
      //     }
      //     if (id.includes('/chart.js')) {
      //       return 'app-flight';
      //     }
      //     if (id.includes('/html2canvas')) {
      //       return 'app-flight';
      //     }
      //     if (id.includes('/papaparse')) {
      //       return 'app-flight';
      //     }

      //     // // if (id.includes('client/src/library_vue_vuetify')) {
      //     // //   return 'app';
      //     // //   return 'thzero.vue.vuetify';
      //     // // }
      //     // // if (id.includes('client/src/library_vue')) {
      //     // //   return 'app';
      //     // //   return 'thzero.vue';
      //     // // }
      //     // if (id.includes('/@thzero')) {
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/axios')) {
      //     //   // 28.33 kB
      //     //   // return 'axios';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/form-data')) {
      //     //   // used with axios
      //     //   // 0.08 kB
      //     //   // return 'form-data';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/dayjs')) {
      //     //   // 11.83 kB
      //     //   // return 'dayjs';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/easy-rbac')) {
      //     //   // 3.11 kB
      //     //   // return 'easy-rbac';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/marked')) {
      //     //   // 36.93 kB
      //     //   // return 'marked';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/lodash')) {
      //     //   // 17.67 kB
      //     //   // return 'lodash';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/mitt')) {
      //     //   // 0.32 kB
      //     //   // return 'mitt';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/short-uuid')) {
      //     //   // 9.25 kB
      //     //   // return 'short-uuid';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/any-base')) {
      //     //   // used with short-uuid
      //     //   // 1.65 kB
      //     //   // return 'any-base';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/uuid')) {
      //     //   // 0.88 kB
      //     //   // return 'uuid';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/firebase')) {
      //     //   // 0.68 kB
      //     //   // return 'firebase2';
      //     //   return 'thzero';
      //     // }
      //     // if (id.includes('/idb')) {
      //     //   // 2.99 kB
      //     //   // return 'idb';
      //     //   return 'thzero';
      //     // }

      //     if (id.includes('/mathjs')) {
      //       // 528.96 kB
      //       return 'mathjs';
      //     }
      //     if (id.includes('/@babel/runtime')) {
      //       // return 'babel';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/complex.js')) {
      //       // 9.88 kB
      //       // return 'complex';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/decimal.js')) {
      //       // 32.12 kB
      //       // return 'decimaljs';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/escape-latex')) {
      //       // 0.89 kB
      //       // return 'escape-latex';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/fraction.js')) {
      //       // return 'fraction';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/javascript-natural-sort')) {
      //       // 0.98 kB
      //       // return 'javascript-natural-sort';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/seedrandom')) {
      //       // 7.53 k
      //       // return 'seedrandom';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/tiny-emitter')) {
      //       // 0.67 kB
      //       // return 'tiny-emitter';
      //       return 'mathjs';
      //     }
      //     if (id.includes('/typed-function')) {
      //       // 19.12 kB
      //       // return 'typed-function';
      //       return 'mathjs';
      //     }

      //     // if (id.includes('/convert-units')) {
      //     //   // 5.35 kB
      //     //   // return 'convert-units';
      //     //   return 'tools';
      //     // }

      //     // if (id.includes('/@vue')) {
      //     //   // 176.94 kB
      //     //   // 15.13 kB css
      //     //   // return '@vue';
      //     //   // return 'vue';
      //     //   return 'vue';
      //     // }
      //     // if (id.includes('/@intlify')) {
      //     //   // 29.75 kB
      //     //   // return 'intlify';
      //     //   // return 'vue';
      //     //   return 'vue';
      //     // }
      //     // if (id.includes('/pinia')) {
      //     //   // 6.91 kB
      //     //   // return 'pinia';
      //     //   // return 'vue';
      //     //   return 'vue';
      //     // }
      //     // if (id.includes('/vue')) {
      //     //   // 176.94 kB
      //     //   // 15.13 kB css
      //     //   // return 'vue';
      //     //   return 'vue';
      //     // }

      //     // if (id.includes('/vuetify')) {
      //     //   // 196.51 kB
      //     //   // 363.40 kB css
      //     //   // return 'vuetify';
      //     //   // return 'vuetify';
      //     //   return 'vue';
      //     // }
      //     // if (id.includes('date-fns')) {
      //     //   // 122.38 kB
      //     //   // return 'date-fns';
      //     //   // because its used by the date picker componente
      //     //   // return 'vuetify';
      //     //   return 'vue';
      //     // }

      //     // console.log(id);
      //     // if (id.includes('node_modules')) {
      //     //   return 'vendor';
      //     // }
      //   }
      // },
    },
  },
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
    port: 5000,
  },
})
