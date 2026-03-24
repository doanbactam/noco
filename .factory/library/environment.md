# Environment

Environment variables, external dependencies, and setup notes for nococli development.

**What belongs here:** Required env vars, external dependencies, platform-specific notes.

**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Runtime Requirements

- **Node.js**: v18.0.0 or higher
- **Bun**: v1.0.0 or higher (recommended for development)
- **Git**: Required for hook functionality

## Platform Support

| Platform | Support Level | Notes |
|----------|---------------|-------|
| macOS | Full | Native support |
| Linux | Full | Native support |
| Windows (Git Bash) | Full | Requires Git Bash, WSL, or MSYS2 |
| Windows (PowerShell) | None | Not supported - hook uses bash |

## Build Commands

```bash
# Install dependencies
bun install

# Build for both bun and node
bun run build

# Run tests
bun test

# Run e2e tests
bun run test:e2e
```

## Testing Notes

- Unit tests use Bun's built-in test framework
- E2E tests create temporary directories and isolated HOME environments
- Tests should NOT modify user's actual git configuration
