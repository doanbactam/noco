/**
 * Git utilities
 */

import { execFileSync } from 'child_process';
import { toGitPath } from './paths.js';

export interface GitConfigResult {
  exists: boolean;
  value: string | null;
}

/**
 * Get a global git config value
 */
export function getGitConfig(key: string): GitConfigResult {
  try {
    const value = execFileSync('git', ['config', '--global', key], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    return { exists: true, value };
  } catch (error) {
    return { exists: false, value: null };
  }
}

/**
 * Set a global git config value
 */
export function setGitConfig(key: string, value: string): void {
  execFileSync('git', ['config', '--global', key, value], {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

/**
 * Unset a global git config value
 */
export function unsetGitConfig(key: string): void {
  try {
    execFileSync('git', ['config', '--global', '--unset', key], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch {
    // Config doesn't exist, ignore
  }
}

/**
 * Get the current git template directory
 */
export function getTemplateDir(): GitConfigResult {
  return getGitConfig('init.templatedir');
}

/**
 * Set the git template directory
 */
export function setTemplateDir(templatePath: string): void {
  const gitPath = toGitPath(templatePath);
  setGitConfig('init.templatedir', gitPath);
}
