# Lab 6 - MCP Integration

#### Duration: 30 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Understand what Model Context Protocol (MCP) is
- Learn how to connect external tools and data sources
- Set up and configure MCP servers
- Integrate with common services (filesystems, databases, APIs)
- Build custom MCP integrations for your workflow

## 🔌 What is MCP?

**Model Context Protocol (MCP)** is an open standard for connecting AI tools to external data sources and services. Think of it as a universal adapter that lets Claude Code talk to:

- **File systems and databases**
- **APIs and web services** (GitHub, Slack, Jira)
- **Cloud storage** (Google Drive, S3)
- **Development tools** (Git, Docker)
- **Your custom tools** and internal systems

### Why MCP Matters

Without MCP:
- Claude only knows what's in your local project
- Can't access external documentation
- Can't update tickets or send notifications
- Limited to local filesystem

With MCP:
- Claude can read your Confluence docs
- Update Jira tickets automatically
- Pull data from databases
- Send Slack notifications
- Access any system you connect!

## 🏗️ How MCP Works

```
Claude Code
    ↕️ (MCP Protocol)
MCP Server (e.g., GitHub MCP Server)
    ↕️ (API Calls)
External Service (e.g., GitHub API)
```

**MCP Server**: A small program that:
- Exposes tools Claude can use
- Handles authentication
- Translates between MCP and the external service

**You configure**: Which MCP servers to run
**Claude uses**: Tools exposed by those servers

## 📋 Step 1: Understanding MCP Configuration

MCP servers are configured in a `.mcp.json` file in your project or user directory.

### Basic Configuration Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

### Where to Place Configuration

**Project-level**: `.mcp.json` in project root
- Available only in that project
- Shared with team via git

**User-level**: `~/.claude/mcp.json`
- Available in all projects
- Personal configuration

## 🚀 Step 2: Your First MCP Server (Filesystem)

Let's start with a simple built-in MCP server: filesystem access.

### Create MCP Configuration

Navigate to your project:

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
```

Ask Claude to help set it up:

**Prompt to try:**
```
Help me set up the filesystem MCP server so you can access files outside this project directory. I want to give you read access to my Documents folder.
```

Claude will help create or update `.mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/Documents"]
    }
  }
}
```

### Test the MCP Server

**Restart Claude Code** to load the MCP configuration:

```bash
exit
claude
```

**Prompt to try:**
```
List the files in my Documents folder using the MCP filesystem server.
```

**What to observe:**
- Claude now has access beyond the project!
- Can read files you've granted access to
- Shows MCP tool usage in output

## 🗄️ Step 3: Database MCP Integration

Let's connect to a SQLite database so Claude can query data.

### Set Up SQLite MCP Server

**Prompt to try:**
```
Help me set up the SQLite MCP server to connect to a database at ./data/analytics.db. Create the configuration and verify it works.
```

Expected `.mcp.json` addition:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "./data/analytics.db"]
    }
  }
}
```

### Use Database Access

Create a sample database first:

**Prompt to try:**
```
Create a SQLite database at ./data/analytics.db with a simple schema:
- Table: processed_data
- Columns: id (primary key), filename, processed_date, record_count, status

Insert some sample data.
```

Now query it via MCP:

```
Using the SQLite MCP server, query the processed_data table and show me all records from the last 7 days.
```

**Key insight**: Claude can now work with databases directly!

## 🐙 Step 4: GitHub MCP Integration

Connect Claude to GitHub to manage issues and PRs.

### Setup GitHub MCP Server

**Prerequisites**:
- GitHub personal access token
- `gh` CLI tool installed

**Prompt to try:**
```
Help me set up the GitHub MCP server. I want you to be able to:
- Read issues and PRs
- Create and update issues
- Comment on PRs
- Check CI/CD status

Guide me through getting a GitHub token and configuring the MCP server.
```

Configuration example:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Use GitHub Integration

**Prompt to try:**
```
Using the GitHub MCP server:
1. List all open issues in this repository
2. Create a new issue titled "Add input validation" with a description of validation improvements needed
3. Show me the CI/CD status of the latest PR
```

**What Claude can now do:**
- Automatically create issues for bugs found
- Update issues with progress
- Review PR status
- Much more!

## 💬 Step 5: Slack MCP Integration

Connect to Slack for notifications and updates.

### Setup Slack MCP Server

**Prerequisites**:
- Slack workspace
- Slack Bot Token (starts with `xoxb-`)

**Prompt to try:**
```
Help me set up Slack MCP integration. I want you to be able to:
- Send messages to specific channels
- Read recent messages
- Update thread conversations

Guide me through creating a Slack app and getting the bot token.
```

Configuration:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

### Use Slack Integration

**Prompt to try:**
```
Using the Slack MCP server:
1. Send a message to #development channel: "Code review complete. Found 3 issues, all resolved."
2. Read the last 5 messages from #development
```

**Real-world scenarios:**
```
After completing the test suite, send a summary to #ci-cd channel including pass/fail counts and coverage percentage.
```

```
If you find any critical security issues, immediately post to #security-alerts with details.
```

## 🌐 Step 6: Web Search MCP Integration

Enable Claude to search the web for current information.

### Setup Web Search MCP Server

**Prompt to try:**
```
Help me set up the Brave Search MCP server so you can search the web for:
- API documentation
- Error message solutions
- Library usage examples
- Current best practices
```

Configuration:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-brave-api-key"
      }
    }
  }
}
```

### Use Web Search

**Prompt to try:**
```
Using web search, find the latest best practices for Python async/await error handling. Then apply those patterns to our data processor.
```

**Powerful combination:**
```
Search for solutions to this error: [paste error]
Then fix the code based on what you find.
```

## 🎭 Step 7: Playwright MCP for Browser Automation

Test and validate web applications using real browser automation.

### What is Playwright MCP?

**Playwright MCP** gives Claude the ability to control browsers and test web applications. This is incredibly powerful for:

- **Testing UI implementations** in real browsers
- **Validating user interactions** (clicks, forms, navigation)
- **Taking screenshots** for documentation or bug reports
- **Running end-to-end tests** automatically
- **Checking responsive design** across different viewports
- **Measuring performance** (load times, Core Web Vitals)
- **Accessibility audits** for WCAG compliance

### Setup Playwright MCP Server

First, install Playwright:

```bash
npm install -D @playwright/test
npx playwright install chromium
```

**Prompt to try:**
```
Help me set up the Playwright MCP server for browser automation testing.
I want to be able to test web applications in real browsers.
```

Configuration in `.mcp.json`:

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

**Restart Claude** to load the configuration:

```bash
exit
claude
```

### Example 1: Test the Angular Task App

Let's test the Angular application from the lab!

First, start the app (in a separate terminal):

```bash
cd hol-claude-code-lab/SampleApps/angular-task-app
npm install
npm start
```

**Prompt to try:**
```
Using Playwright MCP, test the Angular task app at http://localhost:4200:

1. Navigate to the home page
2. Verify the page loads successfully
3. Check the page title
4. Take a screenshot
5. Report the results
```

**What Claude will do:**
- Launch a Chromium browser
- Navigate to your app
- Verify it loads without errors
- Capture a screenshot
- Report success/failure with details

### Example 2: Test Task Creation Flow

**Prompt to try:**
```
Using Playwright MCP, validate the task creation feature:

1. Navigate to http://localhost:4200
2. Click the "New Task" or "Add Task" button
3. Fill in the task form:
   - Task Name: "Automated Test Task"
   - Description: "Created by Playwright automation"
4. Submit the form
5. Verify the new task appears in the list
6. Take before and after screenshots
7. Report the results
```

**What happens:**
- Browser opens and navigates to app
- Finds and clicks the "New Task" button
- Fills form fields automatically
- Submits the form
- Validates the task appears
- Captures visual proof
- Reports success or any issues found

### Example 3: Responsive Design Testing

**Prompt to try:**
```
Using Playwright MCP, test responsive design:

1. Test the Angular app at these viewport sizes:
   - Mobile: 375x667 (iPhone)
   - Tablet: 768x1024 (iPad)  
   - Desktop: 1920x1080
2. For each size:
   - Take a screenshot
   - Verify no horizontal scroll
   - Check navigation is accessible
3. Generate a responsive design report
```

### Example 4: Performance Testing

**Prompt to try:**
```
Using Playwright MCP, measure performance metrics for the task app:

1. Navigate to http://localhost:4200
2. Measure:
   - First Contentful Paint (FCP)
   - Load complete time
   - Number of resources loaded
3. Compare against Web Vitals thresholds
4. Report performance status (Good/Needs Improvement/Poor)
```

**Performance thresholds:**
- **FCP Good:** < 1.8s
- **FCP Needs Improvement:** 1.8s - 3.0s
- **FCP Poor:** > 3.0s

### Example 5: Form Validation Testing

**Prompt to try:**
```
Using Playwright MCP, test form validation:

1. Try submitting an empty task form
2. Verify error messages appear
3. Fill in only the name field
4. Check if partial validation works
5. Fill in all required fields correctly
6. Verify successful submission
7. Report all validation rules tested
```

### Advanced: Visual Regression Testing

**Prompt to try:**
```
Using Playwright MCP, set up visual regression testing:

1. Navigate to the dashboard
2. Wait for all content to fully load
3. Take a baseline screenshot
4. Save it as "dashboard-baseline.png"
5. In the future, compare new screenshots against this baseline
6. Report any visual differences
```

### Real-World Scenarios

**Scenario 1: Bug Investigation**
```
There's a bug where tasks don't submit on mobile. Using Playwright MCP:

1. Set viewport to mobile size (375x667)
2. Try to create a new task
3. Take screenshots at each step
4. Check console for errors
5. Inspect the submit button state
6. Report what's preventing submission
```

**Scenario 2: Pre-Deployment Validation**
```
Before deploying, validate the Angular app with Playwright MCP:

1. Test all main user flows (task CRUD operations)
2. Check responsive design on 3 viewport sizes
3. Measure performance metrics
4. Verify no console errors
5. Take screenshots for documentation
6. Generate a go/no-go deployment report
```

**Scenario 3: Cross-Browser Testing**
```
Using Playwright MCP, test the app in multiple browsers:

1. Test in Chromium
2. Test in Firefox
3. Test in WebKit (Safari)
4. For each browser, run the main user flows
5. Report any browser-specific issues
```

### Best Practices

**1. Use stable selectors:**
```javascript
// ❌ Fragile
await page.click('div > div > button:nth-child(3)');

// ✅ Robust
await page.click('button[aria-label="Create New Task"]');
await page.click('text=Submit');
```

**2. Wait properly:**
```javascript
// ❌ Arbitrary timeout
await page.waitForTimeout(3000);

// ✅ Wait for specific conditions
await page.waitForSelector('.task-list', { state: 'visible' });
await page.waitForLoadState('networkidle');
```

**3. Always take screenshots on failure:**
```javascript
try {
  await page.click('button:has-text("Submit")');
} catch (error) {
  await page.screenshot({ path: 'error-state.png' });
  throw error;
}
```

### Why Playwright MCP is Powerful

| Without Playwright MCP | With Playwright MCP |
|------------------------|---------------------|
| Write tests manually | Claude writes and runs tests |
| Can't see visual issues | Test in real browsers |
| Separate testing workflow | Integrated in development |
| Manual screenshot comparison | Automated visual testing |
| Debug from code only | See what users actually see |

**Key insight:** Playwright MCP turns Claude into a QA engineer that can test your app in real browsers, just by asking!

## 🎯 Step 8: Multiple MCP Servers Together

The real power comes from combining MCP servers.

### Integrated Workflow Example

**Prompt to try:**
```
Execute this complete workflow using MCP:

1. Query the SQLite database for failed processing jobs
2. For each failure:
   a. Search the web for solutions to the error
   b. Apply fixes to the code
   c. Create a GitHub issue documenting the fix
   d. Post a summary to #development Slack channel

Provide a summary when complete.
```

**What happens:**
- SQLite MCP: Queries database
- Web Search MCP: Finds solutions
- File operations: Fixes code
- GitHub MCP: Creates issues
- Slack MCP: Sends notifications

**This is where MCP shines!** 🌟

### Advanced Multi-MCP Workflow with Playwright

**Prompt to try:**
```
Complete end-to-end validation workflow:

1. Using SQLite MCP: Query database for recent tasks
2. Using Playwright MCP: 
   - Navigate to the task app
   - Verify those tasks display correctly in the UI
   - Test creating a new task
3. Using SQLite MCP: Verify the new task was saved to database
4. Using Playwright MCP: Take screenshots of the UI state
5. Using GitHub MCP: Create an issue with test results
6. Using Slack MCP: Post summary to #qa channel

Report the complete workflow results.
```

**Another powerful example:**
```
Automated deployment validation:

1. Using Playwright MCP: Run full UI test suite
2. If all tests pass:
   - Using GitHub MCP: Create a PR with test screenshots
   - Using Slack MCP: Notify #releases channel
3. If any tests fail:
   - Using Playwright MCP: Capture detailed failure screenshots
   - Using GitHub MCP: Create a bug issue with screenshots
   - Using Slack MCP: Alert #dev-team with failure details
```

## 🛠️ Step 9: Custom MCP Server

Build your own MCP server for custom integrations.

### Simple Custom MCP Server

Let's create a simple custom MCP server for a mock internal API.

**Prompt to try:**
```
Help me create a custom MCP server that exposes these tools:
1. get_team_members() - Returns list of team members
2. get_project_status(project_name) - Returns project status
3. log_work_item(description, hours) - Logs work

Create the server in Node.js and configure Claude Code to use it.
```

### Custom Server Template

Claude will help create something like:

```javascript
// custom-mcp-server.js
const { Server } = require("@modelcontextprotocol/sdk/server");

const server = new Server({
  name: "custom-internal-api",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_team_members",
      description: "Get list of team members",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    // ... more tools
  ]
}));

// Handler implementations...
```

### Test Your Custom Server

**Prompt to try:**
```
Using my custom MCP server:
1. Get the list of team members
2. Check status of 'data-processor' project
3. Log 2 hours of work: "Completed MCP integration lab"
```

## 💡 Best Practices for MCP

### 1. Security First

```
# ❌ Don't commit secrets
{
  "env": {
    "API_KEY": "actual-key-here"
  }
}

# ✅ Use environment variables
{
  "env": {
    "API_KEY": "${GITHUB_TOKEN}"
  }
}
```

Set in your shell:
```bash
export GITHUB_TOKEN="your-token"
```

### 2. Scope Appropriately

Give minimum necessary permissions:
- Read-only when possible
- Specific channels/repos only
- Avoid admin privileges

### 3. Test Incrementally

Start with simple operations:
1. Read/query operations
2. Safe write operations
3. Complex workflows

### 4. Error Handling

```
If the MCP server fails, show me the error and suggest troubleshooting steps.
```

### 5. Document Integrations

```
Create a README.md documenting all MCP integrations, required tokens, and setup steps for new team members.
```

## 🎯 Exercise: Build Your Integration Stack

Complete this exercise to solidify your MCP knowledge!

**Task**: Set up a complete development workflow with MCP.

**Prompt suggestion:**
```
Set up this complete MCP integration stack:

1. Filesystem MCP: Access to ~/projects and ~/documents
2. SQLite MCP: Analytics database connection
3. Playwright MCP: Browser automation for testing
4. GitHub MCP: Repository management
5. Slack MCP (if available): Team notifications

Then demonstrate by:
- Reading project requirements from ~/documents/requirements.txt
- Implementing a new feature in the Angular task app
- Using Playwright MCP to test the feature in a browser
- Logging test results to the analytics database
- If tests pass, creating a GitHub PR with screenshots
- Posting a summary to Slack with test status

Walk me through the entire process.
```

**Alternative exercise - QA Automation:**
```
Build a complete QA automation workflow:

1. Set up Playwright MCP for browser testing
2. Set up SQLite MCP for test results storage
3. Create a workflow that:
   - Tests the Angular task app (all main features)
   - Takes screenshots of each test step
   - Records pass/fail results in the database
   - If failures occur, saves detailed error information
   - Generates a test report with visual evidence

Then run the workflow and show me the results.
```

## 🔍 Troubleshooting MCP

### Common Issues

**MCP Server Won't Start**

```
Help me debug why the MCP server isn't starting. Check:
- Is the command correct?
- Are dependencies installed?
- Are environment variables set?
- Check Claude Code logs
```

**Authentication Failures**

```
The MCP server is failing authentication. Help me:
- Verify the token/API key
- Check token permissions
- Test the token outside of Claude
```

**Tool Not Available**

```
List all available MCP tools. If the tool I need isn't there, help me troubleshoot the server configuration.
```

## 🎓 What You've Learned

By completing this lab, you now understand:

✅ **MCP fundamentals** - What it is and why it matters

✅ **MCP configuration** - How to set up servers

✅ **Common integrations** - Filesystem, databases, GitHub, Slack, web search

✅ **Browser automation** - Testing web apps with Playwright MCP

✅ **Combined workflows** - Using multiple MCPs together

✅ **Custom servers** - Building your own integrations

✅ **Best practices** - Security, scoping, testing

## 🚀 Key Takeaways

1. **MCP is a universal adapter** - Connect Claude to anything

2. **Start simple** - File and database access first

3. **Combine for power** - Multiple MCPs create workflows

4. **Security matters** - Never commit tokens

5. **Custom is possible** - Build your own integrations

6. **Documentation helps** - Document for your team

## 📚 Additional Resources

- **MCP Documentation**: [MCP Guide](https://code.claude.com/docs/en/mcp)
- **MCP Quickstart**: [Getting Started](https://code.claude.com/docs/en/mcp-quickstart)
- **Available Servers**: [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- **Build Your Own**: [MCP SDK](https://github.com/modelcontextprotocol/sdk)

## 🔜 Next Steps

In [Lab 7 - Customizing Claude Code](Lab-7-Customization.md), you'll learn:
- Creating custom skills
- Setting up automation hooks
- Memory system for persistent learning
- Configuring permissions and preferences

---

#### You have successfully completed Lab 6! Click [Next Lab →](Lab-7-Customization.md) to continue.
