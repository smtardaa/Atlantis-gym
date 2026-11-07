import { defineConfig } from 'astro/config';

// Yayın adresi ve alt klasör, ortam değişkenleriyle değiştirilebilir (bkz. TESLIM-NOTLARI.md).
const site = process.env.SITE_URL || 'https://atlantisspormerkezi.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
});
