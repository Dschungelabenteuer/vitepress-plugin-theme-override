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
  unnormalizePath,
} from './utils';

/** Looks for an existing override file matching the `id` path and returns it if it exists. */
export function findOverride(overrides: OverrideMap, id: string) {
  const path = id.split(themePath)[1] ?? '';
  const relativePath = removeFileParams(path);
  if (
    !path.includes('type=style') &&
    relativePath &&
    overrides.has(relativePath) &&
    id.includes(themePath)
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
    if (!relativePath || !existsSync(originalPath)) return;

    const originalCode = await readFile(originalPath, 'utf-8');
    const name = relativePath.replace(/[^a-zA-Z ]/g, '_');
    const type = getTypeFromRelativePath(relativePath);
    const load = createLoader(path);
    const override = { originalPath, relativePath, type, load, name, path };
    const replacement = await getOverrideContent(override, originalCode);
    return { ...override, replacement };
  };
