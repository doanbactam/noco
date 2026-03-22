/**
 * Beautiful CLI logger with chalk colors
 */

import chalk from 'chalk';
import ora, { Ora } from 'ora';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export class Logger {
  private spinner: Ora | null = null;
  private silent: boolean;

  constructor(silent: boolean = false) {
    this.silent = silent;
  }

  info(message: string): void {
    if (this.silent) return;
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    if (this.silent) return;
    console.log(chalk.green('✓'), message);
  }

  warning(message: string): void {
    if (this.silent) return;
    console.log(chalk.yellow('⚠'), message);
  }

  error(message: string): void {
    if (this.silent) return;
    console.log(chalk.red('✗'), message);
  }

  debug(message: string): void {
    if (this.silent) return;
    if (process.env.DEBUG) {
      console.log(chalk.gray('›'), chalk.gray(message));
    }
  }

  header(message: string): void {
    if (this.silent) return;
    console.log('');
    console.log(chalk.bold.cyan(message));
    console.log(chalk.cyan('─'.repeat(message.length)));
  }

  blank(): void {
    if (this.silent) return;
    console.log('');
  }

  // Spinner methods
  start(text: string): Ora {
    if (this.silent) {
      this.spinner = ora({ silent: true, text }).start();
    } else {
      this.spinner = ora({ text, color: 'cyan' }).start();
    }
    return this.spinner;
  }

  succeed(text?: string): void {
    this.spinner?.succeed(text);
    this.spinner = null;
  }

  fail(text?: string): void {
    this.spinner?.fail(text);
    this.spinner = null;
  }

  stop(): void {
    this.spinner?.stop();
    this.spinner = null;
  }

  // Box for important messages
  box(title: string, content: string): void {
    if (this.silent) return;
    const lines = content.split('\n');
    const maxLength = Math.max(title.length, ...lines.map(l => l.length));

    console.log('');
    console.log(chalk.cyan('┌' + '─'.repeat(maxLength + 2) + '┐'));
    console.log(chalk.cyan('│') + ' ' + chalk.bold(title) + ' '.repeat(maxLength - title.length + 1) + chalk.cyan('│'));
    console.log(chalk.cyan('├' + '─'.repeat(maxLength + 2) + '┤'));

    for (const line of lines) {
      console.log(chalk.cyan('│') + ' ' + line + ' '.repeat(maxLength - line.length + 1) + chalk.cyan('│'));
    }

    console.log(chalk.cyan('└' + '─'.repeat(maxLength + 2) + '┘'));
    console.log('');
  }

  // Table for structured data
  table(headers: string[], rows: string[][]): void {
    if (this.silent) return;

    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map(r => r[i]?.length || 0))
    );

    const printRow = (row: string[]) => {
      console.log(
        row.map((cell, i) => cell.padEnd(colWidths[i])).join('   ')
      );
    };

    console.log('');
    printRow(headers.map(h => chalk.bold(h)));
    console.log(headers.map((_, i) => '─'.repeat(colWidths[i])).join('   '));

    for (const row of rows) {
      printRow(row);
    }
    console.log('');
  }
}

// Default logger instance
export const logger = new Logger();
