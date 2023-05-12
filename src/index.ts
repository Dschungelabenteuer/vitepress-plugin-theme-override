import type { ModuleNode, Plugin } from 'vite';
import { mergeConfig } from 'vite';

import type { OverrideMap, PluginOptions, SplitModules } from './types';
import { transformIfNeeded } from './transform';
import { registerOverrides, registerOverridesFromPaths } from './overrides';
import { getDefaultThemePath, getRelativePath } from './utils';

export default function VitepressThemeOverride({
  overridePath,
  defaultThemeAlias,
}: PluginOptions): Plugin {
  /** Map of all overriding files. */
  const overrides: OverrideMap = new Map();

  return {
    name: 'vitepress-plugin-theme-override',
    enforce: 'pre',

    async handleHotUpdate({ file, server }) {
      const splitModules = { direct: [], delayed: [] } as SplitModules;
      const relativePath = getRelativePath(overridePath, file);
      const override = overrides.get(relativePath);

      if (!override) return;

      const modules = server.moduleGraph.getModulesByFile(override.originalPath)?.values();
      if (!modules) return;

      const refreshModule = async (module: ModuleNode) => {
        await registerOverridesFromPaths(overrides, [override.path], overridePath);
        await server.reloadModule(module);
      };

      const { direct, delayed } = Array.from(modules).reduce((output, module) => {
        const key = module.id?.includes('type=style') ? 'delayed' : 'direct';
        output[key].push(async () => refreshModule(module));
        return output;
      }, splitModules);

      await Promise.all(direct.map((r) => r()));

      if (delayed.length) {
        await new Promise((r) => setTimeout(r, 15));
        await Promise.all(delayed.map((r) => r()));
      }
    },

    async config(config) {
      const find = defaultThemeAlias ?? '@vptheme';
      const replacement = await getDefaultThemePath();

      // Register list of available overrides.
      await registerOverrides(overrides, overridePath);

      // Add default theme alias to Vite's final config.
      return mergeConfig(config, {
        resolve: {
          alias: [{ find, replacement }],
        },
      });
    },

    async transform(_, id) {
      return await transformIfNeeded(overrides, id);
    },
  };
}
