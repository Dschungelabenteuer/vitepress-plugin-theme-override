import type { SFCBlock, SFCDescriptor as SFC } from '@vue/compiler-sfc';
import type { MergedLayers } from './types';
import { NEW_LINE } from './utils';

const EMPTY_ATTRIBUTES = ['setup', 'scoped'];

function formatBlockOpeningTag(block: SFCBlock) {
  const data = [block.type];
  if (block.attrs) {
    Object.entries(block.attrs).forEach(([property, value]) => {
      if (EMPTY_ATTRIBUTES.includes(property)) {
        data.push(`${property}`);
      } else {
        data.push(`${property}=${JSON.stringify(value)}`);
      }
    });
  }

  return `<${data.join(' ')}>`;
}

function formatBlockClosingTag(block: SFCBlock) {
  return `</${block.type}>${NEW_LINE}`;
}

const wrapBlock = (block: SFCBlock) =>
  [
    formatBlockOpeningTag(block), // <layer>
    block.content,
    formatBlockClosingTag(block), // </layer>
  ].join(NEW_LINE);

/** Format multiple blocks. */
const formatBlocks = (blocks: SFCBlock[]) => blocks.map(formatBlock).filter(Boolean) as string[];

/** Format a single block content. */
const formatBlock = (block: SFCBlock | null) => (block ? wrapBlock(block) : null);

/** Returns script block as it would appear in a SFC. */
export const formatScript = (block: SFC['scriptSetup'] | SFC['script']) => formatBlock(block);

/** Returns template block as it would appear in a SFC. */
export const formatTemplate = (block: SFC['template']) => formatBlock(block);

/** Returns style blocks as they would appear in a SFC. */
export const formatStyles = (blocks: SFC['styles']) => formatBlocks(blocks);

/** Returns custom blocks as they would appear in a SFC. */
export const formatCustomBlocks = (blocks: SFC['customBlocks']) => formatBlocks(blocks);

/** Returns a whole SFC's content. */
export function formatSFC(layers: MergedLayers) {
  const output = [];
  if (layers.script) output.push(layers.script);
  if (layers.scriptSetup) output.push(layers.scriptSetup);
  if (layers.template) output.push(layers.template);
  if (layers.styles.length) output.push(layers.styles.join(NEW_LINE));
  if (layers.customBlocks.length) output.push(layers.customBlocks.join(NEW_LINE));
  return output.join(NEW_LINE);
}
