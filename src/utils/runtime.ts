/**
 * Runtime resolution helpers
 */

import { execFileSync } from 'child_process';

function resolveWindowsCommand(command: string): string | null {
  try {
    const output = execFileSync('where.exe', [command], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);

    return output || null;
  } catch {
    return null;
  }
}

export function detectPowerShellRuntime(platform: NodeJS.Platform = process.platform): string | null {
  if (platform !== 'win32') {
    return null;
  }

  return resolveWindowsCommand('pwsh') ?? resolveWindowsCommand('powershell.exe');
}
