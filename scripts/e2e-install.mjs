import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const cliPath = path.join(repoRoot, 'dist', 'cli.js');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nococli-e2e-'));

function toGitPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function createHome(name) {
  const homeDir = path.join(tempRoot, name);
  fs.mkdirSync(homeDir, { recursive: true });
  return {
    HOME: homeDir,
    USERPROFILE: homeDir,
  };
}

function assertSuccess(result, label) {
  assert.equal(
    result.status,
    0,
    `${label} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
}

try {
  assert.ok(fs.existsSync(cliPath), `Missing built CLI at ${cliPath}`);

  {
    const env = createHome('default-home');
    const result = run(process.execPath, [cliPath], { env });
    assertSuccess(result, 'default install');
    assert.match(result.stdout, /Installation complete!/);

    const gitConfig = run('git', ['config', '--global', '--get', 'init.templatedir'], { env });
    assertSuccess(gitConfig, 'read default git config');

    const expectedTemplateDir = toGitPath(path.join(env.HOME, '.git-templates'));
    assert.equal(gitConfig.stdout.trim(), expectedTemplateDir);

    const hookPath = path.join(env.HOME, '.git-templates', 'hooks', 'commit-msg');
    assert.ok(fs.existsSync(hookPath), `Hook not found at ${hookPath}`);

    const repoDir = path.join(tempRoot, 'default-repo');
    fs.mkdirSync(repoDir, { recursive: true });
    const initResult = run('git', ['init'], { cwd: repoDir, env });
    assertSuccess(initResult, 'git init with default template');

    const repoHookPath = path.join(repoDir, '.git', 'hooks', 'commit-msg');
    assert.ok(fs.existsSync(repoHookPath), `Expected hook copied into ${repoHookPath}`);
  }

  {
    const env = createHome('conflict-home');
    const presetTemplate = 'C:/temp/test';

    const presetResult = run('git', ['config', '--global', 'init.templatedir', presetTemplate], { env });
    assertSuccess(presetResult, 'preset conflicting template dir');

    const result = run(process.execPath, [cliPath, 'install'], { env });
    assertSuccess(result, 'install with conflicting template dir');
    assert.match(result.stdout, /git is still using another template directory/i);

    const gitConfig = run('git', ['config', '--global', '--get', 'init.templatedir'], { env });
    assertSuccess(gitConfig, 'read conflicting git config');
    assert.equal(gitConfig.stdout.trim(), presetTemplate);

    const hookPath = path.join(env.HOME, '.git-templates', 'hooks', 'commit-msg');
    assert.ok(fs.existsSync(hookPath), `Conflict case did not create hook at ${hookPath}`);
  }

  console.log('E2E install checks passed.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
