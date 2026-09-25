// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves this repo at https://nurjaxon202.github.io/-Tutorecon/
// If you connect a custom domain, set SITE_URL to it and BASE_PATH to "/".
const site = process.env.SITE_URL ?? 'https://nurjaxon202.github.io';
const base = process.env.BASE_PATH ?? '/-Tutorecon';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});
