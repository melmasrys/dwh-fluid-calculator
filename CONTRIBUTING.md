# Contributing Guide

Thank you for your interest in contributing to the DWH Sizing Calculator! This guide provides instructions for setting up your development environment and contributing to the project.

## Development Setup

### Prerequisites

- Node.js v18 or higher
- pnpm v10 or higher
- Git

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dwh_fluid_calculator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173` (Vite default) or `http://localhost:3000` if the server is running.

## Project Structure

```
dwh_fluid_calculator_temp/
├── client/                 # Frontend React application
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   └── App.tsx           # Main App component
├── server/               # Backend Express server
│   └── index.ts          # Server entry point
├── shared/               # Shared types and utilities
├── public/               # Static assets
├── dist/                 # Production build output
├── package.json          # Project dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your code changes
2. Run type checking: `pnpm check`
3. Format code: `pnpm format`
4. Test locally: `pnpm dev`

### Committing Changes

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add new sizing algorithm for Databricks"
```

Use conventional commit types:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test changes
- `chore:` for build and dependency updates

### Pushing Changes

```bash
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to the GitHub repository
2. Click "New Pull Request"
3. Select your feature branch
4. Provide a clear description of your changes
5. Submit the pull request

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type; use proper type annotations
- Keep types organized in shared modules

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use descriptive component names
- Add JSDoc comments for complex components

Example:
```typescript
/**
 * Displays sizing recommendations for a cloud platform
 * @param platform - The cloud platform name
 * @param sku - The recommended SKU
 * @param cost - Estimated monthly cost
 */
export function SizingCard({ platform, sku, cost }: SizingCardProps) {
  return (
    <div className="sizing-card">
      {/* Component content */}
    </div>
  );
}
```

### Styling

- Use TailwindCSS utility classes
- Avoid inline styles
- Follow the existing design system
- Use Radix UI components for interactive elements

### File Naming

- Components: `PascalCase` (e.g., `SizingCard.tsx`)
- Utilities: `camelCase` (e.g., `calculateSKU.ts`)
- Styles: Use TailwindCSS classes, avoid separate CSS files

## Testing

Currently, the project uses Vitest for testing. To run tests:

```bash
pnpm test
```

When adding new features, please include appropriate tests.

## Documentation

- Update `README.md` for user-facing changes
- Update `DEPLOYMENT.md` for deployment-related changes
- Add inline code comments for complex logic
- Document new environment variables

## Performance Considerations

- Minimize bundle size
- Use code splitting for large features
- Optimize images and assets
- Monitor performance metrics in production

## Reporting Issues

If you find a bug or have a feature request:

1. Check existing issues to avoid duplicates
2. Create a new issue with a clear title and description
3. Include steps to reproduce for bugs
4. Provide context about your environment

## Questions?

If you have questions about contributing, feel free to open a discussion or contact the project maintainers.

Thank you for contributing!
