import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({base:'./',build:{rollupOptions:{input:{main:resolve(import.meta.dirname,'index.html'),support:resolve(import.meta.dirname,'support.html'),privacy:resolve(import.meta.dirname,'privacy.html'),privacyEN:resolve(import.meta.dirname,'en/privacy.html'),supportEN:resolve(import.meta.dirname,'en/support.html')}}}});
