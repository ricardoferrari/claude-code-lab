# Playwright MCP Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

1. **Install Playwright:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

2. **Configure MCP:**

Create `.mcp.json` in your project root:

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

---

## 🎯 Example Prompts to Try

### 1. Basic Page Testing

```
Using Playwright MCP, test the Angular app at http://localhost:4200:

1. Navigate to the home page
2. Verify it loads without errors
3. Check the page title
4. Take a screenshot
5. Report the results
```

### 2. Interactive Testing

```
Using Playwright MCP, interact with the task app:

1. Click the "New Task" button
2. Fill in the task form
3. Submit it
4. Verify the task appears in the list
5. Take before/after screenshots
```

### 3. Comprehensive Test Suite

```
Using Playwright MCP, run a complete test suite:

1. Page load test
2. Navigation test
3. Task creation workflow
4. Form validation
5. Responsive design (mobile, tablet, desktop)
6. Performance metrics
7. Generate a test report with all results
```

### 4. Visual Regression Testing

```
Using Playwright MCP:

1. Navigate to the dashboard
2. Wait for all content to load
3. Take a baseline screenshot
4. Store it for future comparisons
5. Report the visual state
```

### 5. Accessibility Audit

```
Using Playwright MCP with axe-core:

1. Audit the task app for accessibility issues
2. Check WCAG 2.1 compliance
3. Report violations by severity
4. Suggest fixes for critical issues
```

---

## 📋 Using the Example Script

### Run the Test Script Directly

```bash
# Make sure the Angular app is running first
cd hol-claude-code-lab/SampleApps/angular-task-app
npm install
npm start

# In another terminal, run the test
cd ../..
node playwright-angular-test.js
```

### Ask Claude to Run It

```
Using Playwright, run the test script I have at playwright-angular-test.js.
Make sure the Angular app is running first, then execute the tests and
show me the results.
```

---

## 🎨 Common Workflows

### Workflow 1: Validate New Feature

```
I just implemented a new feature in the Angular app. Using Playwright MCP:

1. Test the feature works as expected
2. Verify no existing functionality broke
3. Check responsive design
4. Take screenshots for documentation
5. If everything passes, help me create a PR
```

### Workflow 2: Debug UI Issue

```
There's a bug where the task form doesn't submit. Using Playwright MCP:

1. Navigate to the form
2. Try to reproduce the issue
3. Take screenshots at each step
4. Check console errors
5. Inspect the submit button state
6. Help me identify the root cause
```

### Workflow 3: Performance Investigation

```
The dashboard feels slow. Using Playwright MCP:

1. Measure load times
2. Check First Contentful Paint
3. Analyze resource loading
4. Identify bottlenecks
5. Suggest optimizations
```

### Workflow 4: Cross-Browser Testing

```
Using Playwright MCP, test the app in multiple browsers:

1. Chromium
2. Firefox
3. WebKit (Safari)

For each browser:
- Run the main user flows
- Take screenshots
- Report any browser-specific issues
```

---

## 🔧 Advanced Usage

### Custom Selectors

```
Using Playwright MCP, create a custom test that:

1. Uses data-testid attributes for stable selectors
2. Waits for network requests to complete
3. Handles loading states gracefully
4. Retries failed actions
5. Captures detailed error information
```

### Network Interception

```
Using Playwright MCP:

1. Intercept API calls to /api/tasks
2. Mock responses with test data
3. Verify the UI handles the data correctly
4. Test error states (500, 404, timeout)
```

### Video Recording

```
Using Playwright MCP with video recording:

1. Start recording
2. Walk through the complete task creation flow
3. Stop recording
4. Save the video as "task-creation-demo.webm"
5. Use it for documentation
```

---

## 📊 Integration with Other MCP Servers

### Playwright + GitHub

```
Complete test-and-deploy workflow:

1. Using Playwright MCP: Run full test suite
2. If tests pass, using GitHub MCP:
   - Create a PR
   - Add test screenshots as comments
   - Request review
3. Report completion
```

### Playwright + Slack

```
Automated QA notification:

1. Using Playwright MCP: Run nightly test suite
2. Capture all screenshots
3. Using Slack MCP: Post results to #qa channel
   - Include pass/fail summary
   - Attach screenshots
   - Mention @team if failures detected
```

### Playwright + Database

```
End-to-end data validation:

1. Using SQLite MCP: Insert test data
2. Using Playwright MCP: Verify UI displays it correctly
3. Using Playwright MCP: Submit changes via UI
4. Using SQLite MCP: Verify data persisted correctly
5. Report full cycle results
```

---

## 🐛 Troubleshooting

### MCP Server Not Starting

```
Check if Playwright MCP is working:

1. List all available MCP servers
2. Show me the Playwright tools available
3. If not working, help me debug the .mcp.json configuration
```

### Tests Timing Out

```
My Playwright tests are timing out. Help me:

1. Increase timeout settings
2. Add better wait conditions
3. Identify what's causing the delay
4. Optimize the test flow
```

### Screenshots Not Saving

```
Screenshots aren't being saved. Using Playwright MCP:

1. Check the screenshots directory exists
2. Verify write permissions
3. Try saving to a different location
4. Show me the saved files
```

---

## 📚 Learn More

**For complete details, see:**
- `playwright-mcp-guide.md` - Comprehensive guide with all features
- `playwright-angular-test.js` - Working example script

**Official Resources:**
- [Playwright Documentation](https://playwright.dev/)
- [MCP Documentation](https://code.claude.com/docs/en/mcp)
- [Claude Code Docs](https://code.claude.com/docs)

---

## ✨ Pro Tips

1. **Always wait for networkidle** before taking screenshots
2. **Use semantic selectors** (aria labels, text content) over CSS classes
3. **Take screenshots on failures** for easier debugging
4. **Test on multiple viewports** for responsive design
5. **Combine with other MCP servers** for powerful workflows
6. **Store baselines** in version control for visual regression testing
7. **Use headless mode** in CI/CD pipelines
8. **Record videos** for complex flows and bug reports

---

## 🎉 You're Ready!

Start testing your web applications with Claude and Playwright MCP!

**Try your first test now:**
```
Using Playwright MCP, test my Angular app and tell me if it's working correctly.
```
