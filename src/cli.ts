/**
 * CLI interface for nococli
 * Remove AI co-author signatures from git commits
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createInterface } from 'readline/promises';
import { Command } from 'commander';
import { install } from './install.js';
import { uninstall } from './uninstall.js';
import { getPatternNames } from './utils/hook.js';
import {
  getTemplateDir,
  getGitUserName,
  getGitUserEmail,
  setGitUserName,
  setGitUserEmail,
} from './utils/git.js';
import { getConfig } from './utils/paths.js';
import { Logger } from './utils/logger.js';
import { isAIAuthor } from './types.js';
import { access } from 'fs/promises';

const logger = new Logger();

// Read version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
let version = '0.0.0';
try {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
  version = pkg.version;
} catch {
  // Fallback for bundled output
}

const program = new Command();

async function promptText(message: string, initial = ''): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${message}${initial ? ` (${initial})` : ''}: `);
  rl.close();
  return answer.trim() || initial;
}

async function promptConfirm(message: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${message} (y/N): `);
  rl.close();
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

async function runInstallCommand(options: { force?: boolean; silent?: boolean }): Promise<void> {
  // Check if current git author is an AI
  const currentName = getGitUserName();

  if (currentName.exists && currentName.value && isAIAuthor(currentName.value)) {
    logger.header('AI Author Detected');
    logger.blank();
    logger.warning(`Current git author: ${logger.yellowText(currentName.value)}`);
    logger.info('This looks like an AI-generated name. Would you like to change it?');
    logger.blank();

    const name = await promptText('Your name');
    const email = await promptText('Your email');

    if (name && email) {
      setGitUserName(name);
      setGitUserEmail(email);
      logger.blank();
      logger.success(`Git author updated to: ${logger.cyan(name)} <${logger.cyan(email)}>`);
      logger.blank();
    } else {
      logger.blank();
      logger.info('Skipped author update. You can change it later with:');
      logger.info(`  ${logger.dim('git config --global user.name "Your Name"')}`);
      logger.info(`  ${logger.dim('git config --global user.email "your@email.com"')}`);
      logger.blank();
    }
  }

  // Check current config
  const current = getTemplateDir();
  if (current.exists && current.value) {
    logger.info(`Current template: ${logger.cyan(current.value)}`);
  } else {
    logger.info('No existing template directory found');
  }

  // Install
  const result = await install({ silent: options.silent });

  if (!result.success) {
    logger.blank();
    logger.error(result.message);
    process.exit(1);
  }

  logger.blank();

  if (result.needsInit) {
    logger.warning('Hook installed, but git is still using another template directory.');
    logger.info('Update your global git config, then re-run `git init` in existing repos.');
  } else {
    logger.success('Installation complete!');
  }

  logger.blank();
  logger.info('AI signatures that will be removed:');
  getPatternNames().forEach((p) => logger.info(`  ${logger.dim('\u2022')} ${p}`));
  logger.blank();
  logger.info(logger.dim('For existing repos, run: cd <repo> && git init'));
}

program
  .name('nococli')
  .description('Remove AI co-author signatures from git commits')
  .version(version);

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
      const confirmed = await promptConfirm('Uninstall noco?');
      if (!confirmed) {
        logger.info('Uninstall cancelled');
        process.exit(0);
      }
    }

    const result = await uninstall({ silent: options.silent });
    if (result.success) {
      logger.blank();
      logger.success('Uninstallation complete!');
    } else {
      logger.blank();
      logger.error(result.message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Check if noco is properly installed and configured')
  .action(async () => {
    logger.header('noco Status');

    const current = getTemplateDir();
    if (current.exists && current.value) {
      logger.success(`Installed at ${current.value}`);
    } else {
      logger.warning('Not installed');
    }

    const config = getConfig();
    try {
      await access(config.hookFile);
      logger.success('Hook file exists');
    } catch {
      logger.warning('Hook file not found');
    }

    logger.blank();
    logger.info(logger.bold('Supported AI signatures:'));
    getPatternNames().forEach((p) => logger.info(`  ${logger.dim('\u2022')} ${p}`));
  });

// List patterns command
program
  .command('patterns')
  .description('List all AI co-author signature patterns that will be removed')
  .action(() => {
    logger.header('AI Signature Patterns');
    logger.blank();

    const patterns = getPatternNames();
    patterns.forEach((p) => logger.success(p));

    logger.blank();
    logger.info(`${patterns.length} pattern groups will be removed from commits`);
  });

// Setup author command
program
  .command('setup-author')
  .description('Change git author if current author is an AI')
  .action(async () => {
    const currentName = getGitUserName();
    const currentEmail = getGitUserEmail();

    logger.header('Git Author Setup');
    logger.blank();

    if (currentName.exists && currentName.value) {
      if (isAIAuthor(currentName.value)) {
        logger.warning(
          `Current author: ${logger.yellowText(currentName.value)} ${logger.dim('(AI detected)')}`,
        );
      } else {
        logger.info(`Current author: ${logger.cyan(currentName.value)}`);
      }
      if (currentEmail.exists && currentEmail.value) {
        logger.info(`Current email:  ${logger.cyan(currentEmail.value)}`);
      }
      logger.blank();
    }

    const nameInit =
      currentName.exists && currentName.value && !isAIAuthor(currentName.value)
        ? currentName.value
        : '';
    const emailInit = currentEmail.exists && currentEmail.value ? currentEmail.value : '';

    const name = await promptText('Your name', nameInit);
    const email = await promptText('Your email', emailInit);

    if (name && email) {
      setGitUserName(name);
      setGitUserEmail(email);
      logger.blank();
      logger.success(`Git author updated to: ${logger.cyan(name)} <${logger.cyan(email)}>`);
      logger.blank();
    } else {
      logger.blank();
      logger.info('Cancelled.');
    }
  });

// Parse arguments
if (process.argv.length <= 2) {
  await runInstallCommand({});
} else {
  program.parse();
}
