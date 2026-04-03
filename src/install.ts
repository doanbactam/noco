/**
 * Install nococli hook
 */

import fs from 'fs/promises';
import { Logger } from './utils/logger.js';
import { getConfig, toGitPath } from './utils/paths.js';
import { createHookInstallPlan, isNococliHook, HOOK_BACKUP_EXT } from './utils/hook.js';
import { getTemplateDir, setTemplateDir } from './utils/git.js';
import { detectPowerShellRuntime } from './utils/runtime.js';
import type { InstallOptions } from './types.js';
import type { HookMode } from './types.js';

export interface InstallResult {
  success: boolean;
  message: string;
  hookPath?: string;
  needsInit?: boolean;
  hookMode?: HookMode;
  runtime?: string;
}

export async function install(options: InstallOptions = {}): Promise<InstallResult> {
  const logger = new Logger(options.silent);
  const config = getConfig();
  const platform = options.platform ?? process.platform;

  try {
    logger.info('Creating git templates directory...');
    await fs.mkdir(config.hooksDir, { recursive: true });

    const powerShellRuntime = detectPowerShellRuntime(platform);
    if (platform === 'win32' && !powerShellRuntime) {
      return {
        success: false,
        message:
          'PowerShell runtime not found. Install PowerShell 7+ or ensure powershell.exe is available.',
      };
    }

    const installPlan = createHookInstallPlan({
      config,
      platform,
      powerShellCommand: powerShellRuntime ?? undefined,
    });

    if (!options.force) {
      for (const file of installPlan.files) {
        try {
          const existingContent = await fs.readFile(file.path, 'utf8');
          if (!isNococliHook(existingContent)) {
            const backupPath = `${file.path}${HOOK_BACKUP_EXT}`;
            await fs.copyFile(file.path, backupPath);
            logger.warning(`Existing hook backed up to ${backupPath}`);
          }
        } catch {
          // File does not exist — no backup needed
        }
      }
    }

    for (const file of installPlan.files) {
      await fs.writeFile(file.path, file.content, {
        mode: file.mode,
      });
      logger.success(`Hook file created at ${file.path}`);
    }

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
        hookMode: installPlan.mode,
        runtime: installPlan.runtime,
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
      hookMode: installPlan.mode,
      runtime: installPlan.runtime,
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
