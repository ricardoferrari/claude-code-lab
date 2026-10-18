# Lab 1 - Getting Started with Claude Code

#### Duration: 15 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Understand what Claude Code is and how it differs from other AI assistants
- Successfully install Claude Code on your system
- Authenticate and start your first session
- Execute basic commands and interact with Claude
- Understand the fundamental workflow of working with Claude Code

## 🚀 What is Claude Code?

Claude Code is an **agentic AI coding assistant** that acts as an intelligent development partner. Unlike simple autocomplete tools, Claude Code:

- **Understands context** - Reads and analyzes your entire codebase
- **Takes action** - Edits files, runs commands, and validates changes
- **Uses tools** - Leverages Read, Write, Edit, Grep, Glob, Bash, and more
- **Works autonomously** - Can break down complex tasks and execute them
- **Coordinates work** - Spawns multiple agents for parallel execution

Think of it as having a senior developer who can:
- Navigate unfamiliar codebases instantly
- Write and refactor code across multiple files
- Run tests and fix failures
- Create commits and pull requests
- Connect to external tools and data sources

## 🔍 Step 1: Verify Prerequisites

Before installing Claude Code, let's verify you have the necessary prerequisites.

### Check Your System

1. **Operating System**: Ensure you're running a supported OS
   - macOS 13.0 or later
   - Windows 10 1809+ or Windows Server 2019+
   - Linux (Ubuntu 20.04+, Debian 10+, Alpine 3.19+)

2. **Hardware**: 4 GB+ RAM, x64 or ARM64 processor

3. **Internet Connection**: Required for installation and use

### Check Required Software

Open a terminal (Command Prompt/PowerShell on Windows, Terminal on macOS/Linux) and verify these are installed:

**Python 3.9+:**
```bash
python --version
# or
python3 --version
```

**Node.js 18+:**
```bash
node --version
```

**Git:**
```bash
git --version
```

<details>
  <summary>💡 Installing Missing Prerequisites</summary>
  
  If any of these are missing, install them:
  - **Python**: [python.org/downloads](https://www.python.org/downloads/)
  - **Node.js**: [nodejs.org](https://nodejs.org/)
  - **Git**: [git-scm.com/downloads](https://git-scm.com/downloads)
  
  After installation, close and reopen your terminal, then verify again.
</details>

## 📥 Step 2: Install Claude Code

Now let's install Claude Code. Choose the method that's right for your system.

### Installation Instructions

<details open>
  <summary><strong>macOS or Linux</strong></summary>
  
  Open your terminal and run:
  
  ```bash
  curl -fsSL https://claude.ai/install.sh | bash
  ```
  
  The installer will download and set up Claude Code automatically. This may take a minute with no visible progress—that's normal!
  
</details>

<details>
  <summary><strong>Windows PowerShell</strong></summary>
  
  Open PowerShell (not CMD) and run:
  
  ```powershell
  irm https://claude.ai/install.ps1 | iex
  ```
  
  **Note**: Your PowerShell prompt shows `PS C:\` at the beginning.
  
</details>

<details>
  <summary><strong>Windows CMD</strong></summary>
  
  Open Command Prompt (not PowerShell) and run:
  
  ```batch
  curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
  ```
  
  **Note**: Your CMD prompt shows `C:\` without the `PS` at the beginning.
  
</details>

<details>
  <summary><strong>Alternative: Homebrew (macOS)</strong></summary>
  
  If you prefer Homebrew:
  
  ```bash
  brew install --cask claude-code
  ```
  
  **Note**: Homebrew installations don't auto-update. You'll need to manually run:
  ```bash
  brew upgrade claude-code
  ```
  
</details>

<details>
  <summary><strong>Alternative: WinGet (Windows)</strong></summary>
  
  If you prefer WinGet:
  
  ```powershell
  winget install Anthropic.ClaudeCode
  ```
  
  **Note**: WinGet installations don't auto-update. You'll need to manually run:
  ```powershell
  winget upgrade Anthropic.ClaudeCode
  ```
  
</details>

### Verify Installation

After the installer finishes, **open a new terminal window** and verify the installation:

```bash
claude --version
```

**Expected output**: You should see a version number like `2.1.211 (Claude Code)`

<details>
  <summary>🚨 Troubleshooting: Command Not Found</summary>
  
  If you see `command not found` or `is not recognized`:
  
  1. **Close and reopen your terminal** - The PATH may not have updated
  2. **Check the PATH** - Run `claude doctor` for diagnostic information
  3. **Manual PATH update** (advanced):
     - On macOS/Linux: Add `~/.local/bin` to your PATH
     - On Windows: Add `%USERPROFILE%\.local\bin` to your PATH
  4. **See detailed troubleshooting**: [Troubleshoot Installation](https://code.claude.com/docs/en/troubleshoot-install)
  
</details>

## 🔐 Step 3: Authenticate

Claude Code requires authentication to use Claude's AI capabilities.

### Choose Your Authentication Method

<details open>
  <summary><strong>Option 1: Claude Subscription (claude.ai)</strong></summary>
  
  If you have a Claude Pro, Team, or Enterprise subscription:
  
  1. Start Claude Code in any directory:
     ```bash
     claude
     ```
  
  2. Claude will prompt you to log in and open your browser
  
  3. Follow the browser prompts to authenticate
  
  4. Return to your terminal—you should now be in an interactive Claude session!
  
</details>

<details>
  <summary><strong>Option 2: Anthropic API Key (Console)</strong></summary>
  
  If you have an API key from the [Anthropic Console](https://console.anthropic.com/):
  
  1. Set your API key as an environment variable:
     
     **macOS/Linux:**
     ```bash
     export ANTHROPIC_API_KEY='your-api-key-here'
     ```
     
     **Windows PowerShell:**
     ```powershell
     $env:ANTHROPIC_API_KEY = 'your-api-key-here'
     ```
  
  2. Start Claude Code:
     ```bash
     claude
     ```
  
  3. Claude will detect your API key and ask if you want to use it—approve when prompted
  
  **Note**: To make the API key persistent, add it to your shell configuration file (`.bashrc`, `.zshrc`, or PowerShell profile).
  
</details>

<details>
  <summary><strong>Option 3: Third-Party Providers</strong></summary>
  
  Claude Code also supports:
  - [Amazon Bedrock](https://code.claude.com/docs/en/amazon-bedrock)
  - [Google Cloud Agent Platform](https://code.claude.com/docs/en/google-vertex-ai)
  - [Microsoft Foundry](https://code.claude.com/docs/en/microsoft-foundry)
  
  Follow the respective setup guides in the documentation.
  
</details>

## 💬 Step 4: Your First Session

Now that Claude Code is installed and authenticated, let's start your first session!

### Navigate to the Sample Project

1. Open a terminal and navigate to the sample Python application:
   ```bash
   cd hol-claude-code-lab/SampleApps/python-data-processor
   ```

2. Start Claude Code:
   ```bash
   claude
   ```

You should see Claude Code start up and present a prompt where you can type messages!

### Try These Commands

Let's try some basic interactions:

**1. Ask Claude about the project:**
```
What does this project do? Give me a high-level overview.
```

Wait for Claude to analyze the code and respond. You'll see it uses tools like `Read` and `Glob` to explore the files.

**2. Ask for a specific file analysis:**
```
Read the main Python file and explain what it does.
```

**3. Request a code quality check:**
```
Are there any obvious bugs or improvements you'd suggest?
```

### Understanding Claude's Responses

As Claude works, you'll see:
- **Tool usage**: Claude transparently shows which tools it's using (Read, Grep, Bash, etc.)
- **Thinking process**: Some responses show reasoning before taking action
- **Results**: Clear summaries of findings and actions taken

### Exit the Session

When you're ready to end the session:
- Type `exit` or press `Ctrl+C` (or `Cmd+C` on Mac)

## 🧪 Step 5: Understanding the Workflow

Let's break down what just happened and understand Claude Code's workflow.

### The Request-Response Cycle

1. **You provide a prompt** - Natural language describing what you want
2. **Claude analyzes the request** - Determines which tools and actions are needed
3. **Claude executes tools** - Reads files, runs commands, makes edits
4. **Claude reports results** - Summarizes findings and actions taken
5. **You can follow up** - Ask clarifications or request changes

### Key Concepts

**Tools**: Claude has access to powerful tools:
- `Read` - Read file contents
- `Write` - Create new files
- `Edit` - Make precise edits to existing files
- `Grep` - Search for patterns in files
- `Glob` - Find files matching patterns
- `Bash` - Execute shell commands
- And many more!

**Context**: Claude maintains conversation context, so you can:
- Refer to previous messages
- Build on prior work
- Ask follow-up questions

**Permissions**: Claude Code operates in permission modes:
- Some tools require approval before execution
- You can configure permissions in settings

## 🎯 Exercise: Explore on Your Own

Now it's your turn! Start a new Claude Code session and try these exercises:

### Exercise 1: Code Exploration
```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

**Ask Claude:**
1. "List all Python files in this project"
2. "What external dependencies does this project use?"
3. "Show me the structure of the main data processing function"

### Exercise 2: Quick Task
**Ask Claude:**
```
Create a simple README.md file that documents how to run this project, including installation steps and basic usage examples.
```

Watch how Claude:
- Analyzes the project structure
- Identifies dependencies and setup needs
- Creates documentation automatically

### Exercise 3: Code Quality
**Ask Claude:**
```
Review the code for potential improvements. Focus on error handling, code organization, and best practices.
```

Observe how Claude can provide code reviews and suggestions!

## 💡 Tips and Best Practices

### Writing Effective Prompts

**Be specific:**
- ❌ "Fix the bug"
- ✅ "Fix the bug in data_processor.py where dates aren't parsing correctly"

**Provide context:**
- ❌ "Add tests"
- ✅ "Add unit tests for the data validation functions in validator.py, covering both valid and invalid inputs"

**Break down complex tasks:**
- ❌ "Build a complete authentication system"
- ✅ "First, create a user model with email and password fields. Then, add a login function that validates credentials."

### Trust but Verify

- Always review code Claude generates or modifies
- Test changes before committing
- Ask Claude to explain its reasoning if unclear

### Iterate and Refine

- Don't expect perfection on the first try
- Ask follow-up questions to refine results
- Use Claude's suggestions as a starting point

## 🔍 Understanding the Output

When Claude uses tools, you'll see output like:

```
Reading file: src/data_processor.py
```

This transparency helps you:
- Understand what Claude is doing
- Verify the actions being taken
- Learn which tools solve which problems

## 🚀 Next Steps

Congratulations! You've successfully:
- ✅ Installed Claude Code
- ✅ Authenticated your session
- ✅ Started your first interactive session
- ✅ Explored basic commands and workflows
- ✅ Understood core concepts and best practices

### What's Next?

In [Lab 2 - Exploring Codebases](Lab-2-Exploring-Codebases.md), you'll learn:
- Advanced code exploration techniques
- Using Read, Grep, and Glob tools effectively
- Understanding project architecture
- Navigating large codebases quickly

## 📚 Additional Resources

- **Claude Code Documentation**: [code.claude.com/docs](https://code.claude.com/docs/en/)
- **Quickstart Guide**: [Quickstart](https://code.claude.com/docs/en/quickstart)
- **CLI Reference**: [CLI Commands](https://code.claude.com/docs/en/cli-reference)
- **Troubleshooting**: [Common Issues](https://code.claude.com/docs/en/troubleshooting)

## ❓ Common Questions

<details>
  <summary><strong>Q: Is my code sent to Anthropic's servers?</strong></summary>
  
  Yes, when you use Claude Code with a claude.ai subscription or API key, your prompts and the code Claude reads are sent to Anthropic's servers for processing. Review Anthropic's [privacy policy](https://www.anthropic.com/privacy) and [terms of service](https://www.anthropic.com/legal/consumer-terms).
  
</details>

<details>
  <summary><strong>Q: Can I use Claude Code offline?</strong></summary>
  
  No, Claude Code requires an internet connection to communicate with Claude's AI models.
  
</details>

<details>
  <summary><strong>Q: How much does Claude Code cost?</strong></summary>
  
  Claude Code is included with Claude Pro ($20/month), Team, and Enterprise subscriptions. API usage through the Console is billed separately based on token usage.
  
</details>

<details>
  <summary><strong>Q: Can Claude Code make commits without my approval?</strong></summary>
  
  No, Claude Code follows permission settings. You can configure what requires approval in your settings. Destructive operations like force-push require confirmation.
  
</details>

---

#### You have successfully completed Lab 1! Click [Next Lab →](Lab-2-Exploring-Codebases.md) to continue.
