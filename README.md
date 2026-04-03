# nococli

[![npm version](https://img.shields.io/npm/v/nococli.svg)](https://www.npmjs.com/package/nococli)
[![npm downloads](https://img.shields.io/npm/dm/nococli.svg)](https://www.npmjs.com/package/nococli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Your code is yours. Your commits should be too.

AI tools (Claude Code, Copilot, Cursor) auto-add themselves as co-author on every commit.

But **you** wrote the code. **You** understand it. **You're** responsible.

One command to reclaim ownership:

```bash
npx nococli
```

That's it.

## How It Works

nococli installs a Git `commit-msg` hook that automatically strips AI co-author signatures from your commit messages before they're saved. The hook is installed globally via `git init.templatedir`, so it applies to **all new repositories** automatically.

On Windows, nococli installs a PowerShell-native hook runtime with a Git hook wrapper entrypoint so commits work from PowerShell 5.1 and PowerShell 7+.

For existing repositories, just run `git init` to pick up the hook.

## CLI Commands

```bash
# Install hook globally (default when running npx nococli)
npx nococli
npx nococli install           # Same as above
npx nococli install --force   # Overwrite existing hook without prompting

# Check installation status
npx nococli status

# List all AI signature patterns being removed
npx nococli patterns

# Change git author if current author looks like an AI
npx nococli setup-author

# Remove hook from your system
npx nococli uninstall
npx nococli uninstall --remove-config  # Also remove git template config
```

## Supported AI Signatures

Removes co-author signatures from:

- **Claude** (Claude Code, Claude Sonnet, Claude Opus, etc.)
- **GitHub Copilot**
- **ChatGPT / OpenAI** (GPT-4, ChatGPT-4o, etc.)
- **Cursor AI**
- **Tabnine**
- **Amazon CodeWhisperer**
- **Codeium**
- **Replit Ghostwriter**
- **Sourcegraph Cody**
- **Factory Droid**
- **Google Gemini** (Gemini Pro, Gemini 1.5, etc.)
- **Perplexity AI**
- **Amazon Q**
- **Amp AI**

### Pattern Matching

- **Case-insensitive** — `Co-Authored-By`, `co-authored-by`, `CO-AUTHORED-BY` all matched
- **Flexible whitespace** — spaces, tabs, no space after colon
- **Version numbers** — `Claude 3.5 Sonnet`, `GPT-4`, etc.
- **Email-domain matching** — catches AI signatures by email regardless of name

## Features

- **Zero-config** — one command to install, works everywhere
- **Lightweight** — single runtime dependency (commander), ~85KB bundle
- **Windows PowerShell-native support** — works with PowerShell 5.1 and 7+ on Git for Windows
- **AI author detection** — warns if your git author name looks AI-generated and helps you fix it
- **Preserves human co-authors** — only strips AI signatures, keeps real collaborators
- **Works with all git workflows** — rebase, amend, merge, interactive rebase

## Requirements

- **Node.js** >= 18.0.0
- **Unix/Linux/macOS**: Git with standard hook support
- **Windows**: Git for Windows plus PowerShell 5.1 or PowerShell 7+

## Install

```bash
# Run directly with npx (recommended)
npx nococli

# Or install globally
npm install -g nococli
noco
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](https://opensource.org/licenses/MIT)

---

*"AI exists to help you. It's important that you remain the owner and accountable for your work without AI taking credit."* — [Tibo](https://x.com/thsottiaux/status/2035386081517133924)
