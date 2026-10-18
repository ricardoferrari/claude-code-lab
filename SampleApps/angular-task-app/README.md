# Angular Task Application

A frontend application for managing data processing tasks and viewing analytics.

## Overview

This Angular application provides a user interface for:
- Managing data processing tasks
- Monitoring task status
- Viewing analytics dashboards
- Configuring processing jobs
- Viewing historical results

## Features

- **Task Management**: Create, update, and delete processing tasks
- **Real-time Status**: Monitor task execution in real-time
- **Analytics Dashboard**: Visualize processing metrics
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive unit and integration tests

## Project Structure

```
angular-task-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-list/        # Task list component
│   │   │   ├── task-detail/      # Task detail view
│   │   │   └── dashboard/        # Analytics dashboard
│   │   ├── services/
│   │   │   ├── api.service.ts    # API communication
│   │   │   ├── task.service.ts   # Task management logic
│   │   │   └── auth.service.ts   # Authentication
│   │   ├── models/
│   │   │   └── task.model.ts     # Data models
│   │   └── app.component.ts      # Root component
│   ├── assets/                    # Static assets
│   └── environments/              # Environment configs
├── package.json                   # npm dependencies
├── angular.json                   # Angular CLI config
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Angular CLI (optional but recommended)

## Setup

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Angular CLI globally (optional):
   ```bash
   npm install -g @angular/cli
   ```

## Development

### Run Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

### Run Tests

```bash
# Run unit tests
npm test
# or
ng test

# Run tests with coverage
npm run test:coverage
# or
ng test --code-coverage

# Run end-to-end tests
npm run e2e
# or
ng e2e
```

### Browser Automation Tests (Playwright)

This project includes Playwright browser automation tests using MCP integration:

```bash
# See playwright-tests/ directory for:
# - Automated test suite
# - Playwright MCP quickstart guide
# - Test examples and prompts
```

**Using Claude Code with Playwright MCP:**
```
Using Playwright MCP, test the Angular task app and report results.
```

See `playwright-tests/README.md` for complete testing documentation.

### Linting

```bash
npm run lint
# or
ng lint
```

### Code Formatting

```bash
# Format code with Prettier
npm run format
```

## Configuration

### Environment Variables

The app uses environment files for configuration:

- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

Configure API endpoints and other settings here:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### API Integration

The application expects a REST API with these endpoints:

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/analytics` - Get analytics data

## Development Guidelines

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Prefer interfaces over types
- Use reactive patterns with RxJS
- Component files: kebab-case
- Classes: PascalCase
- Variables/functions: camelCase

### Component Structure

```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  // Properties
  // Constructor
  // Lifecycle hooks
  // Public methods
  // Private methods
}
```

### Testing Guidelines

- Write tests for all components and services
- Use TestBed for component testing
- Mock dependencies in unit tests
- Test both happy paths and error scenarios

## Common Tasks

### Add New Component

```bash
ng generate component components/my-component
```

### Add New Service

```bash
ng generate service services/my-service
```

### Add New Module

```bash
ng generate module my-module
```

## Troubleshooting

### Port Already in Use

Change the port in `angular.json` or use:
```bash
ng serve --port 4201
```

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Test Failures

Clear Karma cache:
```bash
rm -rf .angular
npm test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Run linter and tests
4. Submit pull request

## License

MIT License - See LICENSE file for details.
