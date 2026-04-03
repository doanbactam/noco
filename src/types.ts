/**
 * TypeScript definitions for nococli
 */

import patternCatalog from './pattern-catalog.json';

export interface AI_PATTERN {
  name: string;
  pattern: string;
}

export interface AIProviderPatternCatalogEntry {
  id: string;
  signatureAliases: string[];
  authorTokens: string[];
  emails: string[];
  emailPatterns?: string[];
}

export interface Config {
  templateDir: string;
  hooksDir: string;
  hookFile: string;
  powerShellHookFile: string;
}

export interface InstallOptions {
  force?: boolean;
  silent?: boolean;
  platform?: NodeJS.Platform;
}

export interface UninstallOptions {
  removeConfig?: boolean;
  silent?: boolean;
  platform?: NodeJS.Platform;
}

export interface HookResult {
  success: boolean;
  message: string;
  path?: string;
}

export type HookMode = 'node' | 'powershell';

const CO_AUTHORED_BY_PREFIX = '^\\s*Co-Authored-By\\s*:\\s*';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function uniqueOrdered(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function flattenCatalogValues(
  key: 'signatureAliases' | 'authorTokens' | 'emails' | 'emailPatterns',
): string[] {
  return uniqueOrdered(
    AI_SIGNATURE_CATALOG.flatMap((provider) => provider[key] ?? []),
  );
}

function buildNamePattern(aliases: readonly string[]): string {
  return `${CO_AUTHORED_BY_PREFIX}(?:${aliases.map(escapeRegex).join('|')}).*`;
}

function buildEmailPattern(emails: readonly string[], emailPatterns: readonly string[]): string {
  const emailAlternatives = [
    ...emails.map(escapeRegex),
    ...emailPatterns,
  ];

  return `${CO_AUTHORED_BY_PREFIX}.*\\b(?:${emailAlternatives.join('|')})\\b.*`;
}

export const AI_SIGNATURE_CATALOG: readonly AIProviderPatternCatalogEntry[] =
  patternCatalog as readonly AIProviderPatternCatalogEntry[];

const AI_SIGNATURE_ALIASES = flattenCatalogValues('signatureAliases');
const AI_AUTHOR_TOKENS = flattenCatalogValues('authorTokens');
const AI_EMAILS = flattenCatalogValues('emails');
const AI_EMAIL_PATTERNS = flattenCatalogValues('emailPatterns');

const AI_NAME_PATTERN = buildNamePattern(AI_SIGNATURE_ALIASES);
const AI_EMAIL_PATTERN = buildEmailPattern(AI_EMAILS, AI_EMAIL_PATTERNS);

export const DEFAULT_AI_PATTERNS: readonly AI_PATTERN[] = [
  { name: 'AI Co-Author Names', pattern: AI_NAME_PATTERN },
  { name: 'AI Co-Author Emails', pattern: AI_EMAIL_PATTERN },
] as const;

// AI author names to detect in git config (case-insensitive)
export const AI_AUTHOR_NAMES = AI_AUTHOR_TOKENS;

export function isAIAuthor(name: string): boolean {
  const lowerName = name.toLowerCase().trim();
  return AI_AUTHOR_NAMES.some((aiName) => lowerName.includes(aiName.toLowerCase()));
}
