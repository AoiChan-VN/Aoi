import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://aoichan-vn.github.io/Aoi/',
  base: '/Aoi/',
  integrations: [react()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  }
});
