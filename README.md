# vitepress-plugin-theme-override

Vitepress makes it easy to setup documentation for whatever library you're working on. Its default
theme is pretty clean and provides both great DX and UX out-of-the-box, along with basic
customization capabilities through slots and CSS Custom Properties. While the default theme probably
is enough to most people, some users might want to push customization further _e.g._ to get an even
more impactful homepage.

This plugin allows users to override specific parts of Vitepress' default theme, without the need of
forking the whole theme into their own repository. Just provide the path to your overrides'
dedicated folder and get its structure aligned with the
[default theme's one](https://github.com/vuejs/vitepress/tree/main/src/client/theme-default).

## Getting started

### Install

```bash
# Using npm
npm i -D vite vitepress vitepress-plugin-theme-override
# Using Yarn
yarn add -D vite vitepress vitepress-plugin-theme-override
# Using pnpm
pnpm add -D vite vitepress vitepress-plugin-theme-override
```

### Usage

Setup the plugin in Vitepress' Vite configuration file (you might have to create it).

```ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import VitepressThemeOverride from 'vitepress-plugin-theme-override';

export default defineConfig(() => ({
  plugins: [
    VitepressThemeOverride({
      overridePath: resolve(__dirname, './.vitepress/theme/overrides'),
    }),
  ],
}));
```

### Options

#### `overridePath: string`

> Path to the folder where your overrides are located.

This folder must mimic
[the default theme's one](https://github.com/vuejs/vitepress/tree/main/src/client/theme-default).

#### `defaultThemeAlias?: string` (optional, defaults to `"@vptheme"`)

> Alias used to resolve to Vitepress's default theme.

You might still want to import original files from overrides. Because overrides are located in a
dedicated folder, using relative paths to import original files would be a real pain. The path to
Vitepress' default theme is therefore aliased and automatically added into Vite's final config.
However, it still requires that you manually add the path alias to your `tsconfig.json`, e.g.:

```json
"paths": {
  "@myAlias/*": ["./node_modules/vitepress/dist/client/theme-default/*"]
}
```

## Two types of overrides

### Components

Each layer of Vitepress' Vue Single File Components can be specifically overriden. Whenever Vite
requests a file which comes from Vitepress' theme and has a matching override, it parses both files
to extract all layers data to merge them. This means that for a given component, you might just
overwrite the `style` layer, or both the `style` and `template` layers, or any other set of layers
you want while still relying on _default_ layers of that component.

```
| Source                   | Override               | Output                  |
|--------------------------|------------------------|-------------------------|
| <!-- SourceScript -->    |                        | <!-- SourceScript -->   |
| <!-- SourceTemplate -->  |                        | <!-- SourceTemplate --> |
| <!-- SourceStyle -->     | <!-- OverrideStyle --> | <!-- OverrideStyle -->  |

```

### Other files

Any other file will simply serve the overriden version, this includes _e.g._ composables and other
utilities.
