/**
 * Path utilities for cross-platform compatibility
 */

import path from 'path';
import os from 'os';
import { Config } from '../types.js';

export function getHomeDir(): string {
  return os.homedir();
}

export function getConfig(): Config {
  const homeDir = getHomeDir();
  const templateDir = path.join(homeDir, '.git-templates');
  const hooksDir = path.join(templateDir, 'hooks');
  const hookFile = path.join(hooksDir, 'commit-msg');

  return {
    templateDir,
    hooksDir,
    hookFile,
  };
}

/**
 * Convert Windows path to Git-compatible path (forward slashes)
 */
export function toGitPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Check if a path exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

import fs from 'fs/promises';
