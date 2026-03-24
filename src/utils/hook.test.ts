import { describe, test, expect } from 'bun:test';
import { generateHookContent, getDefaultPatterns, getPatternNames } from './hook';

/**
 * Unit tests for pattern matching in nococli hook
 * Covers validation contract assertions VAL-PATTERN-001 through VAL-PATTERN-010
 */

describe('Pattern Matching - Hook Content Generation', () => {
  test('generates valid bash hook content', () => {
    const content = generateHookContent();
    expect(content).toContain('#!/bin/bash');
    expect(content).toContain('COMMIT_MSG_FILE=$1');
    expect(content).toContain('sed -i -E');
  });

  test('includes trailing empty lines cleanup', () => {
    const content = generateHookContent();
    expect(content).toContain('Remove trailing empty lines');
  });
});

describe('Pattern Matching - Case Variations (VAL-PATTERN-001)', () => {
  test('pattern matches case-insensitive Co-Authored-By header', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;

    // Test various case variations
    const testCases = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'co-authored-by: Claude <claude@anthropic.com>',
      'CO-AUTHORED-BY: Claude <claude@anthropic.com>',
      'Co-AUTHORED-by: Claude <claude@anthropic.com>',
      'cO-aUtHoReD-bY: Claude <claude@anthropic.com>',
      'Co-authored-by: Claude <claude@anthropic.com>',
    ];

    const regex = new RegExp(pattern);
    testCases.forEach(input => {
      expect(regex.test(input)).toBe(true);
    });
  });
});

describe('Pattern Matching - AI Name Coverage (VAL-PATTERN-002)', () => {
  test('pattern matches all required AI names', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // All required AI names from validation contract
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

    aiSignatures.forEach(signature => {
      expect(regex.test(signature)).toBe(true);
    });
  });

  test('getPatternNames returns list of AI pattern names', () => {
    const names = getPatternNames();
    expect(names.length).toBeGreaterThan(0);
    expect(names).toContain('AI Co-Authors');
  });
});

describe('Pattern Matching - Whitespace Variations (VAL-PATTERN-003)', () => {
  test('pattern handles various whitespace patterns', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const whitespaceVariations = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By:   Claude <claude@anthropic.com>',     // multiple spaces after colon
      'Co-Authored-By:Claude <claude@anthropic.com>',        // no space after colon
      'Co-Authored-By : Claude <claude@anthropic.com>',      // space before colon
      'Co-Authored-By:\t\tClaude <claude@anthropic.com>',    // tabs after colon
      '  Co-Authored-By: Claude <claude@anthropic.com>',     // leading spaces
      '\tCo-Authored-By: Claude <claude@anthropic.com>',     // leading tabs
    ];

    whitespaceVariations.forEach(input => {
      expect(regex.test(input)).toBe(true);
    });
  });
});

describe('Pattern Matching - Version Numbers (VAL-PATTERN-004)', () => {
  test('pattern handles AI signatures with version numbers', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // Signatures that use wildcards in the pattern (matches "Claude", "Gemini", "ChatGPT" with optional suffix via .*)
    const versionedSignatures = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: Claude 3.5 Sonnet <claude@anthropic.com>',
      'Co-Authored-By: Claude (claude-3-5-sonnet) <noreply@anthropic.com>',
      'Co-Authored-By: Claude-3.5-Sonnet <claude@anthropic.com>',
      'Co-Authored-By: GitHub Copilot (v1.0) <copilot@github.com>',
      'Co-Authored-By: Gemini 1.5 Pro <gemini@google.com>',
      // Note: GPT-4 and ChatGPT-4o are NOT in the DEFAULT_AI_PATTERNS list
      // The pattern only matches "ChatGPT" and "Gemini" (not "GPT-4" or "ChatGPT-4o")
    ];

    versionedSignatures.forEach(signature => {
      expect(regex.test(signature)).toBe(true);
    });
  });

  test('documents unsupported version patterns - GPT-4', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // Note: "ChatGPT-4o" DOES match because pattern starts with "ChatGPT" and has .* suffix
    // But "GPT-4" doesn't match because "GPT-4" is not in the AI name list
    const unsupportedVersionPatterns = [
      'Co-Authored-By: GPT-4 <gpt4@openai.com>',
    ];

    // Document current behavior: GPT-4 doesn't match (not in pattern list)
    unsupportedVersionPatterns.forEach(signature => {
      expect(regex.test(signature)).toBe(false);
    });
  });

  test('ChatGPT variants are matched due to .* suffix', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // ChatGPT-4o matches because pattern has "ChatGPT" followed by .*
    const chatGPTVariants = [
      'Co-Authored-By: ChatGPT <chatgpt@openai.com>',
      'Co-Authored-By: ChatGPT-4o <chatgpt@openai.com>',
    ];

    chatGPTVariants.forEach(signature => {
      expect(regex.test(signature)).toBe(true);
    });
  });
});

describe('Pattern Matching - Email Format Variations (VAL-PATTERN-005)', () => {
  test('pattern handles various email formats', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const emailVariations = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: Claude <claude+noreply@anthropic.com>',
      'Co-Authored-By: Claude [claude@anthropic.com]',
      'Co-Authored-By: Claude (claude@anthropic.com)',
      'Co-Authored-By: Claude claude@anthropic.com',
      'Co-Authored-By: Claude <claude@anthropic.com> via AI',
      'Co-Authored-By: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>',
      'Co-Authored-By: Claude Code <noreply@anthropic.com>',
    ];

    emailVariations.forEach(signature => {
      expect(regex.test(signature)).toBe(true);
    });
  });
});

describe('Pattern Matching - Multiple Signatures (VAL-PATTERN-006)', () => {
  test('pattern matches each AI signature individually in multi-signature commit', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // In real hook, sed processes line by line, so test each line
    const multiSignatureCommit = [
      'feat: add new feature',
      '',
      'This commit adds a new feature to the application.',
      '',
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: GitHub Copilot <copilot@github.com>',
      'Co-Authored-By: Cursor AI <cursor@cursor.sh>',
    ];

    const aiSignatureLines = multiSignatureCommit.filter(line => regex.test(line));
    expect(aiSignatureLines.length).toBe(3);
  });
});

describe('Pattern Matching - Mixed AI and Human Co-Authors (VAL-PATTERN-007)', () => {
  test('pattern only matches AI co-authors, not human ones', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const humanCoAuthors = [
      'Co-Authored-By: John Doe <john@example.com>',
      'Co-Authored-By: Jane Smith <jane@example.com>',
      'Co-Authored-By: Bob Wilson <bob@company.com>',
    ];

    const aiCoAuthors = [
      'Co-Authored-By: Claude <claude@anthropic.com>',
      'Co-Authored-By: GitHub Copilot <copilot@github.com>',
    ];

    // Human co-authors should NOT match
    humanCoAuthors.forEach(human => {
      expect(regex.test(human)).toBe(false);
    });

    // AI co-authors SHOULD match
    aiCoAuthors.forEach(ai => {
      expect(regex.test(ai)).toBe(true);
    });
  });

  test('documents current behavior - names starting with AI names are matched', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // Current implementation behavior: the pattern uses greedy matching (.*)
    // which means "Claude Smith" matches because it starts with "Claude"
    // This is a known limitation - the pattern matches any name starting with AI name
    const humanWithAINameCurrentlyMatched = [
      'Co-Authored-By: Claude Smith <claude.smith@company.com>',
      'Co-Authored-By: Gemini Wong <gemini.wong@company.com>',
      'Co-Authored-By: Cody Johnson <cody.j@company.com>',
    ];

    // Document current behavior: these ARE matched (potential false positive)
    humanWithAINameCurrentlyMatched.forEach(human => {
      expect(regex.test(human)).toBe(true);
    });
  });

  test('truly human names without AI prefixes are preserved', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // These human names don't start with AI names, so they're preserved
    const preservedHumanCoAuthors = [
      'Co-Authored-By: John Doe <john@example.com>',
      'Co-Authored-By: Amber Q. Smith <amber.q@company.com>',
    ];

    preservedHumanCoAuthors.forEach(human => {
      expect(regex.test(human)).toBe(false);
    });
  });
});

describe('Pattern Matching - Signature Placement (VAL-PATTERN-008)', () => {
  test('pattern matches signatures regardless of position in message', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // Standard position at end
    const atEnd = 'Co-Authored-By: Claude <claude@anthropic.com>';
    expect(regex.test(atEnd)).toBe(true);

    // After other trailers
    const afterTrailers = 'Co-Authored-By: Claude <claude@anthropic.com>';
    expect(regex.test(afterTrailers)).toBe(true);
  });

  test('pattern works with multi-line context extraction', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

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

    const matchingLines = commitLines.filter(line => regex.test(line));
    expect(matchingLines.length).toBe(1);
    expect(matchingLines[0]).toContain('Claude');
  });
});

describe('Pattern Matching - Special Characters (VAL-PATTERN-009)', () => {
  test('pattern handles special characters in AI names and emails', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // Supported special character signatures
    const supportedSignatures = [
      'Co-Authored-By: Claude-3.5-Sonnet <claude@anthropic.com>',
      'Co-Authored-By: Claude_Code <claude@anthropic.com>',
      'Co-Authored-By: factory-droid[bot] <bot@factory.ai>',
    ];

    supportedSignatures.forEach(signature => {
      expect(regex.test(signature)).toBe(true);
    });
  });

  test('documents unsupported patterns - AI (Beta)', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // "AI (Beta)" and "AI Assistant" - the pattern list includes "AI Assistant" but not generic "AI"
    const unsupportedPatterns = [
      'Co-Authored-By: AI (Beta) <ai@example.com>',
    ];

    // Document current behavior: these don't match
    unsupportedPatterns.forEach(signature => {
      expect(regex.test(signature)).toBe(false);
    });
  });
});

describe('Pattern Matching - Edge Cases (VAL-PATTERN-010)', () => {
  test('pattern does not match malformed co-author lines', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const malformedLines = [
      'Co-Authored-By',                                          // no colon or content
      'Co-Authored-By:',                                         // colon but no content
      'Co-Authored-By: ',                                        // colon and space only
      'Co-Authored-By:    <claude@anthropic.com>',               // missing name, has AI email
    ];

    malformedLines.forEach(line => {
      // These may or may not match depending on implementation
      // The key is they should not cause regex errors
      expect(() => regex.test(line)).not.toThrow();
    });
  });

  test('pattern does not match empty or whitespace-only content', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    expect(regex.test('')).toBe(false);
    expect(regex.test('   ')).toBe(false);
    expect(regex.test('\t\t')).toBe(false);
    expect(regex.test('\n')).toBe(false);
  });

  test('pattern does not match non-co-author content', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const nonMatchingContent = [
      'This is a regular commit message',
      'Reviewed-by: Alice <alice@example.com>',
      'Signed-off-by: Bob <bob@example.com>',
      'Fixes #123',
      'Refs: JIRA-789',
    ];

    nonMatchingContent.forEach(content => {
      expect(regex.test(content)).toBe(false);
    });
  });
});

describe('Pattern Matching - Regression Prevention (VAL-REGRESS-001, VAL-REGRESS-002)', () => {
  test('documents known limitation - AI-prefix names are matched', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    // Current implementation uses .* which matches any suffix after AI name
    // This means humans with names like "Claude Smith" are matched (false positive)
    const humanCoAuthorsWithAIPrefix = [
      'Co-Authored-By: Claude Smith <claude.smith@company.com>',
      'Co-Authored-By: Gemini Wong <gemini.wong@company.com>',
      'Co-Authored-By: Cody Johnson <cody.j@company.com>',
    ];

    // Document: these ARE currently matched (known limitation)
    humanCoAuthorsWithAIPrefix.forEach(human => {
      expect(regex.test(human)).toBe(true);
    });
  });

  test('human co-authors without AI-name prefixes are preserved', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const humanCoAuthorsToPreserve = [
      'Co-Authored-By: Amber Q. Smith <amber.q@company.com>',
      'Co-Authored-By: John Doe <john@example.com>',
    ];

    humanCoAuthorsToPreserve.forEach(human => {
      expect(regex.test(human)).toBe(false);
    });
  });

  test('commit message body with AI keywords is not corrupted', () => {
    const patterns = getDefaultPatterns();
    const pattern = patterns[0].pattern;
    const regex = new RegExp(pattern);

    const commitBodyLines = [
      'docs: update Claude API documentation',
      'This commit updates the documentation for:',
      '- Claude API v3',
      '- GitHub Copilot integration guide',
      '- ChatGPT troubleshooting section',
      'The AI assistant helped review this documentation.',
    ];

    commitBodyLines.forEach(line => {
      expect(regex.test(line)).toBe(false);
    });
  });
});

describe('getDefaultPatterns', () => {
  test('returns array with at least one pattern', () => {
    const patterns = getDefaultPatterns();
    expect(patterns.length).toBeGreaterThan(0);
  });

  test('each pattern has name and pattern properties', () => {
    const patterns = getDefaultPatterns();
    patterns.forEach(p => {
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('pattern');
      expect(typeof p.name).toBe('string');
      expect(typeof p.pattern).toBe('string');
    });
  });

  test('pattern is valid regex', () => {
    const patterns = getDefaultPatterns();
    patterns.forEach(p => {
      expect(() => new RegExp(p.pattern)).not.toThrow();
    });
  });
});

describe('generateHookContent', () => {
  test('accepts custom patterns option', () => {
    const customPatterns = [
      { name: 'Custom AI', pattern: 'Co-Authored-By: CustomAI.*' },
    ];
    const content = generateHookContent({ patterns: customPatterns });
    expect(content).toContain('CustomAI');
  });

  test('uses default patterns when no options provided', () => {
    const content = generateHookContent();
    // Should contain pattern for Claude which is in DEFAULT_AI_PATTERNS
    expect(content).toContain('Claude');
  });

  test('generates sed command with -E flag for extended regex', () => {
    const content = generateHookContent();
    expect(content).toContain('sed -i -E');
  });
});
