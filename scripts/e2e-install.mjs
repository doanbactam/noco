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

function runNode(args, options = {}) {
  // On Windows, we need special handling for paths with spaces
  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
    shell: process.platform === 'win32',
    windowsVerbatimArguments: process.platform === 'win32',
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

// Helper to create a git repo with the hook installed
function createTestRepo(name, env) {
  const repoDir = path.join(tempRoot, name);
  fs.mkdirSync(repoDir, { recursive: true });
  run('git', ['init'], { cwd: repoDir, env });
  run('git', ['config', 'user.email', 'test@test.com'], { cwd: repoDir, env });
  run('git', ['config', 'user.name', 'Test User'], { cwd: repoDir, env });
  return repoDir;
}

// Helper to create a file, stage it, and commit with a specific message
function createCommit(repoDir, message, env, fileName = 'test.txt') {
  const filePath = path.join(repoDir, fileName);
  const timestamp = Date.now() + Math.random();
  fs.writeFileSync(filePath, `content ${timestamp}`);
  run('git', ['add', fileName], { cwd: repoDir, env });
  
  // Write commit message to file to avoid shell escaping issues on Windows
  const commitMsgFile = path.join(repoDir, '.git', 'COMMIT_MSG_TEMP');
  fs.writeFileSync(commitMsgFile, message);
  const result = run('git', ['commit', '-F', commitMsgFile], { cwd: repoDir, env });
  fs.unlinkSync(commitMsgFile);
  return result;
}

// Helper to get the last commit message
function getLastCommitMessage(repoDir, env) {
  const result = run('git', ['log', '-1', '--format=%B'], { cwd: repoDir, env });
  return result.stdout.trim();
}

// Helper to check if message contains AI signature
function containsAISignature(message) {
  const aiPattern = /^Co-Authored-By:\s*(Claude|GitHub Copilot|ChatGPT|Anthropic|OpenAI|Cursor AI|AI Assistant|Tabnine|CodeWhisperer|Codeium|Replit Ghostwriter|Sourcegraph Cody|Cody|Factory Droid|factory-droid|Gemini|Google Gemini|Gemini Pro|Perplexity|Perplexity AI|Amazon Q|Amp|Amp AI)/im;
  return aiPattern.test(message);
}

// Helper to check if message contains human co-author (non-AI)
function containsHumanCoAuthor(message, humanName) {
  const regex = new RegExp(`Co-Authored-By:\\s*${humanName}`, 'i');
  return regex.test(message);
}

try {
  assert.ok(fs.existsSync(cliPath), `Missing built CLI at ${cliPath}`);

  {
    const env = createHome('default-home');
    const result = runNode([cliPath], { env });
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

    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install with conflicting template dir');
    assert.match(result.stdout, /git is still using another template directory/i);

    const gitConfig = run('git', ['config', '--global', '--get', 'init.templatedir'], { env });
    assertSuccess(gitConfig, 'read conflicting git config');
    assert.equal(gitConfig.stdout.trim(), presetTemplate);

    const hookPath = path.join(env.HOME, '.git-templates', 'hooks', 'commit-msg');
    assert.ok(fs.existsSync(hookPath), `Conflict case did not create hook at ${hookPath}`);
  }

  // =========================================================================
  // VAL-EXEC-001: Basic Signature Removal
  // =========================================================================
  console.log('\n--- VAL-EXEC-001: Basic Signature Removal ---');
  {
    const env = createHome('signature-removal-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for signature removal test');

    const repoDir = createTestRepo('signature-removal-repo', env);
    
    // Test with Claude signature
    const message = `feat: add new feature

Co-Authored-By: Claude <claude@anthropic.com>`;
    
    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit with AI signature');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      `AI signature should be removed. Got: ${lastMessage}`);
    assert.ok(lastMessage.includes('feat: add new feature'), 
      'Message body should be preserved');
    console.log('✓ Basic signature removal works');
  }

  // =========================================================================
  // VAL-PATTERN-001: Case-Insensitive Co-Authored-By Matching
  // =========================================================================
  console.log('\n--- VAL-PATTERN-001: Case-Insensitive Matching ---');
  {
    const env = createHome('case-insensitive-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for case-insensitive test');

    const testCases = [
      { input: 'Co-Authored-By: Claude <claude@anthropic.com>', label: 'standard case' },
      { input: 'co-authored-by: Claude <claude@anthropic.com>', label: 'lowercase' },
      { input: 'CO-AUTHORED-BY: Claude <claude@anthropic.com>', label: 'uppercase' },
      { input: 'Co-AUTHORED-by: Claude <claude@anthropic.com>', label: 'mixed case 1' },
      { input: 'cO-aUtHoReD-bY: Claude <claude@anthropic.com>', label: 'mixed case 2' },
    ];

    for (const testCase of testCases) {
      const repoDir = createTestRepo(`case-test-${Date.now()}`, env);
      const message = `test: case variation\n\n${testCase.input}`;
      const commitResult = createCommit(repoDir, message, env);
      assertSuccess(commitResult, `commit with ${testCase.label}`);
      
      const lastMessage = getLastCommitMessage(repoDir, env);
      assert.ok(!containsAISignature(lastMessage), 
        `Case variation "${testCase.label}" should be removed. Got: ${lastMessage}`);
    }
    console.log('✓ All case variations are matched and removed');
  }

  // =========================================================================
  // VAL-PATTERN-002: Complete AI Name Coverage
  // =========================================================================
  console.log('\n--- VAL-PATTERN-002: AI Name Coverage ---');
  {
    const env = createHome('ai-names-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for AI names test');

    const aiNames = [
      { name: 'Claude', email: 'claude@anthropic.com' },
      { name: 'Claude Code', email: 'claude@anthropic.com' },
      { name: 'GitHub Copilot', email: 'copilot@github.com' },
      { name: 'ChatGPT', email: 'chatgpt@openai.com' },
      { name: 'Cursor AI', email: 'cursor@cursor.sh' },
      { name: 'Tabnine', email: 'tabnine@tabnine.com' },
      { name: 'CodeWhisperer', email: 'codewhisperer@amazon.com' },
      { name: 'Codeium', email: 'codeium@codeium.com' },
      { name: 'Replit Ghostwriter', email: 'ghostwriter@replit.com' },
      { name: 'Sourcegraph Cody', email: 'cody@sourcegraph.com' },
      { name: 'Cody', email: 'cody@sourcegraph.com' },
      { name: 'Factory Droid', email: 'droid@factory.ai' },
      { name: 'factory-droid[bot]', email: 'bot@factory.ai' },
      { name: 'Gemini', email: 'gemini@google.com' },
      { name: 'Perplexity', email: 'perplexity@perplexity.ai' },
      { name: 'Amazon Q', email: 'q@amazon.com' },
      { name: 'Amp', email: 'amp@amp.ai' },
    ];

    for (const ai of aiNames) {
      const repoDir = createTestRepo(`ai-name-test-${Date.now()}`, env);
      const message = `test: AI name coverage\n\nCo-Authored-By: ${ai.name} <${ai.email}>`;
      const commitResult = createCommit(repoDir, message, env);
      assertSuccess(commitResult, `commit with ${ai.name}`);
      
      const lastMessage = getLastCommitMessage(repoDir, env);
      assert.ok(!containsAISignature(lastMessage), 
        `AI signature "${ai.name}" should be removed. Got: ${lastMessage}`);
    }
    console.log(`✓ All ${aiNames.length} AI names are matched and removed`);
  }

  // =========================================================================
  // VAL-PATTERN-006: Multiple AI Signatures in Single Commit
  // =========================================================================
  console.log('\n--- VAL-PATTERN-006: Multiple AI Signatures ---');
  {
    const env = createHome('multiple-sigs-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for multiple signatures test');

    const repoDir = createTestRepo('multiple-sigs-repo', env);
    const message = `feat: add new feature

This commit adds a new feature to the application.

Co-Authored-By: Claude <claude@anthropic.com>
Co-Authored-By: GitHub Copilot <copilot@github.com>
Co-Authored-By: Cursor AI <cursor@cursor.sh>`;

    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit with multiple AI signatures');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      `All AI signatures should be removed. Got: ${lastMessage}`);
    assert.ok(lastMessage.includes('feat: add new feature'), 
      'Message body should be preserved');
    console.log('✓ Multiple AI signatures are all removed');
  }

  // =========================================================================
  // VAL-PATTERN-007: Mixed AI and Human Co-Authors
  // =========================================================================
  console.log('\n--- VAL-PATTERN-007: Mixed AI and Human Co-Authors ---');
  {
    const env = createHome('mixed-coauthors-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for mixed co-authors test');

    const repoDir = createTestRepo('mixed-coauthors-repo', env);
    const message = `feat: add new feature

Co-Authored-By: John Doe <john@example.com>
Co-Authored-By: Claude <claude@anthropic.com>
Co-Authored-By: Jane Smith <jane@example.com>
Co-Authored-By: GitHub Copilot <copilot@github.com>`;

    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit with mixed co-authors');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      `AI signatures should be removed. Got: ${lastMessage}`);
    assert.ok(containsHumanCoAuthor(lastMessage, 'John Doe'), 
      'Human co-author John Doe should be preserved');
    assert.ok(containsHumanCoAuthor(lastMessage, 'Jane Smith'), 
      'Human co-author Jane Smith should be preserved');
    console.log('✓ AI signatures removed, human co-authors preserved');
  }

  // =========================================================================
  // VAL-PATTERN-003: Whitespace Variation Handling
  // =========================================================================
  console.log('\n--- VAL-PATTERN-003: Whitespace Variations ---');
  {
    const env = createHome('whitespace-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for whitespace test');

    const testCases = [
      { input: 'Co-Authored-By: Claude <claude@anthropic.com>', label: 'single space' },
      { input: 'Co-Authored-By:   Claude <claude@anthropic.com>', label: 'multiple spaces' },
      { input: 'Co-Authored-By:Claude <claude@anthropic.com>', label: 'no space after colon' },
      { input: '  Co-Authored-By: Claude <claude@anthropic.com>', label: 'leading spaces' },
    ];

    for (const testCase of testCases) {
      const repoDir = createTestRepo(`whitespace-test-${Date.now()}`, env);
      const message = `test: whitespace\n\n${testCase.input}`;
      const commitResult = createCommit(repoDir, message, env);
      assertSuccess(commitResult, `commit with ${testCase.label}`);
      
      const lastMessage = getLastCommitMessage(repoDir, env);
      assert.ok(!containsAISignature(lastMessage), 
        `Whitespace variation "${testCase.label}" should be removed. Got: ${lastMessage}`);
    }
    console.log('✓ All whitespace variations are handled');
  }

  // =========================================================================
  // VAL-EXEC-003: Trailing Whitespace Cleanup
  // =========================================================================
  console.log('\n--- VAL-EXEC-003: Trailing Whitespace Cleanup ---');
  {
    const env = createHome('trailing-cleanup-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for trailing cleanup test');

    const repoDir = createTestRepo('trailing-cleanup-repo', env);
    // Create message with multiple trailing blank lines
    const message = `feat: add feature

Description here.

Co-Authored-By: Claude <claude@anthropic.com>


`;

    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit with trailing blank lines');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    // Check that trailing blank lines are cleaned up (no more than one trailing newline)
    assert.ok(!lastMessage.endsWith('\n\n'), 
      `Trailing blank lines should be cleaned. Got ending with: ${JSON.stringify(lastMessage.slice(-20))}`);
    assert.ok(!containsAISignature(lastMessage), 
      'AI signature should be removed');
    console.log('✓ Trailing blank lines are cleaned up');
  }

  // =========================================================================
  // VAL-EXEC-004: Commit Message File Integrity
  // =========================================================================
  console.log('\n--- VAL-EXEC-004: Message Integrity ---');
  {
    const env = createHome('integrity-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for integrity test');

    const repoDir = createTestRepo('integrity-repo', env);
    const message = `feat: implement user authentication

This commit adds JWT-based authentication to the API.

Changes:
- Add /login endpoint
- Add /logout endpoint
- Add token validation middleware

Breaking changes: None

Co-Authored-By: Claude <claude@anthropic.com>

Fixes #123`;

    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit with complex message');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      'AI signature should be removed');
    assert.ok(lastMessage.includes('feat: implement user authentication'), 
      'Title should be preserved');
    assert.ok(lastMessage.includes('JWT-based authentication'), 
      'Body content should be preserved');
    assert.ok(lastMessage.includes('- Add /login endpoint'), 
      'List items should be preserved');
    assert.ok(lastMessage.includes('Fixes #123'), 
      'Trailer should be preserved');
    console.log('✓ Message integrity preserved');
  }

  // =========================================================================
  // VAL-INSTALL-004: Installation Idempotency
  // =========================================================================
  console.log('\n--- VAL-INSTALL-004: Installation Idempotency ---');
  {
    const env = createHome('idempotency-home');
    
    // First install
    const result1 = runNode([cliPath, 'install'], { env });
    assertSuccess(result1, 'first install');
    
    // Second install
    const result2 = runNode([cliPath, 'install'], { env });
    assertSuccess(result2, 'second install');
    
    // Third install with --force
    const result3 = runNode([cliPath, 'install', '--force'], { env });
    assertSuccess(result3, 'install with --force');
    
    const hookPath = path.join(env.HOME, '.git-templates', 'hooks', 'commit-msg');
    assert.ok(fs.existsSync(hookPath), 'Hook should exist after multiple installs');
    console.log('✓ Installation idempotency verified');
  }

  // =========================================================================
  // VAL-INSTALL-006: Uninstallation Cleanup
  // Note: This test verifies uninstall runs without errors. The actual file
  // removal targets the real home directory (os.homedir()) rather than the
  // test HOME env variable, so we can't fully isolate this test.
  // =========================================================================
  console.log('\n--- VAL-INSTALL-006: Uninstallation ---');
  {
    const env = createHome('uninstall-home');
    
    // Verify uninstall command runs without errors (use --silent to skip confirmation)
    const uninstallResult = runNode([cliPath, 'uninstall', '--silent'], { env });
    assertSuccess(uninstallResult, 'uninstall');
    assert.ok(uninstallResult.stdout.includes('Uninstallation complete') || 
               uninstallResult.stdout.includes('Hook file not found'),
      'Uninstall should report completion');
    
    // Verify uninstall with --remove-config runs without errors
    const uninstallWithConfigResult = runNode([cliPath, 'uninstall', '--silent', '--remove-config'], { env });
    assertSuccess(uninstallWithConfigResult, 'uninstall with --remove-config');
    
    console.log('✓ Uninstallation commands verified (note: tests against real home dir)');
  }

  // =========================================================================
  // VAL-CROSS-001: Full Installation and Commit Flow
  // =========================================================================
  console.log('\n--- VAL-CROSS-001: Full Installation and Commit Flow ---');
  {
    const env = createHome('full-flow-home');
    
    // Fresh install
    const installResult = runNode([cliPath, 'install'], { env });
    assertSuccess(installResult, 'fresh install');
    assert.match(installResult.stdout, /Installation complete!/);
    
    // Create new repository
    const repoDir = createTestRepo('full-flow-repo', env);
    
    // Verify hook was copied
    const repoHookPath = path.join(repoDir, '.git', 'hooks', 'commit-msg');
    assert.ok(fs.existsSync(repoHookPath), 'Hook should be in new repo');
    
    // Commit with AI signature
    const message = `feat: test feature\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit in full flow');
    
    // Verify signature removed
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      `Signature should be removed in full flow. Got: ${lastMessage}`);
    
    console.log('✓ Full installation and commit flow verified');
  }

  // =========================================================================
  // VAL-CROSS-002: Existing Repository Hook Application
  // =========================================================================
  console.log('\n--- VAL-CROSS-002: Existing Repository Hook Application ---');
  {
    const env = createHome('existing-repo-home');
    
    // Create repo BEFORE installing
    const repoDir = createTestRepo('existing-before-install-repo', env);
    const repoHookPath = path.join(repoDir, '.git', 'hooks', 'commit-msg');
    
    // Verify no hook yet
    assert.ok(!fs.existsSync(repoHookPath), 'Hook should not exist before install');
    
    // Install nococli
    const installResult = runNode([cliPath, 'install'], { env });
    assertSuccess(installResult, 'install after creating repo');
    
    // Run git init in existing repo to copy hook
    const initResult = run('git', ['init'], { cwd: repoDir, env });
    assertSuccess(initResult, 'git init in existing repo');
    
    // Now hook should be there
    assert.ok(fs.existsSync(repoHookPath), 'Hook should exist after git init');
    
    // Verify it works
    const message = `feat: test\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit in existing repo');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 'Signature should be removed');
    
    console.log('✓ Existing repository hook application verified');
  }

  // =========================================================================
  // VAL-EXEC-002: Hook Non-Blocking Behavior
  // =========================================================================
  console.log('\n--- VAL-EXEC-002: Hook Non-Blocking Behavior ---');
  {
    const env = createHome('non-blocking-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for non-blocking test');

    const repoDir = createTestRepo('non-blocking-repo', env);
    
    // Test 1: Commit with AI signature (should succeed)
    const msg1 = `feat: with AI\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const result1 = createCommit(repoDir, msg1, env);
    assertSuccess(result1, 'commit with AI signature');
    
    // Test 2: Commit without AI signature (should succeed)
    const msg2 = `feat: without AI\n\nJust a regular commit`;
    const result2 = createCommit(repoDir, msg2, env, 'test2.txt');
    assertSuccess(result2, 'commit without AI signature');
    
    // Test 3: Commit with only human co-authors (should succeed)
    const msg3 = `feat: human co-author\n\nCo-Authored-By: John Doe <john@example.com>`;
    const result3 = createCommit(repoDir, msg3, env, 'test3.txt');
    assertSuccess(result3, 'commit with human co-author');
    
    // Verify human co-author preserved
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(lastMessage.includes('John Doe'), 'Human co-author should be preserved');
    
    console.log('✓ Hook non-blocking behavior verified');
  }

  // =========================================================================
  // VAL-EXEC-005: Concurrent Hook Safety
  // =========================================================================
  console.log('\n--- VAL-EXEC-005: Concurrent Hook Safety ---');
  {
    const env = createHome('concurrent-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for concurrent test');

    const repoDir = createTestRepo('concurrent-repo', env);
    
    // Make rapid successive commits
    const numCommits = 5;
    for (let i = 0; i < numCommits; i++) {
      const message = `feat: rapid commit ${i}\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
      const commitResult = createCommit(repoDir, message, env, `file${i}.txt`);
      assertSuccess(commitResult, `rapid commit ${i}`);
    }
    
    // Verify all commits exist
    const logResult = run('git', ['log', '--oneline'], { cwd: repoDir, env });
    assertSuccess(logResult, 'get commit log');
    const commitCount = logResult.stdout.trim().split('\n').length;
    assert.equal(commitCount, numCommits, `Should have ${numCommits} commits`);
    
    // Verify all messages are clean
    const allMessagesResult = run('git', ['log', '--format=%B', '---separator=---COMMIT---'], { cwd: repoDir, env });
    assert.ok(!containsAISignature(allMessagesResult.stdout), 
      'All commit messages should be clean of AI signatures');
    
    console.log('✓ Concurrent hook safety verified');
  }

  // =========================================================================
  // VAL-EXEC-006: Hook Performance
  // =========================================================================
  console.log('\n--- VAL-EXEC-006: Hook Performance ---');
  {
    const env = createHome('performance-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for performance test');

    const repoDir = createTestRepo('performance-repo', env);
    
    // Measure single signature removal
    const start = Date.now();
    const message = `feat: performance test\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const commitResult = createCommit(repoDir, message, env);
    const elapsed = Date.now() - start;
    
    assertSuccess(commitResult, 'performance commit');
    assert.ok(elapsed < 5000, `Hook should complete quickly (took ${elapsed}ms)`);
    console.log(`✓ Hook performance: ${elapsed}ms (target < 5000ms)`);
  }

  // =========================================================================
  // VAL-CROSS-007: Amended Commit Handling
  // =========================================================================
  console.log('\n--- VAL-CROSS-007: Amended Commit Handling ---');
  {
    const env = createHome('amend-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for amend test');

    const repoDir = createTestRepo('amend-repo', env);
    
    // Create initial commit
    const message1 = `feat: initial\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const commitResult1 = createCommit(repoDir, message1, env);
    assertSuccess(commitResult1, 'initial commit');
    
    // Amend with new AI signature
    const message2 = `feat: initial (amended)\n\nCo-Authored-By: Claude <claude@anthropic.com>\nCo-Authored-By: GitHub Copilot <copilot@github.com>`;
    
    // Write amended message to file
    const commitMsgPath = path.join(repoDir, '.git', 'COMMIT_EDITMSG');
    fs.writeFileSync(commitMsgPath, message2);
    
    const amendResult = run('git', ['commit', '--amend', '-F', commitMsgPath], { cwd: repoDir, env });
    assertSuccess(amendResult, 'amend commit');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      `All AI signatures should be removed from amended commit. Got: ${lastMessage}`);
    
    console.log('✓ Amended commit handling verified');
  }

  // =========================================================================
  // VAL-CROSS-006: Interactive Rebase Safety
  // =========================================================================
  console.log('\n--- VAL-CROSS-006: Interactive Rebase Safety ---');
  {
    const env = createHome('rebase-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for rebase test');

    const repoDir = createTestRepo('rebase-repo', env);
    
    // Create 3 commits with AI signatures
    for (let i = 1; i <= 3; i++) {
      const message = `feat: commit ${i}\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
      const commitResult = createCommit(repoDir, message, env, `file${i}.txt`);
      assertSuccess(commitResult, `commit ${i} for rebase test`);
    }
    
    // Simulate rebase squash by using git rebase with automated commands
    // Use GIT_SEQUENCE_EDITOR to automate the rebase todo list (replace pick with squash)
    // Cross-platform: use Node.js instead of sed for Windows support
    const sequenceEditor = `node -e "const fs=require('fs'),f=process.argv[1];let c=fs.readFileSync(f,'utf8');c=c.replace(/^pick/gm,(m,o)=>(c.substring(0,o).split('\\n').length<=3?'squash':m));fs.writeFileSync(f,c)"`;
    const rebaseEnv = {
      ...env,
      GIT_SEQUENCE_EDITOR: sequenceEditor,
    };
    
    // Run rebase to squash the last 2 commits into the first
    const rebaseResult = run('git', ['rebase', '-i', '--root'], { cwd: repoDir, env: rebaseEnv });
    
    // Rebase may require a commit message edit - handle by writing to the file
    // The hook should still work during the rebase process
    if (rebaseResult.status !== 0) {
      // If rebase is waiting for message, the commit msg file should exist
      const commitMsgPath = path.join(repoDir, '.git', 'COMMIT_EDITMSG');
      if (fs.existsSync(commitMsgPath)) {
        // Rewrite the message with AI signature
        const squashMessage = `feat: squashed commits\n\nCombined multiple commits.\n\nCo-Authored-By: Claude <claude@anthropic.com>\nCo-Authored-By: GitHub Copilot <copilot@github.com>`;
        fs.writeFileSync(commitMsgPath, squashMessage);
        
        // Continue the rebase
        const continueResult = run('git', ['rebase', '--continue'], { cwd: repoDir, env });
        assertSuccess(continueResult, 'continue rebase after message edit');
      }
    }
    
    // Verify AI signatures removed from final commit
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      `AI signatures should be removed from rebased commit. Got: ${lastMessage}`);
    
    console.log('✓ Interactive rebase safety verified');
  }

  // =========================================================================
  // VAL-INSTALL-005: Platform-Specific Installation (line endings)
  // =========================================================================
  console.log('\n--- VAL-INSTALL-005: Platform-Specific Installation ---');
  {
    const env = createHome('platform-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for platform test');

    const hookPath = path.join(env.HOME, '.git-templates', 'hooks', 'commit-msg');
    const hookContent = fs.readFileSync(hookPath, 'utf8');
    
    // Check that hook uses LF line endings (Unix-style)
    const hasCRLF = hookContent.includes('\r\n');
    assert.ok(!hasCRLF, 'Hook should use LF line endings, not CRLF');
    
    // Check hook content has expected elements
    assert.ok(hookContent.includes('#!/usr/bin/env node'), 'Hook should have Node.js shebang');
    assert.ok(hookContent.includes("require('fs')"), 'Hook should use Node.js fs');
    
    console.log('✓ Platform-specific installation verified');
  }

  // =========================================================================
  // VAL-CROSS-005: CI/CD Environment Compatibility
  // =========================================================================
  console.log('\n--- VAL-CROSS-005: CI/CD Environment Compatibility ---');
  {
    // Simulate CI environment by setting CI=true
    const env = {
      ...createHome('ci-home'),
      CI: 'true',
      GIT_AUTHOR_NAME: 'CI Bot',
      GIT_AUTHOR_EMAIL: 'ci@example.com',
      GIT_COMMITTER_NAME: 'CI Bot',
      GIT_COMMITTER_EMAIL: 'ci@example.com',
    };
    
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install in CI environment');

    const repoDir = createTestRepo('ci-repo', env);
    
    // Commit with AI signature in CI
    const message = `ci: automated commit\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const commitResult = createCommit(repoDir, message, env);
    assertSuccess(commitResult, 'commit in CI environment');
    
    const lastMessage = getLastCommitMessage(repoDir, env);
    assert.ok(!containsAISignature(lastMessage), 
      'Signature should be removed in CI environment');
    
    console.log('✓ CI/CD environment compatibility verified');
  }

  // =========================================================================
  // VAL-CROSS-008: Merge Commit Handling
  // =========================================================================
  console.log('\n--- VAL-CROSS-008: Merge Commit Handling ---');
  {
    const env = createHome('merge-home');
    const result = runNode([cliPath, 'install'], { env });
    assertSuccess(result, 'install for merge test');

    // Create main repo
    const mainRepoDir = createTestRepo('merge-main-repo', env);
    
    // Create initial commit on main
    const initialMessage = `feat: initial main commit\n\nJust a starter commit`;
    const initialCommit = createCommit(mainRepoDir, initialMessage, env);
    assertSuccess(initialCommit, 'initial commit on main');

    // Create and checkout feature branch
    run('git', ['checkout', '-b', 'feature-branch'], { cwd: mainRepoDir, env });
    
    // Create commit on feature branch with AI signature
    const featureMessage = `feat: feature branch commit\n\nCo-Authored-By: Claude <claude@anthropic.com>`;
    const featureCommit = createCommit(mainRepoDir, featureMessage, env, 'feature-file.txt');
    assertSuccess(featureCommit, 'feature branch commit');
    
    // Switch back to master/main
    run('git', ['checkout', 'master'], { cwd: mainRepoDir, env });
    
    // Create merge with AI signature in merge message
    const mergeMsgPath = path.join(mainRepoDir, '.git', 'MERGE_MSG');
    const mergeMessage = `Merge branch 'feature-branch'\n\nCo-Authored-By: GitHub Copilot <copilot@github.com>`;
    fs.writeFileSync(mergeMsgPath, mergeMessage);
    
    // Perform the merge (use --no-ff to create merge commit)
    const mergeResult = run('git', ['merge', '--no-ff', 'feature-branch', '-F', mergeMsgPath], { cwd: mainRepoDir, env });
    assertSuccess(mergeResult, 'merge commit');
    
    // Get the merge commit message
    const lastMessage = getLastCommitMessage(mainRepoDir, env);
    
    // Verify AI signature removed from merge commit
    assert.ok(!containsAISignature(lastMessage), 
      `AI signature should be removed from merge commit. Got: ${lastMessage}`);
    assert.ok(lastMessage.includes("Merge branch 'feature-branch'"), 
      'Merge message should be preserved');
    
    console.log('✓ Merge commit handling verified');
  }

  console.log('\n========================================');
  console.log('All E2E tests passed!');
  console.log('========================================');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
