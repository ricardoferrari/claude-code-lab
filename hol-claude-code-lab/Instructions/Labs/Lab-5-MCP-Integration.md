# Lab 5 - MCP Integration

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

## 🎯 Step 7: Multiple MCP Servers Together

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

## 🛠️ Step 8: Custom MCP Server

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
3. GitHub MCP: Repository management
4. Slack MCP (if available): Team notifications

Then demonstrate by:
- Reading project requirements from ~/documents/requirements.txt
- Implementing a new feature based on those requirements
- Writing tests
- Logging results to the analytics database
- Creating a GitHub PR
- Posting a summary to Slack

Walk me through the entire process.
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

✅ **Common integrations** - Filesystem, databases, GitHub, Slack

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

In [Lab 6 - Customizing Claude Code](Lab-6-Customization.md), you'll learn:
- CLAUDE.md files for project instructions
- Creating custom skills
- Setting up automation hooks
- Memory system for persistent learning

---

#### You have successfully completed Lab 5! Click [Next Lab →](Lab-6-Customization.md) to continue.
