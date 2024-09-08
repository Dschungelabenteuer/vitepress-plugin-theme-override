import { readFile } from 'fs/promises';
import { globSync } from 'glob';
import { resolve } from 'path';
import { existsSync } from 'fs';

import type { OverrideData, OverrideMap } from './types';
import { getOverrideContent } from './transform';
import { themePath } from './config';
import {
  createLoader,
  getDefaultThemePath,
  getRelativePath,
  getTypeFromRelativePath,
  normalizePath,
  removeFileParams,
  removeRelativePathChars,
  unnormalizePath,
} from './utils';

/** Looks for an existing override file matching the `id` path and returns it if it exists. */
export function findOverride(overrides: OverrideMap, id: string) {
  const baseThemePath = removeRelativePathChars(themePath);
  const path = id.split(baseThemePath)[1] ?? '';
  const relativePath = removeFileParams(path);

  if (
    !path.includes('type=style') &&
    relativePath &&
    overrides.has(relativePath) &&
    id.includes(baseThemePath)
  ) {
    return overrides.get(relativePath);
  }
}

/** Read the content of an override. */
export async function readOverride(data: OverrideData) {
  return await readFile(unnormalizePath(data.path), 'utf-8');
}

/** Registers overrides. */
export async function registerOverrides(overrides: OverrideMap, overridePath: string) {
  /** Normalized override path. */
  const normalizedOverridePath = normalizePath(overridePath);
  /** Glob pattern to overrides. */
  const overridesGlob = `${normalizedOverridePath}/**/*.*`;
  /** Overrides paths. */
  const overridesPaths = globSync(overridesGlob);

  await registerOverridesFromPaths(overrides, overridesPaths, overridePath);
}

/** Registers a single override. */
export async function registerOverridesFromPaths(
  overrides: OverrideMap,
  paths: string[],
  overridePath: string,
) {
  const overridePromises = paths
    .map(getOverride(overridePath))
    .filter(Boolean) as Promise<OverrideData>[];

  for await (const override of overridePromises) {
    if (override) overrides.set(override.relativePath, override);
  }
}

/** Get an override if available. */
export const getOverride =
  (overridePath: string) =>
  async (srcPath: string): Promise<OverrideData | void> => {
    const path = normalizePath(srcPath);
    const relativePath = getRelativePath(overridePath, path);
    const defaultThemePath = await getDefaultThemePath();
    const originalPath = normalizePath(resolve(defaultThemePath, `./${relativePath}`));
    if (!relativePath) return;
    if (!existsSync(originalPath)) {
      const warn = (str: string) => console.warn(`\x1b[33m ${str} \x1b[0m`);
      warn(`[vitepress-plugin-theme-override] File ${relativePath} does not exist in the default theme.`);
      return;
    }

    const originalCode = await readFile(originalPath, 'utf-8');
    const name = relativePath.replace(/[^a-zA-Z ]/g, '_');
    const type = getTypeFromRelativePath(relativePath);
    const load = createLoader(path);
    const override = { originalPath, relativePath, type, load, name, path };
    const replacement = await getOverrideContent(override, originalCode);
    return { ...override, replacement };
  };
