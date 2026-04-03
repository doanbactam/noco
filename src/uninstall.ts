/**
 * Uninstall nococli hook
 */

import fs from 'fs/promises';
import { Logger } from './utils/logger.js';
import { getConfig, pathExists } from './utils/paths.js';
import { unsetGitConfig } from './utils/git.js';
import type { UninstallOptions } from './types.js';
import type { HookMode } from './types.js';

export interface UninstallResult {
  success: boolean;
  message: string;
  removedConfig?: boolean;
  hookMode?: HookMode;
}

export async function uninstall(options: UninstallOptions = {}): Promise<UninstallResult> {
  const logger = new Logger(options.silent);
  const config = getConfig();
  let removedConfig = false;
  let removedPowerShellHook = false;

  try {
    logger.info('Removing hook file...');
    try {
      await fs.unlink(config.hookFile);
      logger.success(`Removed ${config.hookFile}`);
    } catch {
      logger.info('Hook file not found (already removed?)');
    }

    try {
      await fs.unlink(config.powerShellHookFile);
      removedPowerShellHook = true;
      logger.success(`Removed ${config.powerShellHookFile}`);
    } catch {
      logger.info('PowerShell hook file not found (already removed?)');
    }

    // Restore backups if they exist
    for (const hookPath of [config.hookFile, config.powerShellHookFile]) {
      const backupPath = `${hookPath}.bak`;
      if (await pathExists(backupPath)) {
        await fs.rename(backupPath, hookPath);
        logger.success(`Restored previous hook from ${backupPath}`);
      }
    }

    try {
      const hooksExists = await fs
        .access(config.hooksDir)
        .then(() => true)
        .catch(() => false);
      if (hooksExists) {
        const files = await fs.readdir(config.hooksDir);
        if (files.length === 0) {
          await fs.rmdir(config.hooksDir);
          logger.info('Removed empty hooks directory');
        }
      }

      const templateExists = await fs
        .access(config.templateDir)
        .then(() => true)
        .catch(() => false);
      if (templateExists) {
        const files = await fs.readdir(config.templateDir);
        if (files.length === 0) {
          await fs.rmdir(config.templateDir);
          logger.info('Removed empty templates directory');
        }
      }
    } catch {
      // Ignore directory cleanup errors
    }

    if (options.removeConfig) {
      logger.info('Removing git configuration...');
      unsetGitConfig('init.templatedir');
      removedConfig = true;
      logger.success('Git template directory configuration removed');
    }

    if (!options.removeConfig) {
      logger.blank();
      logger.info('To remove git template directory config, run:');
      logger.blank();
      logger.info('  git config --global --unset init.templatedir');
      logger.blank();
    }

    return {
      success: true,
      message: 'Successfully uninstalled nococli',
      removedConfig,
      hookMode: removedPowerShellHook ? 'powershell' : 'node',
    };
  } catch (error) {
    logger.error('Uninstallation failed');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
