# Changelog

All notable changes to this project will be documented in this file.

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
