/**
 * Tests for pattern matching in hook generation
 * Covers VAL-PATTERN-003: Whitespace Variation Handling
 */

import { describe, it, expect } from 'bun:test';
import { generateHookContent, getDefaultPatterns } from './hook.js';

describe('Pattern Matching', () => {
  describe('Whitespace variations (VAL-PATTERN-003)', () => {
    // Get the regex pattern from DEFAULT_AI_PATTERNS
    const getPattern = () => {
      const patterns = getDefaultPatterns();
      return patterns[0].pattern;
    };

    it('should match standard single space after colon', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('Co-Authored-By: Claude <claude@anthropic.com>')).toBe(true);
    });

    it('should match multiple spaces after colon', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('Co-Authored-By:   Claude <claude@anthropic.com>')).toBe(true);
    });

    it('should match no space after colon', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('Co-Authored-By:Claude <claude@anthropic.com>')).toBe(true);
    });

    it('should match space before colon', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('Co-Authored-By : Claude <claude@anthropic.com>')).toBe(true);
    });

    it('should match tabs after colon', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('Co-Authored-By:\t\tClaude <claude@anthropic.com>')).toBe(true);
    });

    it('should match leading spaces on the line', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('  Co-Authored-By: Claude <claude@anthropic.com>')).toBe(true);
    });

    it('should match leading tabs on the line', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('\t\tCo-Authored-By: Claude <claude@anthropic.com>')).toBe(true);
    });

    it('should match mixed leading and trailing whitespace', () => {
      const pattern = getPattern();
      const regex = new RegExp(pattern);
      expect(regex.test('  Co-Authored-By :  \tClaude <claude@anthropic.com>')).toBe(true);
    });
  });

  describe('Generated hook content', () => {
    it('should include sed command with extended regex flag', () => {
      const content = generateHookContent();
      expect(content).toContain('sed -i -E');
    });

    it('should include the pattern in sed command', () => {
      const content = generateHookContent();
      // Pattern uses character classes for case-insensitivity, so check for [Cc]
      expect(content).toContain('[Cc][Oo]-[Aa][Uu][Tt][Hh][Oo][Rr][Ee][Dd]-[Bb][Yy]');
    });
  });
});
