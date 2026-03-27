import { describe, test, expect } from 'bun:test';
import { generateHookContent, getDefaultPatterns, getPatternNames } from './hook';

/**
 * Unit tests for nococli hook — Node.js cross-platform hook
 */

describe('Hook Content Generation', () => {
  test('generates valid Node.js hook content', () => {
    const content = generateHookContent();
    expect(content).toContain('#!/usr/bin/env node');
    expect(content).toContain('process.argv[2]');
    expect(content).toContain("require('fs')");
  });

  test('includes trailing blank line cleanup', () => {
    const content = generateHookContent();
    expect(content).toContain('filtered.pop()');
  });
});

describe('Pattern Matching - Case Variations (VAL-PATTERN-001)', () => {
  test('pattern matches case-insensitive Co-Authored-By header', () => {
    const patterns = getDefaultPatterns();
    const namePattern = patterns[0].pattern;

    const testCases = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'co-authored-by: Claude <claude@anthropic.com>',
      'CO-AUTHORED-BY: Claude <claude@anthropic.com>',
      'Co-AUTHORED-by: Claude <claude@anthropic.com>',
      'cO-aUtHoReD-bY: Claude <claude@anthropic.com>',
      'Co-authored-by: Claude <claude@anthropic.com>',
    ];

    const regex = new RegExp(namePattern, 'i');
    testCases.forEach((input) => {
      expect(regex.test(input)).toBe(true);
    });
  });
});

describe('Pattern Matching - AI Name Coverage (VAL-PATTERN-002)', () => {
  test('name pattern matches all required AI names', () => {
    const patterns = getDefaultPatterns();
    const namePattern = patterns[0].pattern;
    const regex = new RegExp(namePattern, 'i');

    const aiSignatures = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: Claude Code <claude@anthropic.com>',
      'Co-Authored-By: GitHub Copilot <copilot@github.com>',
      'Co-Authored-By: ChatGPT <chatgpt@openai.com>',
      'Co-Authored-By: Cursor AI <cursor@cursor.sh>',
      'Co-Authored-By: Tabnine <tabnine@tabnine.com>',
      'Co-Authored-By: CodeWhisperer <codewhisperer@amazon.com>',
      'Co-Authored-By: Codeium <codeium@codeium.com>',
      'Co-Authored-By: Replit Ghostwriter <ghostwriter@replit.com>',
      'Co-Authored-By: Sourcegraph Cody <cody@sourcegraph.com>',
      'Co-Authored-By: Cody <cody@sourcegraph.com>',
      'Co-Authored-By: Factory Droid <droid@factory.ai>',
      'Co-Authored-By: factory-droid[bot] <bot@factory.ai>',
      'Co-Authored-By: Gemini <gemini@google.com>',
      'Co-Authored-By: Perplexity <perplexity@perplexity.ai>',
      'Co-Authored-By: Amazon Q <q@amazon.com>',
      'Co-Authored-By: Amp <amp@amp.ai>',
    ];

    aiSignatures.forEach((signature) => {
      expect(regex.test(signature)).toBe(true);
    });
  });

  test('email pattern matches all AI email domains', () => {
    const patterns = getDefaultPatterns();
    const emailPattern = patterns[1].pattern;
    const regex = new RegExp(emailPattern, 'i');

    const aiEmails = [
      'Co-Authored-By: Claude <noreply@anthropic.com>',
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: Copilot <copilot@github.com>',
      'Co-Authored-By: ChatGPT <chatgpt@openai.com>',
      'Co-Authored-By: Something <noreply@openai.com>',
      'Co-Authored-By: Cursor <cursor@cursor.sh>',
      'Co-Authored-By: Gemini <gemini@google.com>',
      'Co-Authored-By: Perplexity <perplexity@perplexity.ai>',
      'Co-Authored-By: Amazon Q <q@amazon.com>',
      'Co-Authored-By: Amp <amp@amp.ai>',
      'Co-Authored-By: Cody <cody@sourcegraph.com>',
    ];

    aiEmails.forEach((signature) => {
      expect(regex.test(signature)).toBe(true);
    });
  });

  test('getPatternNames returns list of AI pattern names', () => {
    const names = getPatternNames();
    expect(names.length).toBe(2);
    expect(names).toContain('AI Co-Author Names');
    expect(names).toContain('AI Co-Author Emails');
  });
});

describe('Pattern Matching - Whitespace Variations (VAL-PATTERN-003)', () => {
  test('pattern handles various whitespace patterns', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern, 'i');

    const whitespaceVariations = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By:   Claude <claude@anthropic.com>',
      'Co-Authored-By:Claude <claude@anthropic.com>',
      'Co-Authored-By : Claude <claude@anthropic.com>',
      'Co-Authored-By:\t\tClaude <claude@anthropic.com>',
      '  Co-Authored-By: Claude <claude@anthropic.com>',
      '\tCo-Authored-By: Claude <claude@anthropic.com>',
    ];

    whitespaceVariations.forEach((input) => {
      expect(regex.test(input)).toBe(true);
    });
  });
});

describe('Pattern Matching - Version Numbers (VAL-PATTERN-004)', () => {
  test('pattern handles AI signatures with version numbers', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern, 'i');

    const versionedSignatures = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: Claude 3.5 Sonnet <claude@anthropic.com>',
      'Co-Authored-By: Claude (claude-3-5-sonnet) <noreply@anthropic.com>',
      'Co-Authored-By: GitHub Copilot (v1.0) <copilot@github.com>',
      'Co-Authored-By: Gemini 1.5 Pro <gemini@google.com>',
    ];

    versionedSignatures.forEach((signature) => {
      expect(regex.test(signature)).toBe(true);
    });
  });

  test('documents unsupported version patterns - GPT-4', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern, 'i');

    const unsupported = ['Co-Authored-By: GPT-4 <gpt4@openai.com>'];
    unsupported.forEach((signature) => {
      expect(regex.test(signature)).toBe(false);
    });
  });
});

describe('Pattern Matching - Email Format Variations (VAL-PATTERN-005)', () => {
  test('email pattern handles various formats', () => {
    const patterns = getDefaultPatterns();
    const emailPattern = patterns[1].pattern;
    const regex = new RegExp(emailPattern, 'i');

    const emailVariations = [
      'Co-Authored-By: Claude <noreply@anthropic.com>',
      'Co-Authored-By: Claude Code <noreply@anthropic.com>',
      'Co-Authored-By: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>',
    ];

    emailVariations.forEach((signature) => {
      expect(regex.test(signature)).toBe(true);
    });
  });
});

describe('Pattern Matching - Multiple Signatures (VAL-PATTERN-006)', () => {
  test('pattern matches each AI signature individually in multi-signature commit', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const multiSignatureCommit = [
      'feat: add new feature',
      '',
      'This commit adds a new feature to the application.',
      '',
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: GitHub Copilot <copilot@github.com>',
      'Co-Authored-By: Cursor AI <cursor@cursor.sh>',
    ];

    const aiSignatureLines = multiSignatureCommit.filter((line) => regex.test(line));
    expect(aiSignatureLines.length).toBe(3);
  });
});

describe('Pattern Matching - Mixed AI and Human Co-Authors (VAL-PATTERN-007)', () => {
  test('name pattern only matches AI co-authors, not human ones', () => {
    const patterns = getDefaultPatterns();
    const nameRegex = new RegExp(patterns[0].pattern, 'i');
    const emailRegex = new RegExp(patterns[1].pattern, 'i');

    const humanCoAuthors = [
      'Co-Authored-By: John Doe <john@example.com>',
      'Co-Authored-By: Jane Smith <jane@example.com>',
      'Co-Authored-By: Bob Wilson <bob@company.com>',
    ];

    const aiCoAuthors = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: GitHub Copilot <copilot@github.com>',
    ];

    // Human co-authors should NOT match name or email pattern
    humanCoAuthors.forEach((human) => {
      expect(nameRegex.test(human)).toBe(false);
      expect(emailRegex.test(human)).toBe(false);
    });

    // AI co-authors SHOULD match
    aiCoAuthors.forEach((ai) => {
      expect(nameRegex.test(ai)).toBe(true);
    });
  });

  test('false positive reduction - human names with AI prefixes have non-AI emails', () => {
    const patterns = getDefaultPatterns();
    const nameRegex = new RegExp(patterns[0].pattern, 'i');
    const emailRegex = new RegExp(patterns[1].pattern, 'i');

    // These have AI-sounding names but human emails
    // Name pattern matches (greedy .*) — known false positive
    // Email pattern does NOT match — provides safety net
    const humanWithAIName = [
      'Co-Authored-By: Claude Smith <claude.smith@company.com>',
      'Co-Authored-By: Gemini Wong <gemini.wong@company.com>',
      'Co-Authored-By: Cody Johnson <cody.j@company.com>',
    ];

    humanWithAIName.forEach((human) => {
      // Name pattern still matches — known limitation
      expect(nameRegex.test(human)).toBe(true);
      // Email pattern does NOT match — email-based safety net
      expect(emailRegex.test(human)).toBe(false);
    });
  });

  test('truly human names without AI prefixes are preserved', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const preservedHumanCoAuthors = [
      'Co-Authored-By: John Doe <john@example.com>',
      'Co-Authored-By: Amber Q. Smith <amber.q@company.com>',
    ];

    preservedHumanCoAuthors.forEach((human) => {
      expect(regex.test(human)).toBe(false);
    });
  });
});

describe('Pattern Matching - Signature Placement (VAL-PATTERN-008)', () => {
  test('pattern works with multi-line context extraction', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const commitLines = [
      'feat: add feature',
      '',
      'First paragraph.',
      '',
      'Co-Authored-By: Claude <claude@anthropic.com>',
      '',
      'Second paragraph.',
      '',
      'Reviewed-by: Alice <alice@example.com>',
      'Signed-off-by: Bob <bob@example.com>',
    ];

    const matchingLines = commitLines.filter((line) => regex.test(line));
    expect(matchingLines.length).toBe(1);
    expect(matchingLines[0]).toContain('Claude');
  });
});

describe('Pattern Matching - Special Characters (VAL-PATTERN-009)', () => {
  test('pattern handles special characters in AI names and emails', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const supportedSignatures = [
      'Co-Authored-By: Claude-3.5-Sonnet <claude@anthropic.com>',
      'Co-Authored-By: Claude_Code <claude@anthropic.com>',
      'Co-Authored-By: factory-droid[bot] <bot@factory.ai>',
    ];

    supportedSignatures.forEach((signature) => {
      expect(regex.test(signature)).toBe(true);
    });
  });
});

describe('Pattern Matching - Edge Cases (VAL-PATTERN-010)', () => {
  test('pattern does not throw on malformed lines', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const malformedLines = [
      'Co-Authored-By',
      'Co-Authored-By:',
      'Co-Authored-By: ',
      'Co-Authored-By:    <claude@anthropic.com>',
    ];

    malformedLines.forEach((line) => {
      expect(() => regex.test(line)).not.toThrow();
    });
  });

  test('pattern does not match empty or whitespace-only content', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    expect(regex.test('')).toBe(false);
    expect(regex.test('   ')).toBe(false);
    expect(regex.test('\t\t')).toBe(false);
    expect(regex.test('\n')).toBe(false);
  });

  test('pattern does not match non-co-author content', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const nonMatchingContent = [
      'This is a regular commit message',
      'Reviewed-by: Alice <alice@example.com>',
      'Signed-off-by: Bob <bob@example.com>',
      'Fixes #123',
      'Refs: JIRA-789',
    ];

    nonMatchingContent.forEach((content) => {
      expect(regex.test(content)).toBe(false);
    });
  });

  test('commit body with AI keywords is not corrupted', () => {
    const patterns = getDefaultPatterns();
    const regex = new RegExp(patterns[0].pattern, 'i');

    const commitBodyLines = [
      'docs: update Claude API documentation',
      'This commit updates the documentation for:',
      '- Claude API v3',
      '- GitHub Copilot integration guide',
      '- ChatGPT troubleshooting section',
      'The AI assistant helped review this documentation.',
    ];

    commitBodyLines.forEach((line) => {
      expect(regex.test(line)).toBe(false);
    });
  });
});

describe('getDefaultPatterns', () => {
  test('returns array with two patterns (name + email)', () => {
    const patterns = getDefaultPatterns();
    expect(patterns.length).toBe(2);
  });

  test('each pattern has name and pattern properties', () => {
    const patterns = getDefaultPatterns();
    patterns.forEach((p) => {
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('pattern');
      expect(typeof p.name).toBe('string');
      expect(typeof p.pattern).toBe('string');
    });
  });

  test('pattern is valid regex', () => {
    const patterns = getDefaultPatterns();
    patterns.forEach((p) => {
      expect(() => new RegExp(p.pattern, 'i')).not.toThrow();
    });
  });
});

describe('generateHookContent', () => {
  test('accepts custom patterns option', () => {
    const customPatterns = [{ name: 'Custom AI', pattern: 'Co-Authored-By: CustomAI.*' }];
    const content = generateHookContent({ patterns: customPatterns });
    expect(content).toContain('CustomAI');
  });

  test('uses default patterns when no options provided', () => {
    const content = generateHookContent();
    expect(content).toContain('Claude');
  });

  test('generates Node.js hook with require("fs")', () => {
    const content = generateHookContent();
    expect(content).toContain("require('fs')");
    expect(content).toContain('#!/usr/bin/env node');
    expect(content).toContain('process.argv[2]');
  });

  test('generates filter logic with patterns.some(p => p.test(line))', () => {
    const content = generateHookContent();
    expect(content).toContain('patterns.some');
    expect(content).toContain('.test(line)');
  });
});
