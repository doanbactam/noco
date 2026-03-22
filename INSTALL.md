# Install nococli

## Quick Install

```bash
npx nococli
```

Works on Windows, Mac, Linux. No setup required.

Run this in any git repo to install the hook.

## What it does

Installs a git hook that removes AI co-author signatures from your commits before they're created.

Supports: Claude Code, GitHub Copilot, Cursor, Windsurf, and other AI tools.

## Usage

### Normal commit (without nococli)

```
commit abc123
Author: You <you@example.com>
Co-authored-by: Claude <noreply@anthropic.com>
```

### With nococli installed

```
commit abc123
Author: You <you@example.com>
```

Just commit as usual. The hook runs automatically before each commit.

### Example workflow

```bash
# 1. Install once per project
npx nococli

# 2. Work normally - hook runs automatically
git add .
git commit -m "fix: improve error handling"

# 3. Verify - no AI co-author!
git log -1 --format=full
```

### Commands

```bash
npx nococli              # install (default)
npx nococli install      # install explicitly
npx nococli uninstall    # remove hook
npx nococli status       # check if installed
npx nococli patterns     # list AI patterns removed
```

**Or install globally for shorter commands:**

```bash
npm install -g nococli
noco                      # install
noco uninstall            # remove hook
noco status               # check status
```

### Verify it's working

```bash
# Check if hook exists
ls .git/hooks/prepare-commit-msg-noco

# Or check git config
git config --get --bool noco.enabled
```
