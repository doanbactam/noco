import { afterEach, describe, expect, test } from 'bun:test';
import { getConfig, getHomeDir, toGitPath } from './paths';

const originalHome = process.env.HOME;
const originalUserProfile = process.env.USERPROFILE;

afterEach(() => {
  if (originalHome === undefined) {
    delete process.env.HOME;
  } else {
    process.env.HOME = originalHome;
  }

  if (originalUserProfile === undefined) {
    delete process.env.USERPROFILE;
  } else {
    process.env.USERPROFILE = originalUserProfile;
  }
});

describe('Path Utilities', () => {
  test('prefers HOME when available', () => {
    process.env.HOME = '/tmp/noco-home';
    process.env.USERPROFILE = 'C:\\Users\\Ignored';

    expect(getHomeDir()).toBe('/tmp/noco-home');
  });

  test('falls back to USERPROFILE when HOME is missing', () => {
    delete process.env.HOME;
    process.env.USERPROFILE = 'C:\\Users\\PowerShell';

    expect(getHomeDir()).toBe('C:\\Users\\PowerShell');
  });

  test('builds config paths from the resolved home directory', () => {
    const home = '/tmp/noco-home';
    process.env.HOME = home;

    const config = getConfig();
    expect(toGitPath(config.templateDir)).toBe('/tmp/noco-home/.git-templates');
    expect(toGitPath(config.hookFile)).toBe('/tmp/noco-home/.git-templates/hooks/commit-msg');
    expect(toGitPath(config.powerShellHookFile)).toBe(
      '/tmp/noco-home/.git-templates/hooks/commit-msg.ps1',
    );
  });

  test('converts Windows paths to git-friendly slashes', () => {
    expect(toGitPath('C:\\Users\\Test User\\.git-templates')).toBe(
      'C:/Users/Test User/.git-templates',
    );
  });
});
