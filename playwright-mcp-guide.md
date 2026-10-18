# Playwright MCP Integration - Deep Dive Guide

## 🎭 What is Playwright MCP?

**Playwright MCP** is a Model Context Protocol server that gives Claude Code direct control over browser automation through Playwright. This enables Claude to:

- **Launch and control browsers** (Chromium, Firefox, WebKit)
- **Navigate web pages** and interact with elements
- **Fill forms** and submit data
- **Take screenshots** and record videos
- **Validate UI implementations** in real browsers
- **Run end-to-end tests** automatically
- **Debug visual issues** by inspecting rendered content

### Why Use Playwright MCP?

| Without Playwright MCP | With Playwright MCP |
|------------------------|---------------------|
| Write tests manually | Claude writes and runs tests |
| Can't verify visual behavior | Test actual browser rendering |
| Separate testing workflow | Integrated validation in chat |
| Manual screenshot comparison | Automated visual testing |
| Debug blind (from code only) | See what users see |

---

## 🚀 Setup: Installing Playwright MCP

### Step 1: Install Playwright MCP Server

```bash
npm install -g @playwright/test
npx playwright install
```

### Step 2: Configure MCP in Claude Code

Create or update `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

**Alternative: User-level configuration** (available in all projects)

Add to `~/.claude/mcp.json`:

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

### Step 3: Restart Claude Code

```bash
exit
claude
```

### Step 4: Verify Installation

**Prompt to try:**
```
Using the Playwright MCP server, list the available browser automation tools.
```

---

## 🎯 Practical Example: Validating the Angular Task App

Let's use Playwright MCP to validate the Angular Task Application from the lab.

### Scenario: Automated UI Testing

You've implemented a new feature in the Angular task app. Let's validate it works correctly in the browser.

### Example 1: Basic Page Load Test

**Prompt to try:**
```
Using Playwright MCP, test the Angular task app:

1. Start the dev server on localhost:4200
2. Launch a browser
3. Navigate to http://localhost:4200
4. Verify the page loads successfully
5. Check that the title contains "Task"
6. Take a screenshot
7. Report the results
```

**What Claude will do:**

1. **Launch Browser:**
```javascript
const browser = await playwright.chromium.launch({ headless: false });
const page = await browser.newPage();
```

2. **Navigate:**
```javascript
await page.goto('http://localhost:4200');
await page.waitForLoadState('networkidle');
```

3. **Verify:**
```javascript
const title = await page.title();
console.assert(title.includes('Task'), 'Title should contain "Task"');
```

4. **Screenshot:**
```javascript
await page.screenshot({ path: 'task-app-home.png', fullPage: true });
```

5. **Report:**
```
✅ Page loaded successfully
✅ Title: "Angular Task Application"
✅ Screenshot saved: task-app-home.png
```

### Example 2: Testing Task Creation Flow

**Prompt to try:**
```
Using Playwright MCP, validate the task creation feature:

1. Navigate to the task app
2. Click the "New Task" button
3. Fill in the form:
   - Task Name: "Test Data Processing"
   - Description: "Process customer data batch"
   - Priority: "High"
4. Submit the form
5. Verify the new task appears in the task list
6. Take a screenshot of the result
7. Report success or failure with details
```

**Claude's automation:**

```javascript
// Navigate to app
await page.goto('http://localhost:4200');

// Click New Task button
await page.click('button:has-text("New Task")');

// Wait for form to appear
await page.waitForSelector('form.task-form');

// Fill the form
await page.fill('input[name="taskName"]', 'Test Data Processing');
await page.fill('textarea[name="description"]', 'Process customer data batch');
await page.selectOption('select[name="priority"]', 'High');

// Submit
await page.click('button[type="submit"]');

// Wait for task list to update
await page.waitForTimeout(1000);

// Verify task appears
const taskList = await page.textContent('.task-list');
const taskExists = taskList.includes('Test Data Processing');

// Take screenshot
await page.screenshot({ 
  path: 'task-created.png',
  fullPage: true 
});

// Report
if (taskExists) {
  console.log('✅ Task created successfully and appears in list');
} else {
  console.log('❌ Task creation failed - task not found in list');
}
```

### Example 3: Visual Regression Testing

**Prompt to try:**
```
Using Playwright MCP, perform visual regression testing:

1. Navigate to the dashboard page
2. Wait for all charts to load
3. Take a baseline screenshot
4. Compare with previous baseline (if exists)
5. Highlight any visual differences
6. Generate a comparison report
```

**Implementation:**

```javascript
const { chromium } = require('playwright');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const fs = require('fs');

// Launch browser
const browser = await chromium.launch();
const page = await browser.newPage();

// Navigate to dashboard
await page.goto('http://localhost:4200/dashboard');

// Wait for all charts to render
await page.waitForSelector('.chart-container', { state: 'visible' });
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000); // Let animations complete

// Take current screenshot
await page.screenshot({ 
  path: 'dashboard-current.png',
  fullPage: true 
});

// Compare with baseline
if (fs.existsSync('dashboard-baseline.png')) {
  const baseline = PNG.sync.read(fs.readFileSync('dashboard-baseline.png'));
  const current = PNG.sync.read(fs.readFileSync('dashboard-current.png'));
  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  
  const numDiffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );
  
  // Save diff image
  fs.writeFileSync('dashboard-diff.png', PNG.sync.write(diff));
  
  const diffPercentage = (numDiffPixels / (width * height)) * 100;
  
  console.log(`Visual diff: ${diffPercentage.toFixed(2)}% different`);
  
  if (diffPercentage > 5) {
    console.log('⚠️  Significant visual changes detected!');
  } else {
    console.log('✅ Visual appearance matches baseline');
  }
} else {
  // Save as baseline
  fs.copyFileSync('dashboard-current.png', 'dashboard-baseline.png');
  console.log('✅ Baseline screenshot saved');
}

await browser.close();
```

---

## 🔍 Advanced Use Cases

### Use Case 1: Form Validation Testing

**Prompt to try:**
```
Using Playwright MCP, test all form validation rules:

1. Try submitting empty form - should show validation errors
2. Enter invalid email - should show email error
3. Enter valid data - should submit successfully
4. Test edge cases (special characters, max length)
5. Generate a test report with pass/fail for each validation rule
```

**Example validation test:**

```javascript
const validationTests = [
  {
    name: 'Empty form submission',
    action: async () => {
      await page.click('button[type="submit"]');
      const errors = await page.locator('.validation-error').count();
      return errors > 0;
    },
    expected: true,
    description: 'Should show validation errors'
  },
  {
    name: 'Invalid email format',
    action: async () => {
      await page.fill('input[type="email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      const emailError = await page.textContent('.email-error');
      return emailError.includes('valid email');
    },
    expected: true,
    description: 'Should show email format error'
  },
  {
    name: 'Valid submission',
    action: async () => {
      await page.fill('input[name="name"]', 'John Doe');
      await page.fill('input[type="email"]', 'john@example.com');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      const success = await page.locator('.success-message').count();
      return success > 0;
    },
    expected: true,
    description: 'Should submit successfully'
  }
];

// Run all tests
const results = [];
for (const test of validationTests) {
  const result = await test.action();
  const passed = result === test.expected;
  results.push({
    name: test.name,
    passed,
    description: test.description
  });
  console.log(`${passed ? '✅' : '❌'} ${test.name}: ${test.description}`);
}

// Summary
const totalTests = results.length;
const passedTests = results.filter(r => r.passed).length;
console.log(`\nTest Summary: ${passedTests}/${totalTests} passed`);
```

### Use Case 2: Responsive Design Testing

**Prompt to try:**
```
Using Playwright MCP, test responsive design:

1. Test the app at different viewport sizes:
   - Mobile: 375x667 (iPhone)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080
2. For each size:
   - Take a screenshot
   - Verify navigation menu adapts correctly
   - Check that content is readable
   - Ensure no horizontal scroll
3. Generate a responsive design report
```

**Implementation:**

```javascript
const viewports = [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop HD', width: 1920, height: 1080 }
];

for (const viewport of viewports) {
  console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
  
  // Set viewport
  await page.setViewportSize({ 
    width: viewport.width, 
    height: viewport.height 
  });
  
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ 
    path: `responsive-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
    fullPage: true 
  });
  
  // Check for horizontal scroll
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  
  // Check navigation
  const navVisible = await page.isVisible('nav');
  const hamburgerVisible = await page.isVisible('.hamburger-menu');
  
  // Report
  console.log(`  ✓ Screenshot captured`);
  console.log(`  ${hasHorizontalScroll ? '❌' : '✅'} No horizontal scroll`);
  console.log(`  ${navVisible || hamburgerVisible ? '✅' : '❌'} Navigation accessible`);
}
```

### Use Case 3: Accessibility Testing

**Prompt to try:**
```
Using Playwright MCP with axe-core, run accessibility audit:

1. Navigate to all main pages
2. Run axe accessibility checks
3. Report WCAG violations by severity
4. Suggest fixes for critical issues
5. Generate accessibility compliance report
```

**Implementation:**

```javascript
const { injectAxe, checkA11y } = require('axe-playwright');

await page.goto('http://localhost:4200');
await injectAxe(page);

// Run accessibility check
const results = await checkA11y(page, null, {
  detailedReport: true,
  detailedReportOptions: { html: true }
});

// Categorize violations
const violations = {
  critical: [],
  serious: [],
  moderate: [],
  minor: []
};

results.violations.forEach(violation => {
  violations[violation.impact].push({
    rule: violation.id,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.length
  });
});

// Report
console.log('🔍 Accessibility Audit Results\n');

for (const [severity, issues] of Object.entries(violations)) {
  if (issues.length > 0) {
    console.log(`\n${severity.toUpperCase()}: ${issues.length} issue(s)`);
    issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue.description}`);
      console.log(`     Rule: ${issue.rule}`);
      console.log(`     Affected elements: ${issue.nodes}`);
      console.log(`     More info: ${issue.helpUrl}`);
    });
  }
}

const totalViolations = Object.values(violations)
  .reduce((sum, arr) => sum + arr.length, 0);

console.log(`\n📊 Summary: ${totalViolations} total violations found`);
```

### Use Case 4: Performance Testing

**Prompt to try:**
```
Using Playwright MCP, measure performance metrics:

1. Navigate to the dashboard
2. Measure:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Total Blocking Time (TBT)
3. Compare against Web Vitals thresholds
4. Identify performance bottlenecks
5. Generate performance report
```

**Implementation:**

```javascript
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

// Collect performance metrics
const metrics = await page.evaluate(() => {
  return new Promise((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const navigationEntry = entries.find(
        e => e.entryType === 'navigation'
      );
      
      resolve({
        // Core Web Vitals
        FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        LCP: navigationEntry?.largestContentfulPaint,
        TTI: navigationEntry?.domInteractive,
        
        // Additional metrics
        domContentLoaded: navigationEntry?.domContentLoadedEventEnd,
        loadComplete: navigationEntry?.loadEventEnd,
        
        // Resource metrics
        resourceCount: performance.getEntriesByType('resource').length,
        totalTransferSize: performance.getEntriesByType('resource')
          .reduce((sum, r) => sum + (r.transferSize || 0), 0)
      });
    }).observe({ entryTypes: ['navigation', 'paint'] });
  });
});

await page.goto('http://localhost:4200/dashboard');
await page.waitForLoadState('networkidle');

// Evaluate against thresholds
const thresholds = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTI: { good: 3800, poor: 7300 }
};

console.log('⚡ Performance Metrics\n');

for (const [metric, value] of Object.entries(metrics)) {
  if (thresholds[metric]) {
    const threshold = thresholds[metric];
    const status = value <= threshold.good ? '✅ Good' :
                   value <= threshold.poor ? '⚠️  Needs Improvement' :
                   '❌ Poor';
    console.log(`${metric}: ${value.toFixed(2)}ms ${status}`);
  }
}

console.log(`\nTotal Resources: ${metrics.resourceCount}`);
console.log(`Total Transfer Size: ${(metrics.totalTransferSize / 1024).toFixed(2)} KB`);

await browser.close();
```

---

## 🎓 Best Practices

### 1. Use Selectors Wisely

```javascript
// ❌ Fragile - breaks if HTML changes
await page.click('div > div > button:nth-child(3)');

// ✅ Robust - semantic and stable
await page.click('button[aria-label="Create New Task"]');
await page.click('text=Submit');
await page.click('[data-testid="submit-button"]');
```

### 2. Wait for Elements Properly

```javascript
// ❌ Arbitrary timeout
await page.waitForTimeout(3000);

// ✅ Wait for specific conditions
await page.waitForSelector('.task-list', { state: 'visible' });
await page.waitForLoadState('networkidle');
await page.waitForResponse(response => 
  response.url().includes('/api/tasks') && response.status() === 200
);
```

### 3. Handle Errors Gracefully

```javascript
try {
  await page.click('button:has-text("Submit")', { timeout: 5000 });
  console.log('✅ Form submitted successfully');
} catch (error) {
  await page.screenshot({ path: 'error-state.png' });
  console.log('❌ Submit button not found or not clickable');
  console.log('Error details:', error.message);
  throw error;
}
```

### 4. Clean Up Resources

```javascript
// Always close browser contexts
try {
  // Your test code
  await page.goto('...');
  // ...
} finally {
  await browser.close();
}
```

---

## 🚀 Complete Workflow Example

Here's a complete workflow combining MCP servers for an end-to-end development cycle:

**Prompt to try:**
```
Complete workflow: Validate and deploy the Angular task app

1. Using Playwright MCP:
   - Run the full test suite in the browser
   - Capture screenshots of all pages
   - Run accessibility audit
   - Check responsive design

2. If all tests pass, using GitHub MCP:
   - Create a PR with test results
   - Add screenshots as PR comments
   - Tag for review

3. Using Slack MCP:
   - Post test summary to #development channel
   - Include pass/fail stats and screenshots

Walk me through each step with results.
```

---

## 📚 Additional Resources

- **Playwright Documentation**: https://playwright.dev/
- **MCP Playwright Server**: https://github.com/modelcontextprotocol/servers/tree/main/src/playwright
- **Web Vitals**: https://web.dev/vitals/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 🎉 Summary

With Playwright MCP, you can:

✅ **Test in real browsers** - See exactly what users see  
✅ **Automate UI validation** - No more manual testing  
✅ **Catch visual regressions** - Compare screenshots automatically  
✅ **Ensure accessibility** - WCAG compliance checking  
✅ **Measure performance** - Core Web Vitals tracking  
✅ **Integrate with workflow** - Combined with other MCP servers  

**Next Steps:**
1. Set up Playwright MCP in your project
2. Start with basic page load tests
3. Add form validation tests
4. Implement visual regression testing
5. Create automated test suites
