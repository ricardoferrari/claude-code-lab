# Lab 2 - Exploring Codebases with Claude Code

#### Duration: 30 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Master the core exploration tools: Read, Grep, and Glob
- Efficiently navigate and understand unfamiliar codebases
- Identify project dependencies, structure, and architecture
- Learn strategies for onboarding to new projects
- Understand how to ask effective questions about code

## 🍎 Scenario: Your First Day at DataFlow Analytics

Welcome to your first day as a developer at **DataFlow Analytics**! Your manager has just given you access to two repositories:

1. **Python Data Processor** - A backend service for data transformation
2. **Angular Task App** - A frontend dashboard for managing data tasks

Like any new team member, you need to quickly understand:
- What do these applications do?
- How is the code organized?
- What technologies and frameworks are used?
- How do I build, run, and test them?

Instead of spending days reading documentation and code, you'll use Claude Code to accelerate your onboarding.

## 🔧 Step 1: Understand the Tools

Claude Code provides several powerful tools for code exploration. Let's understand what each one does:

### Core Exploration Tools

| Tool | Purpose | Best For | Example |
|------|---------|----------|---------|
| **Read** | Read file contents with line numbers | Reading specific files, viewing code structure | "Read the main application file" |
| **Grep** | Search for patterns across files | Finding function definitions, imports, string usage | "Find all functions that handle user input" |
| **Glob** | Find files matching patterns | Discovering project structure, finding file types | "List all TypeScript component files" |
| **Bash** | Execute shell commands | Running builds, checking dependencies, git operations | "Show me the git history" |

### When to Use Each Tool

**Use Read when:**
- You need to see a specific file's contents
- You want to understand a particular module
- You need line-by-line analysis

**Use Grep when:**
- Searching for function names across the codebase
- Finding where a variable or class is used
- Identifying patterns (error handling, API calls, etc.)

**Use Glob when:**
- You want to find files by name or extension
- Mapping out project structure
- Discovering test files, configs, or documentation

**Use Bash when:**
- You need to run commands (npm install, pytest, etc.)
- Checking git history or status
- Investigating dependencies or environment

## 📂 Step 2: Explore the Python Data Processor

Let's start by understanding the Python backend service.

### Initialize the Session

1. Open a terminal and navigate to the Python project:
   ```bash
   cd hol-claude-code-lab/SampleApps/python-data-processor
   ```

2. Start Claude Code:
   ```bash
   claude
   ```

### Task 1: High-Level Overview

Start by asking Claude for a project overview. Try these prompts:

```
What is the main purpose of this Python application? Analyze the code and give me a high-level summary.
```

**Expected Behavior:**
- Claude will use `Glob` to discover files
- Use `Read` to examine key files
- Provide a summary of the application's purpose

**Follow-up questions to try:**
```
What are the main features this application provides?
```

```
What's the entry point for this application?
```

### Task 2: Analyze Project Structure

Now let's understand how the code is organized:

```
Analyze the project structure. Explain the purpose of each directory and the main files I should know about.
```

**Look for Claude to identify:**
- Source code directories
- Test directories
- Configuration files
- Documentation

**Pro Tip:** You can also ask specific questions:
```
Where are the data processing functions located?
```

```
Show me the project's folder structure as a tree.
```

### Task 3: Identify Dependencies

Understanding dependencies is crucial:

```
What external libraries and dependencies does this project use? Explain what each major dependency does and why it might be used.
```

**Expected tools Claude will use:**
- Read `requirements.txt` or `pyproject.toml`
- Possibly Grep for import statements

**Follow-up questions:**
```
Are there any security vulnerabilities in the dependencies I should know about?
```

```
What Python version does this project require?
```

### Task 4: Understand the Build and Run Process

```
How do I set up, install dependencies, and run this project locally? Give me step-by-step instructions.
```

**What to observe:**
- Claude reads setup files (requirements.txt, README.md)
- Identifies installation commands
- Provides clear, actionable steps

**Try it yourself:**
Follow Claude's instructions to actually run the project!

<details>
  <summary>💡 Hint: Typical Python Setup</summary>
  
  ```bash
  # Create virtual environment
  python -m venv venv
  
  # Activate it
  source venv/bin/activate  # macOS/Linux
  # OR
  venv\Scripts\activate  # Windows
  
  # Install dependencies
  pip install -r requirements.txt
  
  # Run the application
  python main.py
  ```
  
</details>

### Task 5: Find Specific Functionality

Let's practice targeted searches:

**Example prompts:**
```
Find all functions that process CSV data. Show me where they're defined and what they do.
```

```
Where is error handling implemented? Show me examples.
```

```
Find all database-related code in this project.
```

**Observe:**
- Claude uses `Grep` to search for patterns
- Provides file paths and line numbers
- Often shows relevant code snippets

## 🎨 Step 3: Explore the Angular Task App

Now let's switch to the frontend application.

### Navigate to the Angular Project

Exit your current Claude session (type `exit`) and navigate to the Angular app:

```bash
cd ../angular-task-app
claude
```

### Task 1: Understand the Frontend Architecture

```
This is an Angular application. Explain the project structure, main components, and how the app is organized.
```

**Claude should identify:**
- Angular-specific folders (components, services, modules)
- Routing configuration
- State management approach
- Component hierarchy

### Task 2: Analyze Components

```
List all Angular components in this project. For each component, briefly explain its purpose.
```

**Follow-up:**
```
Show me the main app component and explain how it works.
```

```
Which components handle user interactions?
```

### Task 3: Understand Services and Data Flow

```
What services are defined in this application? How does data flow between components and services?
```

**Look for:**
- HTTP services for API calls
- State management services
- Utility services

```
How does this frontend communicate with backend APIs?
```

### Task 4: Identify the Technology Stack

```
What technologies, frameworks, and libraries does this Angular app use? Include things like UI libraries, routing, and testing frameworks.
```

**Follow-up questions if needed:**
```
What version of Angular is this project using?
```

```
What UI component library or CSS framework is being used?
```

### Task 5: Testing Strategy

```
How is this Angular application tested? What testing frameworks and strategies are in place?
```

**Look for:**
- Unit tests (*.spec.ts files)
- E2E tests
- Testing frameworks (Jasmine, Karma, Jest, Cypress)

## 🔍 Step 4: Cross-Project Analysis

Now let's analyze how these two applications work together.

### Compare and Connect

Ask Claude to analyze the relationship:

```
I have two projects: python-data-processor (backend) and angular-task-app (frontend). How do they integrate? What's the API contract between them?
```

**Techniques Claude might use:**
- Grep for API endpoint definitions in Python
- Grep for HTTP calls in Angular services
- Compare data structures

```
Are there any mismatches or potential issues in how the frontend and backend communicate?
```

## 💡 Step 5: Advanced Exploration Techniques

### Multi-File Pattern Search

Try more complex searches:

```
Find all TODO comments across both projects. List them by priority if any indication is given.
```

```
Search for all authentication or security-related code in both applications.
```

```
Find all error handling patterns. Are they consistent across the codebase?
```

### Documentation Discovery

```
Find all documentation files (README, CONTRIBUTING, API docs, etc.) across both projects. Summarize the key information from each.
```

### Code Quality Assessment

```
Review both projects for code quality issues. Look for:
- Unused imports or variables
- Functions that are too long or complex
- Missing error handling
- Inconsistent coding styles
```

## 🎯 Exercise: Independent Exploration

Now practice your skills! Complete these exercises on your own:

### Exercise 1: Dependency Audit
**Task:** Create a complete list of all dependencies (Python and npm packages) across both projects. For each dependency:
- State its purpose
- Identify if there's a newer version available
- Note any security concerns

**Prompt to try:**
```
Audit all dependencies in both the Python and Angular projects. Create a report showing each dependency, its purpose, current version, and any recommendations for updates.
```

### Exercise 2: Test Coverage Analysis
**Task:** Analyze test coverage across both projects.

**Prompt to try:**
```
Analyze test coverage in both projects. Which files or modules lack tests? What would be good candidates for adding more tests?
```

### Exercise 3: Architecture Diagram
**Task:** Have Claude help you understand the overall architecture.

**Prompt to try:**
```
Describe the overall system architecture showing how the Python backend and Angular frontend work together. Include:
- Main components in each project
- How they communicate
- Data flow
- Key integration points
```

### Exercise 4: Developer Onboarding Guide
**Task:** Create comprehensive onboarding documentation.

**Prompt to try:**
```
Create a developer onboarding guide for someone new to these projects. Include:
- Prerequisites and setup instructions
- How to run both applications
- How to run tests
- Common development workflows
- Troubleshooting tips
```

## 💡 Tips for Effective Code Exploration

### Start Broad, Then Go Deep
1. Begin with high-level questions about the project
2. Drill down into specific areas
3. Cross-reference information as you go

### Ask Follow-Up Questions
Don't stop at the first answer:
- "Can you explain that function in more detail?"
- "Where is this used elsewhere?"
- "What would happen if this failed?"

### Combine Multiple Tools
Claude often uses multiple tools together:
- Glob to find files → Read to examine them → Grep to search for patterns

### Be Specific When Needed
General questions get general answers. Specific questions get specific answers:
- ❌ "Tell me about the code"
- ✅ "Explain how the data validation function in validator.py works and show me where it's called"

### Verify Critical Information
For build instructions or critical setup steps:
- Actually try the steps Claude suggests
- Report back if something doesn't work
- Claude can help troubleshoot

## 🧪 Understanding Tool Output

When Claude uses tools, pay attention to:

### Read Output
```
Reading file: src/data_processor.py (lines 1-150)
```
- Shows which file is being read
- May show line ranges
- Content appears with line numbers

### Grep Output
```
Searching for: "def process_data"
Found in: src/processor.py:45
```
- Shows search pattern
- Lists files and line numbers
- Sometimes shows context

### Glob Output
```
Finding files matching: **/*.test.ts
Found: 
  - src/app/components/task-list/task-list.component.spec.ts
  - src/app/services/api.service.spec.ts
```
- Shows pattern used
- Lists matching files

## 🎓 Best Practices Learned

By now, you should understand:

✅ **Different tools for different tasks** - Use the right tool for the job

✅ **Progressive discovery** - Start broad, then narrow down

✅ **Context matters** - Ask follow-up questions to build understanding

✅ **Verify important information** - Actually test build instructions

✅ **Learn by example** - Watch how Claude uses tools to solve problems

## 🚀 What You've Accomplished

Congratulations! You've successfully:
- ✅ Mastered core exploration tools (Read, Grep, Glob, Bash)
- ✅ Explored both Python and Angular codebases
- ✅ Understood project structure, dependencies, and architecture
- ✅ Learned how to ask effective questions
- ✅ Practiced onboarding to unfamiliar projects quickly

### Key Takeaways
- Claude Code can dramatically accelerate code exploration
- The right tool makes the task much easier
- Starting with high-level questions and drilling down is effective
- Always verify critical information (build steps, dependencies)
- Follow-up questions deepen understanding

## 📚 Additional Resources

- **Tool Reference**: [Claude Code Tools](https://code.claude.com/docs/en/tools-reference)
- **Best Practices**: [Effective Prompting](https://code.claude.com/docs/en/best-practices)
- **Common Workflows**: [Code Exploration Patterns](https://code.claude.com/docs/en/common-workflows)

## 🔜 Next Steps

In [Lab 3 - Code Editing and Testing](Lab-3-Code-Editing.md), you'll learn:
- How to edit code with the Edit and Write tools
- Generating comprehensive unit tests
- Refactoring and improving existing code
- Best practices for AI-assisted development

---

#### You have successfully completed Lab 2! Click [Next Lab →](Lab-3-Code-Editing.md) to continue.
