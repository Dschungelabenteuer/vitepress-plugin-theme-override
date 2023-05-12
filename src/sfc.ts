import type { SFCDescriptor as SFC } from '@vue/compiler-sfc';
import { parse } from '@vue/compiler-sfc';

import type { OverrideData } from './types';
import { readOverride } from './overrides';
import {
  formatCustomBlocks,
  formatScript,
  formatSFC,
  formatStyles,
  formatTemplate,
} from './format';

function mergeScriptSetup(override: SFC['scriptSetup'], source: SFC['scriptSetup']) {
  return formatScript(override ?? source);
}

function mergeScript(override: SFC['script'], source: SFC['script']) {
  return formatScript(override ?? source);
}

function mergeTemplate(override: SFC['template'], source: SFC['template']) {
  return formatTemplate(override ?? source);
}

function mergeStyles(override: SFC['styles'], source: SFC['styles']) {
  return formatStyles(override.length ? override : source);
}

function mergeCustomBlocks(override: SFC['customBlocks'], source: SFC['customBlocks']) {
  return formatCustomBlocks(override.length ? override : source);
}

/**
 * Merges the override layers with the source ones, so that it still picks the source
 * layers users are not clearly redefining within their override files.
 * @param overrideContent Content string of the override file.
 * @param sourceContent Content string of the source file being overriden.
 */
export async function mergeSFCs(
  overrideData: OverrideData,
  sourceContent: string,
): Promise<string> {
  const overrideContent = await readOverride(overrideData);
  const { descriptor: override } = parse(overrideContent);
  const { descriptor: source } = parse(sourceContent);

  const scriptSetup = mergeScriptSetup(override.scriptSetup, source.scriptSetup);
  const script = mergeScript(override.script, source.script);
  const template = mergeTemplate(override.template, source.template);
  const styles = mergeStyles(override.styles, source.styles);
  const customBlocks = mergeCustomBlocks(override.customBlocks, source.customBlocks);

  return formatSFC({
    scriptSetup,
    script,
    template,
    styles,
    customBlocks,
  });
}
