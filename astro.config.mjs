import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
      configFile: './tailwind.config.mjs',
    }),
    react(),
    mdx()
  ],
  output: 'static',
  trailingSlash: 'never', // Prevent 301 redirects from trailing slash inconsistency
  build: {
    inlineStylesheets: 'auto'
  }
});
