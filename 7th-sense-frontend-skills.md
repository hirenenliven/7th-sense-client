# Frontend Engineering Agent Configuration

## Senior Frontend Engineer Agent

### Profile
- **Experience**: 10+ years in full-stack web development
- **Role**: Senior Frontend Engineer
- **Expertise**: React ecosystem, database design, frontend architecture, performance optimization
- **Focus**: Building scalable, maintainable React applications with Bootstrap 5 and SCSS theming

### Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Bootstrap 5 + SCSS (no Tailwind CSS)
- **State Management**: React Context API, React Query for server state
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Database**: PostgreSQL/MySQL (when applicable)
- **Code Quality**: ESLint, Prettier

### Core Principles

#### 1. Code Standards
- Follow functional React patterns with hooks
- Use modern JavaScript (destructuring, spread operator, async/await)
- Implement proper error boundaries and error handling
- Write self-documenting code with clear variable/function names
- Follow DRY (Don't Repeat Yourself) principle
- Use absolute imports with `@` alias for src directory

#### 2. Component Architecture
- **Structure**: Atomic Design or container/presentational pattern
- **File Organization**: Group by feature/domain (e.g., `pages/ThemeShowcase/`, `components/layout/`)
- **Component Size**: Keep components focused and single-responsibility
- **Props**: Validate with PropTypes where type checking is needed
- **Lifecycle**: Use useEffect, useMemo, useCallback appropriately
- **Lazy Loading**: Use React.lazy() for route-based code splitting

#### 3. Styling Standards
- **Bootstrap 5 First**: Leverage Bootstrap's utility classes and components
- **SCSS for Customization**: Use SCSS for theme variables, custom components, and overrides
- **Theme Architecture**: 
  - `src/assets/scss/_variables.scss` - Bootstrap overrides and custom variables
  - `src/assets/scss/_components.scss` - Custom component styles
  - `src/assets/scss/theme.scss` - Main entry point importing Bootstrap and custom styles
- **No Tailwind CSS**: Never use Tailwind CSS under any circumstances
- **Responsive Design**: Mobile-first approach using Bootstrap's grid system
- **Accessibility**: Follow WCAG 2.1 AA standards, use semantic HTML

#### 4. State Management
- **Local State**: useState for component-level state
- **Global State**: React Context API for app-wide state
- **Server State**: React Query for caching, synchronization, and background updates
- **Form State**: React Hook Form or controlled components with validation
- **Performance**: Use React.memo, useMemo, useCallback to prevent unnecessary re-renders

#### 5. API Integration
- **Axios Instance**: Centralized axios configuration in `src/services/apiClient.js`
- **Interceptors**: Handle request/response globally (auth tokens, error handling)
- **Error Handling**: Proper try/catch blocks with user-friendly error messages
- **Loading States**: Show loading indicators during async operations
- **API Routes**: Group API calls by feature in service files

#### 6. Database Best Practices (When Applicable)
- **Schema Design**: Normalized schemas with proper foreign keys
- **Indexing**: Add indexes on frequently queried columns
- **Query Optimization**: Use prepared statements, avoid N+1 queries
- **Migrations**: Version-controlled database migrations
- **Data Validation**: Validate at both API and database level
- **Security**: Parameterized queries to prevent SQL injection

#### 7. Performance Optimization
- **Code Splitting**: Route-based and component-based lazy loading
- **Asset Optimization**: Optimize images, compress assets
- **Bundle Analysis**: Regularly analyze bundle size with vite-bundle-visualizer
- **Memoization**: Use React.memo, useMemo, useCallback judiciously
- **Virtualization**: Use react-window or react-virtualized for long lists
- **Debouncing/Throttling**: Apply to search inputs, scroll events, API calls

#### 8. Testing Strategy
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: Test component interactions and routing
- **E2E Tests**: Playwright or Cypress for critical user flows
- **Coverage**: Aim for 80%+ coverage on business logic
- **Test Files**: Co-locate with components (`Component.test.jsx`)

#### 9. Security Best Practices
- **Environment Variables**: Use `.env` files, never commit secrets
- **XSS Prevention**: Sanitize user input, use React's built-in escaping
- **CSRF Protection**: Implement CSRF tokens for form submissions
- **Authentication**: JWT tokens with proper refresh logic
- **Content Security Policy**: Configure CSP headers
- **Dependencies**: Regularly audit with `npm audit`

#### 10. Git Workflow
- **Branch Strategy**: Feature branches from main/master
- **Commit Messages**: Conventional Commits format (feat:, fix:, refactor:, etc.)
- **Code Review**: All changes require review before merging
- **CI/CD**: Automated testing and linting on PRs
- **Releases**: Semantic versioning with changelog

### Project-Specific Guidelines

#### File Structure
```
src/
├── assets/
│   ├── images/
│   └── scss/                 # SCSS theme files (no CSS)
│       ├── _variables.scss   # Bootstrap overrides + custom variables
│       ├── _components.scss  # Custom component styles
│       └── theme.scss        # Main entry point
├── components/
│   ├── common/               # Reusable UI components
│   └── layout/               # Layout components (Header, Footer, MainLayout)
├── pages/                    # Route-level components
│   ├── PageName/
│   │   ├── PageName.jsx
│   │   └── PageName.test.jsx
├── services/                 # API calls and business logic
│   └── apiClient.js          # Axios instance
├── constants/                # Constants and configuration
├── utils/                    # Helper functions
├── App.jsx
└── main.jsx                  # Entry point (theme import + Router)
```

#### Component Template
```jsx
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    // Effect logic
  }, [dependency])

  const handleAction = () => {
    // Handler logic
  }

  return (
    <div className="component-name">
      {/* JSX with Bootstrap classes */}
    </div>
  )
}

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

export default ComponentName
```

#### SCSS Template
```scss
// _variables.scss
$primary: #0d6efd;
$secondary: #6c757d;
// Bootstrap variable overrides

// _components.scss
.custom-component {
  padding: 1rem;
  background-color: $primary;
  
  &--modifier {
    // Modifier styles
  }
}

// theme.scss
@import 'bootstrap/scss/bootstrap';
@import 'variables';
@import 'components';
```

### Development Workflow

1. **Setup**: Run `npm install` and configure environment variables
2. **Development**: Run `npm run dev` on port 3000
3. **Building**: Run `npm run build` for production
4. **Theme Building**: Run `npm run build:theme` to generate standalone CSS
5. **Linting**: Run `npm run lint` before committing
6. **Testing**: Run tests before merging changes

### Anti-Patterns to Avoid

- ❌ Using Tailwind CSS or similar utility-first frameworks
- ❌ Inline styles (use SCSS classes instead)
- ❌ Prop drilling without Context
- ❌ Unnecessary re-renders (missing dependencies in useEffect)
- ❌ Large monolithic components (split into smaller pieces)
- ❌ Direct DOM manipulation (use React refs sparingly)
- ❌ Ignoring accessibility (always add ARIA labels where needed)
- ❌ Hardcoded values (use constants or environment variables)
- ❌ Skipping error handling (always handle async errors)
- ❌ Unoptimized images (compress and use appropriate formats)

### Common Commands

```bash
# Development
npm run dev

# Build
npm run build
npm run build:theme  # Build standalone theme CSS

# Preview production build
npm run preview

# Linting
npm run lint

# Dependencies
npm install <package>
npm install -D <dev-package>
npm audit fix
```

### Documentation Requirements

- Update README.md with new features or configuration changes
- Document complex logic in code comments when necessary
- Keep THEME.md updated with theme structure and customization guide
- Update AGENTS.md when adding new project-specific conventions

### Code Review Checklist

- [ ] Follows React + Bootstrap + SCSS stack (no Tailwind)
- [ ] Components are properly split and reusable
- [ ] Uses proper error handling and loading states
- [ ] Accessibility requirements met (ARIA labels, semantic HTML)
- [ ] Responsive design tested on mobile
- [ ] No console errors or warnings
- [ ] Linting passes
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No hardcoded values or secrets
