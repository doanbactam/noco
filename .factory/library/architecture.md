# Architecture

Architectural decisions and patterns for nococli.

**What belongs here:** Architectural decisions, design patterns, code organization.

---

## Project Structure

```
nococli/
├── src/
│   ├── cli.ts           # CLI entry point (commander)
│   ├── install.ts       # Hook installation logic
│   ├── uninstall.ts     # Hook removal logic
│   ├── types.ts         # TypeScript types + AI patterns
│   └── utils/
│       ├── hook.ts      # Hook content generation
│       ├── hook.test.ts # Unit tests for pattern matching
│       ├── git.ts       # Git config operations
│       ├── paths.ts     # Cross-platform path utilities
│       └── logger.ts    # CLI output formatting
├── scripts/
│   └── e2e-install.mjs  # E2E tests
└── dist/                # Built output
```

**Note:** The static `hooks/commit-msg` file was removed. Hook content is now generated dynamically by `generateHookContent()` in `src/utils/hook.ts`.

## Key Patterns

### Pattern Storage
- AI patterns defined in `src/types.ts` as `DEFAULT_AI_PATTERNS`
- Single regex pattern for all AI names (alternation)
- Pattern used by `generateHookContent()` to create bash hook

### Hook Generation
- `generateHookContent()` creates bash script dynamically
- Uses `sed -i -E` for extended regex in-place editing
- Hook removes matching lines and cleans trailing whitespace

### Cross-Platform Paths
- `toGitPath()` converts Windows backslashes to forward slashes
- Git config requires forward slashes even on Windows

## Design Decisions

1. **Dynamic hook generation**: Hook content is generated at install time rather than using a static file. This allows for future configuration options.

2. **Single regex pattern**: All AI names in one alternation group for simplicity and performance.

3. **Bash-only hook**: Windows PowerShell not supported due to sed dependency. Users must use Git Bash, WSL, or MSYS2.
