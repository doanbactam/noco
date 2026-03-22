/**
 * Install git-no-ai-author hook
 */

import fs from 'fs/promises';
import { Logger } from './utils/logger.js';
import { getConfig, toGitPath } from './utils/paths.js';
import { generateHookContent, getPatternNames } from './utils/hook.js';
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
    logger.start('Creating git templates directory...');
    await fs.mkdir(config.hooksDir, { recursive: true });

    const hookContent = generateHookContent();
    await fs.writeFile(config.hookFile, hookContent, { mode: 0o755 });
    logger.succeed(`Hook created at ${config.hookFile}`);

    logger.start('Configuring git templates...');
    const currentTemplate = getTemplateDir();
    const templateDirForGit = toGitPath(config.templateDir);

    if (currentTemplate.exists && currentTemplate.value !== templateDirForGit) {
      logger.warning(`Current template directory: ${currentTemplate.value}`);
      logger.info(`To use the new hook, run:`);
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
      logger.succeed(`Git template directory set to ${templateDirForGit}`);
    } else {
      logger.succeed(`Git template directory already configured`);
    }

    logger.blank();
    logger.success('✨ Installation complete!');

    return {
      success: true,
      message: 'Successfully installed git-no-ai-author',
      hookPath: config.hookFile,
      needsInit: false,
    };

  } catch (error) {
    logger.fail('Installation failed');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function main(): Promise<void> {
  const logger = new Logger();

  logger.header('🚀 git-no-ai-author');
  logger.blank();

  const result = await install();

  if (result.success) {
    logger.blank();
    logger.info('The following AI signatures will be removed:');
    const patterns = getPatternNames();
    patterns.forEach(p => logger.info(`  • ${p}`));

    logger.blank();
    logger.info('For existing repositories, run:');
    logger.blank();
    logger.info('  cd <your-repo> && git init');
    logger.blank();

    process.exit(0);
  } else {
    logger.blank();
    logger.error('Installation failed. Please try again.');
    process.exit(1);
  }
}
