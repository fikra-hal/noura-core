# Noura Core

Core TypeScript/Node.js foundation for Noura's identity and configuration management.

## Overview

This repository contains the foundational components and configurations for Noura Khalil's digital identity, providing a centralized source of truth for personal and professional constants, settings, and core utilities.

## V1 Scope

### Identity Management
- **Personal Identity Constants**: Full name, email, timezone, and other core identity markers
- **Slack Integration**: Display name and member ID for workspace interactions
- **Configuration Management**: Centralized settings with environment-based overrides

### Core Utilities
- **Structured Logging**: Consistent logging across all Noura-related applications
- **Environment Configuration**: Type-safe configuration loading and validation
- **Security-First Design**: Least-privilege principles and secure defaults

### Developer Experience
- **TypeScript**: Full type safety and modern JavaScript features
- **pnpm**: Fast, efficient package management
- **Modern Tooling**: ESLint, Prettier, and development best practices

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev

# Run tests
pnpm test
```

## Environment Setup

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## Architecture

```
src/
├── index.ts          # Main entry point
├── app.ts            # Application setup and initialization
├── core/
│   └── logger.ts     # Structured logging utility
└── config/
    └── settings.ts   # Configuration management
```

## Security

This project follows least-privilege principles. See [SECURITY.md](SECURITY.md) for detailed security guidelines and practices.

## Contributing

As this is a personal core library, contributions are currently limited. However, feel free to open issues for suggestions or improvements.

## License

MIT - see [LICENSE](LICENSE) for details.
