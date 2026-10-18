# Playwright Tests for Angular Task App

This directory contains Playwright browser automation tests for the Angular Task Application.

## 📋 Contents

- **`playwright-angular-test.js`** - Comprehensive automated test suite
- **`PLAYWRIGHT-QUICKSTART.md`** - Quick reference guide for using Playwright MCP

## 🚀 Quick Start

### Prerequisites

1. **Install Playwright:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

2. **Configure Playwright MCP:**

Create `.mcp.json` in the project root (or add to existing):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

3. **Restart Claude Code:**
```bash
exit
claude
```

## 🎯 Running Tests

### Option 1: Using Claude Code with MCP

Start the Angular app:
```bash
cd hol-claude-code-lab/SampleApps/angular-task-app
npm start
```

Then ask Claude:
```
Using Playwright MCP, test the Angular task app at http://localhost:4200.
Run the full test suite and report results.
```

### Option 2: Run the Test Script Directly

```bash
# Make sure the app is running
npm start

# In another terminal, run tests
cd playwright-tests
node playwright-angular-test.js
```

## 📦 Test Suite Coverage

The automated test suite includes:

1. **Page Load Validation** - Verifies the app loads correctly
2. **Navigation Testing** - Tests menu and routing
3. **Task Creation** - Tests the task creation workflow
4. **Task List Display** - Validates task list rendering
5. **Task Filtering** - Tests filter functionality
6. **Responsive Design** - Tests mobile, tablet, and desktop views
7. **Performance Metrics** - Measures load times and Web Vitals

## 🎨 Example Prompts

### Basic Testing
```
Using Playwright MCP, verify the Angular task app loads correctly
and take a screenshot of the home page.
```

### Feature Testing
```
Using Playwright MCP, test the task creation feature:
1. Click "New Task"
2. Fill the form
3. Submit
4. Verify the task appears in the list
```

### Responsive Design
```
Using Playwright MCP, test responsive design at mobile (375x667),
tablet (768x1024), and desktop (1920x1080) sizes. Take screenshots
of each.
```

### Performance Testing
```
Using Playwright MCP, measure performance metrics and report if
the app meets Web Vitals thresholds.
```

## 📸 Screenshots

Screenshots are automatically saved to `./test-screenshots/` when tests run.

## 🎥 Video Recording

Tests can record videos of test execution. Videos are saved to `./test-videos/`.

## 🔍 Debugging Failed Tests

When a test fails:
1. Check `./test-screenshots/` for error state screenshots
2. Review console output for error messages
3. Ask Claude to analyze the failure:

```
A Playwright test failed. Help me debug it by:
1. Analyzing the error screenshot
2. Checking the error message
3. Suggesting fixes
```

## 📚 Additional Resources

- **Playwright Documentation**: https://playwright.dev/
- **MCP Playwright Server**: https://github.com/modelcontextprotocol/servers
- **Lab 5 - MCP Integration**: See Step 7 for Playwright details

## 💡 Best Practices

1. **Use semantic selectors** - Prefer aria-labels and text over CSS classes
2. **Wait for network idle** - Ensure pages fully load before testing
3. **Take screenshots** - Capture visual evidence of test states
4. **Test multiple viewports** - Verify responsive behavior
5. **Measure performance** - Track Core Web Vitals

## 🎓 Learning Path

1. Start with **PLAYWRIGHT-QUICKSTART.md** for basic usage
2. Review `playwright-angular-test.js` to see test patterns
3. Try the example prompts above with Claude Code
4. Create your own custom tests for new features

## 🔗 Related Lab Sections

This testing suite is covered in:
- **Lab 5 - MCP Integration** (Step 7: Playwright MCP for Browser Automation)

Happy testing! 🎭
