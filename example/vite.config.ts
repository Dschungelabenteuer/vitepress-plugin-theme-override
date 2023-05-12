import { resolve } from 'path';
import { defineConfig } from 'vite';
import VitepressThemeOverride from 'vitepress-plugin-theme-override';

export default defineConfig(() => ({
  plugins: [
    VitepressThemeOverride({
      overridePath: resolve(__dirname, './.vitepress/theme/overrides'),
      defaultThemeAlias: '~theme',
    }),
  ],
}));
