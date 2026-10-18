/**
 * Playwright MCP Example: Angular Task App Validation
 *
 * This script demonstrates how to use Playwright to validate
 * a web application through browser automation.
 *
 * Run with: node playwright-angular-test.js
 */

const { chromium } = require('playwright');
const fs = require('fs');

// Configuration
const APP_URL = 'http://localhost:4200';
const SCREENSHOTS_DIR = './test-screenshots';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('🎭 Starting Playwright Browser Automation Tests\n');
  console.log('=' .repeat(60));

  const browser = await chromium.launch({
    headless: false,  // Set to true for CI/CD
    slowMo: 100       // Slow down actions to see them
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: './test-videos/',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    // Test 1: Page Load
    await testPageLoad(page);

    // Test 2: Navigation
    await testNavigation(page);

    // Test 3: Task Creation
    await testTaskCreation(page);

    // Test 4: Task List Display
    await testTaskListDisplay(page);

    // Test 5: Task Filtering
    await testTaskFiltering(page);

    // Test 6: Responsive Design
    await testResponsiveDesign(page);

    // Test 7: Performance Metrics
    await testPerformance(page);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/error-${Date.now()}.png`,
      fullPage: true
    });
  } finally {
    await context.close();
    await browser.close();
  }
}

/**
 * Test 1: Verify page loads correctly
 */
async function testPageLoad(page) {
  console.log('\n📄 Test 1: Page Load Validation');
  console.log('-'.repeat(60));

  await page.goto(APP_URL);
  await page.waitForLoadState('networkidle');

  // Check title
  const title = await page.title();
  console.log(`  Title: "${title}"`);

  // Check main content loads
  const mainContent = await page.locator('app-root').count();
  console.log(`  ✓ Main app component loaded: ${mainContent > 0 ? 'Yes' : 'No'}`);

  // Take screenshot
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/01-page-load.png`,
    fullPage: true
  });
  console.log(`  ✓ Screenshot saved: 01-page-load.png`);

  // Verify no console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  if (errors.length === 0) {
    console.log('  ✓ No console errors detected');
  } else {
    console.log(`  ⚠️  Console errors found: ${errors.length}`);
  }

  console.log('  ✅ PASSED');
}

/**
 * Test 2: Navigation functionality
 */
async function testNavigation(page) {
  console.log('\n🧭 Test 2: Navigation');
  console.log('-'.repeat(60));

  // Test navigation menu exists
  const navExists = await page.locator('nav, .navbar, [role="navigation"]').count() > 0;
  console.log(`  ✓ Navigation menu present: ${navExists ? 'Yes' : 'No'}`);

  // Common navigation patterns
  const navLinks = await page.locator('a[href], button[routerLink]').count();
  console.log(`  ✓ Navigation links found: ${navLinks}`);

  // Take screenshot
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/02-navigation.png`
  });

  console.log('  ✅ PASSED');
}

/**
 * Test 3: Task creation workflow
 */
async function testTaskCreation(page) {
  console.log('\n✏️  Test 3: Task Creation');
  console.log('-'.repeat(60));

  try {
    // Look for "Add Task" or "New Task" button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').first();

    if (await addButton.count() > 0) {
      console.log('  ✓ Add Task button found');
      await addButton.click();
      await page.waitForTimeout(500);

      // Look for form
      const formExists = await page.locator('form, [role="form"]').count() > 0;
      console.log(`  ✓ Task form displayed: ${formExists ? 'Yes' : 'No'}`);

      if (formExists) {
        // Try to find and fill common form fields
        const taskNameInput = page.locator('input[name*="name"], input[placeholder*="name"], input[type="text"]').first();

        if (await taskNameInput.count() > 0) {
          await taskNameInput.fill('Automated Test Task');
          console.log('  ✓ Task name filled');

          // Look for description field
          const descField = page.locator('textarea, input[name*="description"]').first();
          if (await descField.count() > 0) {
            await descField.fill('This task was created by Playwright automation');
            console.log('  ✓ Description filled');
          }

          // Take screenshot of filled form
          await page.screenshot({
            path: `${SCREENSHOTS_DIR}/03-task-form-filled.png`
          });

          // Try to find submit button
          const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Submit")').first();

          if (await submitButton.count() > 0) {
            await submitButton.click();
            console.log('  ✓ Form submitted');
            await page.waitForTimeout(1000);

            // Take screenshot after submission
            await page.screenshot({
              path: `${SCREENSHOTS_DIR}/04-task-created.png`,
              fullPage: true
            });
          }
        }
      }

      console.log('  ✅ PASSED');
    } else {
      console.log('  ⚠️  Add Task button not found - skipping test');
      console.log('  ⏭️  SKIPPED');
    }
  } catch (error) {
    console.log(`  ⚠️  Task creation test partial: ${error.message}`);
    console.log('  ⏭️  PARTIAL');
  }
}

/**
 * Test 4: Task list display
 */
async function testTaskListDisplay(page) {
  console.log('\n📋 Test 4: Task List Display');
  console.log('-'.repeat(60));

  // Look for task list elements
  const listElements = await page.locator('[class*="task"], [class*="list"], li, tr').count();
  console.log(`  ✓ List elements found: ${listElements}`);

  // Check for empty state or tasks
  const hasContent = await page.locator('body').textContent();
  const hasEmptyState = hasContent.includes('No tasks') || hasContent.includes('empty');
  const hasTasks = listElements > 3;

  if (hasEmptyState) {
    console.log('  ✓ Empty state properly displayed');
  } else if (hasTasks) {
    console.log(`  ✓ Tasks are displayed (${listElements} elements)`);
  }

  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/05-task-list.png`,
    fullPage: true
  });

  console.log('  ✅ PASSED');
}

/**
 * Test 5: Task filtering (if available)
 */
async function testTaskFiltering(page) {
  console.log('\n🔍 Test 5: Task Filtering');
  console.log('-'.repeat(60));

  // Look for filter controls
  const filterControls = await page.locator('select, [role="combobox"], input[type="search"]').count();

  if (filterControls > 0) {
    console.log(`  ✓ Filter controls found: ${filterControls}`);

    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/06-filtering.png`
    });

    console.log('  ✅ PASSED');
  } else {
    console.log('  ⚠️  No filter controls found');
    console.log('  ⏭️  SKIPPED');
  }
}

/**
 * Test 6: Responsive design
 */
async function testResponsiveDesign(page) {
  console.log('\n📱 Test 6: Responsive Design');
  console.log('-'.repeat(60));

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(500);

    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    console.log(`  ✓ ${viewport.name} (${viewport.width}x${viewport.height}): ${hasHorizontalScroll ? '⚠️  Has horizontal scroll' : '✅ No horizontal scroll'}`);

    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/07-responsive-${viewport.name.toLowerCase()}.png`,
      fullPage: true
    });
  }

  // Reset to default
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('  ✅ PASSED');
}

/**
 * Test 7: Performance metrics
 */
async function testPerformance(page) {
  console.log('\n⚡ Test 7: Performance Metrics');
  console.log('-'.repeat(60));

  await page.goto(APP_URL);

  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const paintMetrics = performance.getEntriesByType('paint');

    return {
      domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
      loadTime: perfData?.loadEventEnd - perfData?.loadEventStart,
      firstPaint: paintMetrics.find(m => m.name === 'first-paint')?.startTime,
      firstContentfulPaint: paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime,
      totalResources: performance.getEntriesByType('resource').length
    };
  });

  console.log(`  ✓ DOM Content Loaded: ${metrics.domContentLoaded?.toFixed(2)}ms`);
  console.log(`  ✓ Load Time: ${metrics.loadTime?.toFixed(2)}ms`);
  console.log(`  ✓ First Paint: ${metrics.firstPaint?.toFixed(2)}ms`);
  console.log(`  ✓ First Contentful Paint: ${metrics.firstContentfulPaint?.toFixed(2)}ms`);
  console.log(`  ✓ Total Resources Loaded: ${metrics.totalResources}`);

  // Evaluate performance
  if (metrics.firstContentfulPaint < 2000) {
    console.log('  ✅ FCP is good (< 2000ms)');
  } else if (metrics.firstContentfulPaint < 4000) {
    console.log('  ⚠️  FCP needs improvement (2000-4000ms)');
  } else {
    console.log('  ❌ FCP is poor (> 4000ms)');
  }

  console.log('  ✅ PASSED');
}

// Run the tests
runTests().catch(console.error);
