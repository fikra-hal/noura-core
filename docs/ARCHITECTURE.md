# Noura Core Architecture

## Overview
Noura Core is built as a modular TypeScript/Node.js system designed for scalability and maintainability.

## Core Principles
- **Modular Design**: Each feature is contained within its own module
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Minimal Dependencies**: Lean dependency tree for security and performance
- **Testable Code**: Comprehensive test coverage with Jest

## System Architecture

### Module Structure
```
src/
├── modules/           # Feature modules
│   ├── inbox/         # Email classification and management
│   ├── memory/        # Contact and relationship storage
│   ├── meetings/      # Meeting preparation and analysis
│   └── scheduling/    # Calendar and scheduling logic
├── core/              # Core utilities and services
└── config/            # Configuration management
```

### Key Components

#### Inbox Module
- **InboxService**: Email classification and processing
- **Classifiers**: Rule-based and ML-powered categorization

#### Memory Module
- **ContactMemory**: In-memory contact storage with Map-based implementation
- **Schemas**: Zod-based validation for contact profiles

#### Meetings Module
- **BriefService**: Pre-meeting preparation and context gathering
- **DebriefService**: Post-meeting summarization and action extraction

#### Scheduling Module
- Calendar integration and smart scheduling
- Conflict detection and resolution

## Data Flow
1. **Input Processing**: Raw data (emails, calendar events) enters through service layer
2. **Classification**: AI/ML models classify and categorize content
3. **Storage**: Processed data stored in appropriate memory systems
4. **Analysis**: Intelligence layer generates insights and recommendations
5. **Output**: Formatted results delivered through API endpoints

## Technology Stack
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+
- **Validation**: Zod
- **Testing**: Jest
- **Package Manager**: PNPM

## Scalability Considerations
- Stateless service design for horizontal scaling
- Event-driven architecture for loose coupling
- Caching strategies for performance optimization
- Database abstraction for storage flexibility
