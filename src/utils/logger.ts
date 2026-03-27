/**
 * Minimal CLI logger using ANSI escape codes
 */

const c = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
} as const;

export class Logger {
  private silent: boolean;

  constructor(silent = false) {
    this.silent = silent;
  }

  info(msg: string): void {
    if (this.silent) return;
    console.log(`${c.blue}\u2139${c.reset} ${msg}`);
  }

  success(msg: string): void {
    if (this.silent) return;
    console.log(`${c.green}\u2713${c.reset} ${msg}`);
  }

  warning(msg: string): void {
    if (this.silent) return;
    console.log(`${c.yellow}\u26A0${c.reset} ${msg}`);
  }

  error(msg: string): void {
    if (this.silent) return;
    console.log(`${c.red}\u2717${c.reset} ${msg}`);
  }

  header(msg: string): void {
    if (this.silent) return;
    console.log('');
    console.log(`${c.bold}${c.cyan}${msg}${c.reset}`);
    console.log(`${c.cyan}${'─'.repeat(msg.length)}${c.reset}`);
  }

  blank(): void {
    if (this.silent) return;
    console.log('');
  }

  cyan(msg: string): string {
    return `${c.cyan}${msg}${c.reset}`;
  }

  dim(msg: string): string {
    return `${c.dim}${msg}${c.reset}`;
  }

  bold(msg: string): string {
    return `${c.bold}${msg}${c.reset}`;
  }

  yellowText(msg: string): string {
    return `${c.yellow}${msg}${c.reset}`;
  }
}

export const logger = new Logger();
