import type { OverrideData, OverrideMap } from './types';
import { findOverride, readOverride } from './overrides';
import { mergeSFCs } from './sfc';

/** Returns a dumb component including the actual override. This lets us benefit from HMR. */
async function transformComponent(override: OverrideData, code: string) {
  return await mergeSFCs(override, code);
}

/** Transforms any other file (it basically replaces the whole file). */
async function transformFile(override: OverrideData) {
  return override.path.endsWith('.ts')
    ? `export * from '${override.path}'`
    : await readOverride(override);
}

/** Overrides a file. */
export async function getOverrideContent(override: OverrideData, code: string) {
  switch (override.type) {
    case 'component':
      return await transformComponent(override, code);
    case 'composable':
    default:
      return await transformFile(override);
  }
}

/**
 * Transforms files if they come from Vitepress' theme.
 * @param overrides Map of all overriding files.
 * @param id Path of the file being processed.
 */
export async function transformIfNeeded(overrides: OverrideMap, id: string) {
  // At this point, we're only looking for Vitepress theme's source files.
  const override = findOverride(overrides, id);
  if (!override) return;
  if (id.includes('&type')) return;
  // Merge and serve overriden content.
  return override.replacement;
}
