import { readFile } from 'fs/promises';
import { relative, resolve, sep } from 'path';
import { normalizePath } from 'vite';

import type { OverrideType } from './types';
import { logKey, themePath } from './config';

export const NEW_LINE = '\n';

/** Creates a function which reads a file from filesystem. */
export const createLoader = (path: string) => async () => await readFile(path, 'utf-8');

/** Returns parent path from a given path. */
export const parentPath = (path: string) => path?.split(sep).slice(0, -1).join(sep);

/** Returns filename from path. */
export const getRelativePath = (basePath: string, path: string) =>
  normalizePath(transformToJs(relative(basePath, path)));

/** Transforms any script file path to js extension. */
export const transformToJs = (name: string) => name.replace(/(.*)\.[cm]?[jt]s(x?)$/, '$1.js$2');

/** Transforms a path according to active OS's filesystem. */
export const unnormalizePath = (path: string) => path.replaceAll('/', sep);

/** Removes any query parameter from a file path. */
export const removeFileParams = (path: string) => path.split('?')[0];

/** Removes relative characters. */
export const removeRelativePathChars = (path: string) => path.split('./').pop() ?? path;


/** Determines override type from filename. */
export const getTypeFromRelativePath = (fullName: string): OverrideType => {
  const [, extension] = fullName.split('.');
  switch (extension) {
    case undefined:
      return 'folder';
    case 'vue':
      return 'component';
    case 'ts':
      return 'composable';
    default:
      return 'file';
  }
};

/** Returns Vitepress' base path by looking for its beforehand injected alias. */
export const getVitepressPath = async () => {
  const missingVitepressMsg = `${logKey} Could not find path to Vitepress, is it installed?`;

  const vitepressPath = import.meta.resolve('vitepress')?.replace('file:///', '');
  if (!vitepressPath) throw new Error(missingVitepressMsg);

  const path = unnormalizePath(vitepressPath);
  if (!path) throw new Error(missingVitepressMsg);
  return parentPath(path);
};

export const getDefaultThemePath = async () => {
  const vitepressPath = await getVitepressPath();
  return resolve(vitepressPath, themePath);
};

export { normalizePath };
