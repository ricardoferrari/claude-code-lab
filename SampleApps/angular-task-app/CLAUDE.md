# Angular Task App - Development Standards

## Project Overview
This is an Angular task management application that demonstrates best practices for code quality, maintainability, and security.

## Code Quality Standards

### 1. No Dead Code Policy
**Standard:** The codebase must be free of commented-out code.

- ❌ Never commit commented-out code blocks
- ❌ Never leave disabled functionality in comments
- ✅ Use version control (git) to track historical changes
- ✅ Delete unused code completely rather than commenting it out

**Exception:** Documentation comments (JSDoc) and instructional comments are encouraged.

### 2. No Technical Debt Markers
**Standard:** Avoid TODO, FIXME, HACK, XXX markers in production code.

- ❌ Don't commit code with TODO comments
- ✅ Create GitHub issues or tickets instead
- ✅ Complete work before committing or document in issue tracker
- ✅ If absolutely necessary, include a ticket reference: `// TODO: Fix pagination (Issue #123)`

### 3. DRY Principle (Don't Repeat Yourself)
**Standard:** Minimize code duplication through abstraction and reuse.

#### Current Duplication to Avoid:
**Error Handling Pattern** - Extract common error handlers:
```typescript
// ❌ Bad: Duplicate error handling
loadTasks() {
  this.service.getTasks().subscribe({
    error: (err) => {
      this.error = 'Failed to load tasks';
      console.error('Error loading:', err);
    }
  });
}

// ✅ Good: Reusable error handler
private handleError(message: string) {
  return (err: any) => {
    this.error = message;
    console.error(message, err);
  };
}

loadTasks() {
  this.service.getTasks().subscribe({
    error: this.handleError('Failed to load tasks')
  });
}
```

**Acceptable Duplication:**
- Angular decorators (`@Injectable`, `@Component`)
- Environment configuration structure
- Standard import statements
- Framework boilerplate

### 4. Documentation Standards

#### JSDoc Requirements
All public methods, interfaces, and complex logic must have JSDoc comments:

```typescript
/**
 * Retrieves all tasks from the API.
 * @returns Observable<Task[]> Stream of task arrays
 */
getTasks(): Observable<Task[]> {
  return this.api.get<Task[]>('/tasks');
}
```

#### Comment Guidelines
- **DO** explain WHY, not WHAT
- **DO** document non-obvious business logic
- **DO** add JSDoc for public APIs
- **DON'T** write redundant comments
- **DON'T** comment obvious code

```typescript
// ❌ Bad: Redundant comment
// Increment counter by 1
counter++;

// ✅ Good: Explains WHY
// Skip validation for legacy tasks migrated before 2024
if (task.createdDate < '2024-01-01') {
  return true;
}
```

### 5. Angular-Specific Standards

#### Service Architecture
- Use `providedIn: 'root'` for singleton services
- Implement proper error handling with `catchError`
- Use RxJS operators for data transformation
- Return Observables from API calls

#### Component Guidelines
- Keep components focused on presentation
- Delegate business logic to services
- Unsubscribe from observables in `ngOnDestroy`
- Use async pipe when possible to avoid manual subscription management

#### Type Safety
- Define interfaces for all data models
- Avoid using `any` type
- Use enums for fixed value sets (Status, Priority)
- Enable strict TypeScript compiler options

### 6. Error Handling Standards

#### API Service Layer
```typescript
private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    console.error('Client error:', error.error.message);
  } else {
    // Server-side error
    console.error(`Server error ${error.status}:`, error.message);
  }
  return throwError(() => new Error('Operation failed. Please try again.'));
}
```

#### Component Layer
- Display user-friendly error messages
- Log detailed errors to console
- Clear error state on successful operations
- Consider error boundaries for critical sections

### 7. Testing Standards

#### Unit Tests
- Test coverage target: 80% minimum
- Test all public methods
- Mock external dependencies
- Use descriptive test names

#### E2E Tests
- Playwright tests for critical user flows
- Test responsive behavior
- Validate performance metrics
- Screenshot verification for visual regression

### 8. Security Standards

#### Input Validation
- Validate all user inputs
- Sanitize data before rendering
- Use Angular's built-in XSS protection
- Implement proper CSRF protection

#### API Security
- Never expose sensitive data in client code
- Use environment variables for configuration
- Implement proper authentication/authorization
- Validate server responses

### 9. Performance Standards

#### Bundle Size
- Keep bundle size under 500KB (gzipped)
- Lazy load feature modules
- Tree-shake unused dependencies

#### Runtime Performance
- Page load < 2 seconds
- Time to Interactive (TTI) < 3 seconds
- Lighthouse performance score > 90

### 10. Git Commit Standards

#### Commit Messages
Follow conventional commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Test additions/changes
- `chore:` Build/tooling changes

**Example:**
```
feat(task-list): add error handler abstraction

Extract duplicate error handling logic into reusable method
to reduce boilerplate and improve maintainability.

Closes #42

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Code Review Checklist

Before submitting a PR, verify:

- [ ] No commented-out code
- [ ] No TODO/FIXME markers (or linked to issues)
- [ ] No code duplication
- [ ] All public methods have JSDoc
- [ ] Error handling implemented
- [ ] Type safety maintained (no `any`)
- [ ] Tests added/updated
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Git commit follows conventions

## Continuous Improvement

### Quality Metrics Dashboard
Monitor these metrics:
- Code coverage: Target 80%+
- Duplication ratio: Target < 3%
- Technical debt ratio: Target < 5%
- Linting issues: Target 0

### Regular Audits
Run these analyses monthly:
1. Duplicate code detection
2. TODO/FIXME scan
3. Dead code detection
4. Dependency vulnerability scan
5. Bundle size analysis

## Tools and Commands

### Code Quality
```bash
# Run linter
npm run lint

# Run tests with coverage
npm run test -- --code-coverage

# Build for production
npm run build

# Run E2E tests
cd playwright-tests && node playwright-angular-test.js
```

### Analysis
```bash
# Find duplicated code
npx jscpd src/

# Find TODO comments
grep -r "TODO\|FIXME\|XXX\|HACK" src/

# Security audit
npm audit

# Bundle analysis
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## References

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [RxJS Best Practices](https://rxjs.dev/guide/overview)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated:** 2026-11-02  
**Maintained By:** Development Team  
**Review Cycle:** Quarterly
