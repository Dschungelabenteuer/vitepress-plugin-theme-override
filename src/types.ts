import type { SFCDescriptor } from '@vue/compiler-sfc';

export type PluginOptions = {
  /** Path to overrides folder. */
  overridePath: string;
  /** Alias name to resolve Vitepress theme. */
  defaultThemeAlias?: string;
};

export type OverrideMap = Map<string, OverrideData>;

export type OverrideType = 'component' | 'composable' | 'file' | 'folder';

export type OverrideData = {
  type: OverrideType;
  name: string;
  path: string;
  originalPath: string;
  relativePath: string;
  replacement?: string;
  output?: string;
  load: () => Promise<string>;
};

export type Layers = Pick<
  SFCDescriptor,
  'scriptSetup' | 'script' | 'template' | 'styles' | 'customBlocks'
>;

export type MergedLayers = {
  [Key in keyof Layers]: SFCDescriptor[Key] extends any[] ? string[] : string | null;
};

export type ScriptBlock = SFCDescriptor['scriptSetup'] | SFCDescriptor['script'];

export type RefreshModuleFn = () => Promise<any>;

export type SplitModules = {
  direct: RefreshModuleFn[];
  delayed: RefreshModuleFn[];
};
