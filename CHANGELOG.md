# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2026-03-24

### Added
- **5 new AI assistant patterns**: Factory Droid, Gemini/Google Gemini, Perplexity AI, Amazon Q, Amp/Amp AI
- Case-insensitive pattern matching for "Co-Authored-By" lines (works with any letter casing)
- Flexible whitespace handling in pattern matching (spaces, tabs, no space after colon)
- Comprehensive unit tests for pattern matching (15+ test cases)
- Extended e2e tests covering hook functionality, not just installation

### Fixed
- Hook now matches AI signatures regardless of letter casing (co-authored-by, CO-AUTHORED-BY, etc.)
- Hook now handles various whitespace patterns around signatures
- Hook correctly handles complex commits with mixed AI and human co-authors
- Hook preserves human co-authors while removing AI co-authors
- Hook works correctly during interactive rebase, amend, and merge operations

### Changed
- Improved regex pattern using character classes for portable case-insensitive matching
- Removed unused static `hooks/commit-msg` file to avoid confusion with generated hook

## [1.0.2] - 2026-03-22

### Changed
- `npx nococli` now runs the install flow by default instead of only showing help
- Installation now warns clearly when `init.templatedir` already points to a different template directory

### Fixed
- Git config updates now use direct process arguments instead of shell quoting, so `git init` can copy hooks correctly on Windows

### Added
- End-to-end install coverage for the default install path and template-directory conflict handling

## [1.0.1] - 2026-03-22

### Added
- Support for 13 AI co-author signatures (Claude, GitHub Copilot, ChatGPT, Anthropic, OpenAI, Cursor AI, AI Assistant, Tabnine, CodeWhisperer, Codeium, Replit Ghostwriter, Sourcegraph Cody)
- Regex pattern matching with wildcards for version numbers and emails

### Changed
- Redesigned CLI with minimal style (removed ASCII art banner)
- Improved command descriptions for clarity
- `nococli` as the consistent CLI name
- No auto-install when no command provided (shows help instead)

### Fixed
- Pattern matching now works with AI signatures that include version numbers (e.g., "Claude Opus 4.6")
- Pattern matching now works with email addresses

## [1.0.0] - 2025-03-21

### Added
- Initial release
- Git hook to remove AI co-author signatures from commit messages
- CLI with install, uninstall, status, and patterns commands
