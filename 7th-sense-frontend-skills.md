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

#### 3.1 Table Design Standards (Golden Standard)

**All list tables MUST follow the sortable table pattern.**

##### Required Components
```jsx
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import TablePagination from '@/components/common/TablePagination'
import { newestFirst } from '@/utils/helpers'
```

##### Table Structure Pattern

**Step 1: Define sortable columns**
```jsx
const columns = [
  { label: 'ID', sort: (row) => row.id },
  { label: 'Name', sort: (row) => row.name },
  { label: 'Status', sort: (row) => row.status },
  { label: 'Created', sort: (row) => row.createdAt },
  ...(canManage ? ['Actions'] : []),
]
```

**Step 2: Use useTableSort hook**
```jsx
const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
```

**Step 3: Apply latest-first ordering**
```jsx
const matched = useMemo(() => {
  const term = search.trim().toLowerCase()
  return term ? items.filter((item) => matchesSearch(item, term)) : items
}, [items, search])

const filtered = useMemo(() => newestFirst(matched), [matched])
```

**Step 4: Render table with SortableHead**
```jsx
<div className="ts-table-panel">
  <Table hover responsive className="mb-0">
    <SortableHead columns={columns} sort={sort} onSort={onSort} />
    <tbody>
      {pageRows.map((row) => (
        <RowComponent key={row.id} row={row} />
      ))}
    </tbody>
  </Table>
  <TablePagination
    total={filtered.length}
    pageSize={pageSize}
    currentPage={currentPage}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
  />
</div>
```

##### Key Rules for Tables

1. **Wrap in `.ts-table-panel`**: Provides rounded panel with sticky header and scrollable body
2. **Use `<SortableHead />`**: Replaces manual `<thead>` with sortable column headers
3. **Define sort functions**: Each sortable column needs a `sort: (row) => value` function
4. **Plain string columns**: Non-sortable columns (Actions, View) are plain strings in the array
5. **Latest-first ordering**: Apply `newestFirst()` after filtering so new rows appear at top
6. **Customer column**: For superadmin views, add customer label with `useOrgUser().customerLabel(userId | customerId)`
7. **Status badge**: Use `<StatusBadge active={…} />` for Active/Inactive status (green for active, red for inactive)
8. **TablePagination**: Integrate as footer inside the panel for consistent pagination

##### Reference Implementation
See `src/pages/Branches/BranchList.jsx`, `src/pages/Parts/PartList.jsx`, or `src/pages/Organization/Supervisors/SupervisorList.jsx` for complete working examples.

#### 4. State Management
- **Local State**: useState for component-level state
- **Global State**: React Context API for app-wide state
- **Server State**: React Query for caching, synchronization, and background updates
- **Form State**: React Hook Form with Zod validation (see Form Handling Guidelines below)
- **Performance**: Use React.memo, useMemo, useCallback to prevent unnecessary re-renders

#### 4.1 Form Handling Guidelines (Golden Standard)

**All forms in this project MUST use React Hook Form with Zod validation.**

##### Required Dependencies
```bash
npm install react-hook-form zod @hookform/resolvers
```

##### Form Structure Pattern

**Step 1: Create validation schema in a separate file (e.g., `customerForm.js`)**
```javascript
import { z } from 'zod'

// Define your validation schema with Zod
export const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  machineId: z.coerce.number().min(1, 'Select a machine'),
  // Add conditional validation with superRefine if needed
}).superRefine((data, ctx) => {
  // Conditional validation logic
  if (data.country === 'IN' && !data.gstNo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'GST No. is required',
      path: ['gstNo'],
    })
  }
})

// Export initial values for the form
export const INITIAL_VALUES = {
  name: '',
  email: '',
  machineId: '',
}
```

**Step 2: Use React Hook Form in your component**
```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { customerSchema, INITIAL_VALUES } from './customerForm'

function CustomerForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Watch specific fields for conditional logic
  const country = watch('country')

  const onSubmit = async (values) => {
    // values are already validated by the schema
    try {
      await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      reset() // Reset form after successful submission
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Direct field name in label - no separate LABELS constant */}
      <input className="form-control" {...register('name')} />
      {errors.name && <small className="text-danger">{errors.name.message}</small>}

      <input className="form-control" {...register('email')} />
      {errors.email && <small className="text-danger">{errors.email.message}</small>}

      <select className="form-select" {...register('machineId')}>
        <option value="">Select</option>
        <option value="1">Machine 1</option>
      </select>
      {errors.machineId && <small className="text-danger">{errors.machineId.message}</small>}

      <button className="btn btn-primary" disabled={isSubmitting}>Save</button>
    </form>
  )
}
```

##### Key Rules for Form Handling

1. **NO separate LABELS constant**: Set field labels directly in JSX using the field name or any desired text
2. **NO custom validation functions**: Use Zod schema for all validation logic
3. **NO manual error state management**: React Hook Form handles errors automatically
4. **NO manual touched state**: React Hook Form handles touched state automatically
5. **Use `register` for all form fields**: Never use manual onChange handlers unless needed for special formatting
6. **Use `watch` for conditional logic**: Watch fields that affect other fields (e.g., country → state)
7. **Use `setValue` for programmatic updates**: Use setValue to update fields programmatically (e.g., reset state when country changes)
8. **Display errors with `errors.field?.message`**: Use optional chaining to safely access error messages
9. **Use `isSubmitting` instead of custom loading state**: React Hook Form provides this automatically
10. **Use `reset()` to clear the form**: Never manually reset form state

##### Handling Special Cases

**Uppercase fields (e.g., GST, PAN):**
```jsx
const handleChange = (event) => {
  const { name, value } = event.target
  if (UPPERCASE_FIELDS.has(name)) {
    setValue(name, value.toUpperCase())
  }
}

<input {...register('gstNo', { onChange: handleChange })} />
```

**Conditional required fields (e.g., country-specific fields):**
```javascript
// In Zod schema using superRefine
.superRefine((data, ctx) => {
  if (data.country === 'IN' && !data.gstNo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'GST No. is required',
      path: ['gstNo'],
    })
  }
})
```

**File upload with validation:**
```javascript
// In Zod schema
logo: z
  .instanceof(File, { message: 'Invalid file' })
  .refine((file) => FILE_RULES.types.includes(file.type), 'Unsupported file type')
  .refine((file) => file.size <= FILE_RULES.maxBytes, 'File too large')
  .nullable()
  .optional()
```

**Integration with React Bootstrap:**
```jsx
<Form.Control {...register('fieldName')} isInvalid={Boolean(errors.fieldName)} />
<Form.Control.Feedback type="invalid">{errors.fieldName?.message}</Form.Control.Feedback>
```

##### Reference Implementation
See `src/pages/Customers/AddCustomer.jsx` and `src/pages/Customers/customerForm.js` for a complete working example.

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

### Graphify Knowledge Graph (Use Before Exploring Code)

The repo is indexed by graphify (skill: `~/.claude/skills/graphify/SKILL.md`) into `graphify-out/`:

- `graph.json` — nodes (components, hooks, services, pages, constants, docs) and edges (imports, calls, renders, uses), each with a `source_location`
- `GRAPH_REPORT.md` — communities (feature areas such as *Shared Table & Modal Components*, *Shifts, Breaks & Holidays*, *Licence Keys*, *Production Schedule Form*), god nodes and surprising links
- `graph.html` — interactive view for humans

#### When to Use It
Use the graph **first** for any task that needs codebase context: "where is X", "what uses Y", "how does Z flow", impact of a change, or finding the reference implementation to copy for a new screen. It answers in one call what would otherwise take many Grep/Read rounds.

#### Commands
```bash
graphify query "how does the machine form load controllers by brand"   # BFS, broad context
graphify query "save flow of production schedule" --dfs                # DFS, trace one path
graphify query "<question>" --budget 1500                              # cap output tokens
graphify path "ShiftFormModal" "breakService"                          # shortest link between two nodes
graphify explain "useTableSort"                                        # a node and its neighbours
graphify update .                                                      # refresh after code changes (no LLM)
```

#### Workflow
1. Query the graph (or skim `GRAPH_REPORT.md` for the matching community).
2. Read only the files the result points to, using their `source_location`.
3. Fall back to Grep/Glob when the graph has no answer or the result looks outdated.
4. After adding, renaming or deleting files, run `graphify update .` so the next session sees the change.

#### Rules
- Never hand-edit files in `graphify-out/`; regenerate them with graphify.
- Treat `INFERRED` / `AMBIGUOUS` edges as hints — confirm in the source before relying on them.
- The graph shows structure, not current behaviour: always read the actual code before editing it.

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
