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

## Supported AI Signatures

Removes co-author signatures from:

- **Claude** (Claude, Claude Code, Claude 3, Claude 3.5, Claude Sonnet, Claude Opus)
- **GitHub Copilot**
- **ChatGPT / OpenAI** (ChatGPT, GPT-4, ChatGPT-4o)
- **Cursor AI**
- **Tabnine**
- **CodeWhisperer / Amazon CodeWhisperer**
- **Codeium**
- **Replit Ghostwriter**
- **Sourcegraph Cody / Cody**
- **Factory Droid** (factory-droid, factory-droid[bot])
- **Gemini / Google Gemini** (Gemini Pro, Gemini 1.5)
- **Perplexity AI**
- **Amazon Q**
- **Amp / Amp AI**

### Pattern Matching Features

- **Case-insensitive** matching for "Co-Authored-By" lines
- **Flexible whitespace** handling (spaces, tabs, no space after colon)
- **Version number** support (e.g., "Claude 3.5 Sonnet", "GPT-4")
- **Email format** variations handled

## Requirements

- **Unix/Linux/macOS**: Git with bash hook support
- **Windows**: Git Bash, WSL, or MSYS2 (native PowerShell not supported)

## Install

```bash
# Run directly with npx (recommended)
npx nococli

# Or install globally
npm install -g nococli
noco
```

## npm Package

[nococli](https://www.npmjs.com/package/nococli) - Published on npm, the package manager for JavaScript.

---

*"AI exists to help you. It's important that you remain the owner and accountable for your work without AI taking credit."* — [Tibo](https://x.com/thsottiaux/status/2035386081517133924)
