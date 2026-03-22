/**
 * CLI interface for git-no-ai-author
 * Remove AI co-author signatures from git commits
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { install } from './install.js';
import { uninstall } from './uninstall.js';
import { getPatternNames } from './utils/hook.js';
import { getTemplateDir } from './utils/git.js';
import { getConfig } from './utils/paths.js';
import { Logger } from './utils/logger.js';
import { Listr } from 'listr2';
import prompts from 'prompts';

const logger = new Logger();

// Create CLI program
const program = new Command();

async function runInstallCommand(): Promise<void> {
  let installResult: Awaited<ReturnType<typeof install>> | null = null;

  const tasks = new Listr([
    {
      title: 'Checking current git configuration',
      task: async () => {
        const current = getTemplateDir();
        if (current.exists && current.value) {
          return `Current template: ${chalk.cyan(current.value)}`;
        }
        return 'No existing template directory found';
      },
    },
    {
      title: 'Installing hook',
      task: async () => {
        installResult = await install({ silent: true });
        if (!installResult.success) {
          throw new Error(installResult.message);
        }

        if (installResult.needsInit) {
          return 'Hook created, but git template directory still points elsewhere';
        }
      },
    },
  ], {
    rendererOptions: {
      collapse: false,
      showSubtasks: false,
    },
  });

  try {
    await tasks.run();
    logger.blank();

    if (installResult?.needsInit) {
      logger.warning('Hook installed, but git is still using another template directory.');
      logger.info('Update your global git config, then re-run `git init` in existing repos.');
    } else {
      logger.success('✨ Installation complete!');
    }

    logger.blank();
    logger.info('AI signatures that will be removed:');
    getPatternNames().forEach(p => logger.info(`  ${chalk.dim('•')} ${p}`));
    logger.blank();
    logger.info(chalk.dim('For existing repos, run: cd <repo> && git init'));
  } catch (error) {
    logger.blank();
    logger.error(error instanceof Error ? error.message : 'Installation failed');
    process.exit(1);
  }
}

program
  .name('nococli')
  .description('Remove AI co-author signatures from git commits')
  .version('1.0.2');

// Install command
program
  .command('install')
  .description('Install noco hook globally for all new git repositories')
  .option('-f, --force', 'Overwrite existing hook without prompting')
  .option('-s, --silent', 'Silent mode - no output')
  .action(runInstallCommand);

// Uninstall command
program
  .command('uninstall')
  .description('Remove noco hook from your system')
  .option('-c, --remove-config', 'Also remove git template directory config')
  .option('-s, --silent', 'Silent mode - no output')
  .action(async (options) => {
    if (!options.silent) {
      const response = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: 'Uninstall noco?',
        initial: false,
      });

      if (!response.confirm) {
        logger.info('Uninstall cancelled');
        process.exit(0);
      }
    }

    const tasks = new Listr([
      {
        title: 'Removing hook file',
        task: async () => {
          const result = await uninstall({ silent: true });
          if (!result.success) {
            throw new Error(result.message);
          }
        },
      },
    ]);

    try {
      await tasks.run();
      logger.blank();
      logger.success('✨ Uninstallation complete!');
    } catch (error) {
      logger.blank();
      logger.error(error instanceof Error ? error.message : 'Uninstallation failed');
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check if noco is properly installed and configured')
  .action(async () => {
    logger.header('📊 noco Status');

    const tasks = new Listr([
      {
        title: 'Checking installation status',
        task: async () => {
          const current = getTemplateDir();
          if (current.exists && current.value) {
            return chalk.green(`✓ Installed at ${current.value}`);
          }
          return chalk.yellow('✗ Not installed');
        },
      },
      {
        title: 'Checking hook file',
        task: async () => {
          const fs = await import('fs/promises');
          const config = getConfig();

          try {
            await fs.access(config.hookFile);
            return chalk.green('✓ Hook file exists');
          } catch {
            return chalk.yellow('✗ Hook file not found');
          }
        },
      },
    ]);

    await tasks.run();

    logger.blank();
    logger.info(chalk.bold('Supported AI signatures:'));
    getPatternNames().forEach(p => logger.info(`  ${chalk.dim('•')} ${p}`));
  });

// List patterns command
program
  .command('patterns')
  .description('List all AI co-author signature patterns that will be removed')
  .action(() => {
    logger.header('🎯 AI Signature Patterns');
    logger.blank();

    const patterns = getPatternNames();
    const table = patterns.map(p => [chalk.cyan('✓'), p]);
    logger.table(['Status', 'Pattern'], table);

    logger.info(`${patterns.length} patterns will be removed from commits`);
  });

// Parse arguments
if (process.argv.length <= 2) {
  await runInstallCommand();
} else {
  program.parse();
}
