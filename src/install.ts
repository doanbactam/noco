/**
 * Install nococli hook
 */

import fs from 'fs/promises';
import { Logger } from './utils/logger.js';
import { getConfig, toGitPath } from './utils/paths.js';
import { generateHookContent } from './utils/hook.js';
import { getTemplateDir, setTemplateDir } from './utils/git.js';
import type { InstallOptions } from './types.js';

export interface InstallResult {
  success: boolean;
  message: string;
  hookPath?: string;
  needsInit?: boolean;
}

export async function install(options: InstallOptions = {}): Promise<InstallResult> {
  const logger = new Logger(options.silent);
  const config = getConfig();

  try {
    logger.info('Creating git templates directory...');
    await fs.mkdir(config.hooksDir, { recursive: true });

    const hookContent = generateHookContent();
    await fs.writeFile(config.hookFile, hookContent, { mode: 0o755 });
    logger.success(`Hook created at ${config.hookFile}`);

    logger.info('Configuring git templates...');
    const currentTemplate = getTemplateDir();
    const templateDirForGit = toGitPath(config.templateDir);

    if (currentTemplate.exists && currentTemplate.value !== templateDirForGit) {
      logger.warning(`Current template directory: ${currentTemplate.value}`);
      logger.info('To use the new hook, run:');
      logger.blank();
      logger.info(`  git config --global init.templatedir '${templateDirForGit}'`);
      logger.blank();
      return {
        success: true,
        message: 'Hook installed but git config needs update',
        hookPath: config.hookFile,
        needsInit: true,
      };
    }

    if (!currentTemplate.exists) {
      setTemplateDir(config.templateDir);
      logger.success(`Git template directory set to ${templateDirForGit}`);
    } else {
      logger.success('Git template directory already configured');
    }

    return {
      success: true,
      message: 'Successfully installed nococli',
      hookPath: config.hookFile,
      needsInit: false,
    };
  } catch (error) {
    logger.error('Installation failed');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
