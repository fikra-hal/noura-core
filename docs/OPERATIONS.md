# Noura Core Operations

## Development Setup

### Prerequisites
- Node.js 20.0.0 or higher
- PNPM 8.0.0 or higher
- Git

### Installation
```bash
git clone https://github.com/fikra-hal/noura-core.git
cd noura-core
pnpm install
```

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Configure required environment variables:
   - `NOURA_FULL_NAME="Noura Khalil"`
   - `NOURA_EMAIL="nk@fikra.ventures"`
   - `DEFAULT_TIMEZONE="Asia/Dubai"`

## Development Commands

### Building and Running
```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

### Code Quality
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check
```

### Testing
```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Tests passing
- [ ] Build successful
- [ ] Security audit clean
- [ ] Performance benchmarks met

### Environment Variables
- `NODE_ENV`: production/development/test
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: debug/info/warn/error
- `NOURA_FULL_NAME`: Full name for identity
- `NOURA_EMAIL`: Primary email address
- `DEFAULT_TIMEZONE`: Default timezone setting

## Monitoring

### Health Checks
- Application startup validation
- Module initialization status
- Memory usage monitoring
- Response time tracking

### Logging
- Structured JSON logging
- Request/response tracing
- Error reporting and alerting
- Performance metrics collection

## Troubleshooting

### Common Issues
1. **Module Import Errors**: Check TypeScript compilation
2. **Memory Leaks**: Monitor contact storage cleanup
3. **Performance Issues**: Review classification algorithms
4. **Test Failures**: Verify environment setup

### Debug Mode
```bash
NODE_ENV=development DEBUG=* pnpm dev
```

## Security
- Regular dependency updates
- Input validation with Zod schemas
- Environment variable security
- Code quality gates in CI/CD
