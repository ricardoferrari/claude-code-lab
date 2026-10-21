# Lab 4 - Context Windows and Session Management

#### Duration: 25 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Understand how context windows work in Claude Code
- Learn to manage conversation length effectively
- Master the CLAUDE.md file for project-specific instructions
- Use slash commands to control your session
- Understand handoffs between different Claude models
- Optimize your workflow with context management strategies

## 🧠 Understanding Context Windows

### What is a Context Window?

A **context window** is the amount of conversation history and information Claude can "see" at once. Think of it as Claude's working memory.

**Key concepts:**
- **Token**: A piece of text (roughly 4 characters in English)
- **Context limit**: Maximum tokens Claude can process at once
- **Context usage**: How much of the window is currently filled

### Why Context Management Matters

As your conversation grows:
- ✅ **More context**: Better understanding of your project
- ❌ **Full context**: Slower responses, higher costs, eventual limit

**The balance**: Keep enough history for continuity, remove noise when it builds up.

### Claude's Context Window

```
Current session: ~200,000 tokens
≈ 150,000 words
≈ 600 pages of text
```

**What fills the context?**
- Your messages and Claude's responses
- File contents that were read
- Tool outputs (bash commands, grep results, etc.)
- System instructions

## 🍎 Scenario: Long Development Session

You've been working with Claude for hours on DataFlow Analytics. You've:
- Read dozens of files
- Run multiple test suites
- Made many code changes
- Had extended debugging sessions

Now the context is filling up and responses are slower. Time to manage it!

## 📊 Step 1: Checking Context Usage

Let's see how much context you're using.

### Navigate to Your Project

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

### Check Current Context

**Prompt to try:**
```
/context
```

**What you see:**
```
Context usage: 45,000 / 200,000 tokens (22.5%)

Recent context:
- Read data_processor.py (2,500 tokens)
- Test output (1,200 tokens)
- Code edits (3,400 tokens)
- Conversation (37,900 tokens)
```

**What the numbers mean:**
- **Under 50%**: Plenty of room, no action needed
- **50-75%**: Start thinking about cleanup
- **75-90%**: Consider compacting or clearing
- **90%+**: Definitely time to manage context

## 🧹 Step 2: Context Management Commands

Claude Code provides several slash commands for managing your session.

### The /clear Command

**Purpose**: Start completely fresh, forget everything

**When to use:**
- Switching to unrelated task
- Want a clean slate
- Previous conversation no longer relevant

**Try it:**
```
/clear
```

**What happens:**
- All conversation history removed
- File reads forgotten
- Fresh start with no context
- Like starting a new session

**⚠️ Warning**: This is permanent! Use /compact if you want to keep some context.

### The /compact Command

**Purpose**: Summarize conversation, keep key information

**When to use:**
- Context is filling up (75%+)
- Want to keep project knowledge
- Need to remove verbose tool outputs

**Try it:**
```
/compact
```

**What happens:**
- Claude summarizes the conversation
- Key decisions and facts preserved
- Verbose outputs removed
- Context usage drops significantly

**Example before/after:**
```
Before: 150,000 tokens
After:  30,000 tokens (80% reduction)

Kept:
- Project structure understanding
- Key decisions made
- Important findings
- Current task context

Removed:
- Full file contents (keeps references)
- Long test outputs
- Verbose debugging logs
- Repetitive exchanges
```

### Practicing Compact

Let's generate some context and then compact it:

**Prompt to try:**
```
Read all Python files in this project, run all tests, and show me a summary of the code structure.
```

After Claude completes:

```
/context
```

Note your token usage, then:

```
/compact
```

Check again:

```
/context
```

**Observe**: Context reduced but Claude still remembers the important parts!

### The /resume Command

**Purpose**: Continue a previous conversation from a different session

**When to use:**
- Returning to work after closing Claude
- Want to pick up where you left off
- Need context from earlier session

**How it works:**
- Claude Code saves conversation history
- /resume loads the last session
- Context restored automatically

**Try it:**
```bash
# Exit current session
exit

# Start a new session
claude

# Resume the previous conversation
/resume
```

**What happens:**
- Previous conversation loads
- Claude remembers what you were doing
- Can continue seamlessly

**Pro tip:** Resume is automatic in the desktop app when you reopen it!

## 🎯 Step 3: Project Memory with CLAUDE.md

The **CLAUDE.md** file is how you give Claude persistent, project-specific instructions.

### What is CLAUDE.md?

A markdown file in your project root that contains:
- Project overview and architecture
- Coding conventions and standards
- Common commands and workflows
- Things Claude should always remember

**Key benefit**: This context loads automatically - you don't repeat yourself!

### Initializing CLAUDE.md

Let's create one for your project.

**Prompt to try:**
```
/init
```

or

```
Initialize a CLAUDE.md file for this project. Analyze the codebase and include:
- Project purpose and structure
- Key technologies and frameworks
- Coding conventions observed
- Common commands for testing and running
- Important architectural decisions
```

**What Claude does:**
1. Analyzes your codebase
2. Identifies patterns and conventions
3. Creates comprehensive CLAUDE.md
4. Places it in project root

### Reviewing Your CLAUDE.md

**Prompt to try:**
```
Show me the CLAUDE.md file that was created.
```

**Typical contents:**
```markdown
# DataFlow Analytics - Python Data Processor

## Project Overview
A Python data processing pipeline for analytics data transformation.

## Architecture
- `data_processor.py`: Core processing logic
- `tests/`: Unit tests using pytest
- `utils/`: Helper functions

## Technologies
- Python 3.9+
- pytest for testing
- pandas for data manipulation

## Coding Standards
- PEP 8 style guide
- Type hints for all public functions
- Docstrings in Google style
- 100 character line limit

## Common Commands
```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=. tests/

# Format code
black .
```

## Important Notes
- Always validate input data before processing
- Log errors to logs/processing.log
- Cache results in .cache/ directory
```

### Editing CLAUDE.md

You can customize it:

**Prompt to try:**
```
Update CLAUDE.md to add a section about our error handling policy:
- Always use specific exception types
- Log all errors with context
- Never use bare except clauses
- Include error recovery strategies
```

### How CLAUDE.md Works

**Every new session:**
1. Claude reads CLAUDE.md automatically
2. Instructions apply without you mentioning them
3. Conventions are followed consistently
4. Context starts with this knowledge

**Example impact:**
```
# Without CLAUDE.md
You: "Add a new function for data validation"
Claude: Creates function with inconsistent style

# With CLAUDE.md
You: "Add a new function for data validation"
Claude: Creates function following:
  - PEP 8 style
  - Type hints
  - Google-style docstrings
  - 100 char line limit
  - Proper error handling per policy
```

## 🔄 Step 4: The /handoff Command

**Purpose**: Switch between Claude models while preserving context

**Available models:**
- **Sonnet**: Balanced speed and capability (default)
- **Opus**: Most capable, deeper analysis
- **Haiku**: Fastest, simple tasks

### When to Handoff

**To Opus** (more capable):
- Complex architectural decisions
- Deep code analysis needed
- Challenging debugging
- Writing complex algorithms

**To Haiku** (faster):
- Simple edits
- Running commands
- Quick questions
- Repetitive tasks

**Try it:**
```
/handoff opus
```

**What happens:**
- Current context is preserved
- Next response uses Opus model
- Conversation continues seamlessly

**Switch back:**
```
/handoff sonnet
```

### Practical Handoff Example

**Scenario**: You need deep analysis, then quick edits

```
# Start with Sonnet (default)
Analyze the overall architecture and suggest improvements

# Switch to Opus for deep analysis
/handoff opus

# Let Opus provide detailed architectural review
# ...Opus provides comprehensive analysis...

# Switch back to Sonnet for implementation
/handoff sonnet

Now implement the first three suggestions
```

## 💡 Step 5: Context Management Strategies

### Strategy 1: Proactive Compacting

Don't wait for context to fill up:

```
Every hour or after major tasks:
/context (check usage)
If over 60%: /compact
```

### Strategy 2: Clear Between Major Tasks

When switching contexts:

```
Finished feature A, starting unrelated feature B:
/clear
```

### Strategy 3: Use CLAUDE.md for Repetitive Info

Instead of repeating instructions:

```
# ❌ Every session
You: "Remember to use PEP 8 style..."
You: "Always add type hints..."
You: "Use pytest for tests..."

# ✅ One time in CLAUDE.md
Claude reads it automatically every session
```

### Strategy 4: Strategic Handoffs

Match the model to the task:

```
Planning phase: Opus (deep thinking)
  ↓
Implementation: Sonnet (balanced)
  ↓
Quick fixes: Haiku (speed)
```

### Strategy 5: File References vs. Content

Help Claude manage memory:

```
# ❌ Fills context
You: "Read all 50 files in this project"

# ✅ Efficient
You: "Search for authentication code"
Claude: Uses grep, reads only relevant files
```

## 🎯 Exercise: Complete Context Management Workflow

Complete this exercise to practice everything!

### Exercise: Optimize a Long Session

**Setup**:
1. Start a fresh session
2. Do extensive exploration (read many files, run tests, make changes)
3. Fill context to 50%+

**Task**:
```
1. Check your context usage with /context

2. Review what's taking up space

3. Compact the context with /compact

4. Check usage again - how much did you save?

5. Initialize a CLAUDE.md file with /init

6. Review and customize the CLAUDE.md

7. Exit and start a new session with /resume

8. Verify CLAUDE.md loaded and context was restored

9. Try a handoff to Opus with /handoff opus

10. Ask a complex question

11. Handoff back to Sonnet with /handoff sonnet

12. Continue normal work
```

## 🧪 Exercise: CLAUDE.md Best Practices

Create an optimal CLAUDE.md for the Angular project.

### Navigate to Angular Project

```bash
exit
cd ../angular-task-app
claude
```

### Create Comprehensive CLAUDE.md

**Prompt to try:**
```
Create a comprehensive CLAUDE.md for this Angular project that includes:

Project Overview:
- Purpose and main features
- Target users

Architecture:
- Component structure
- Service layer
- State management approach

Conventions:
- TypeScript strict mode rules
- Component naming conventions
- File organization patterns
- Testing approach (unit vs integration)

Development Workflow:
- Commands for dev server, build, test
- Pre-commit checks
- Common debugging steps

Design Patterns:
- When to use services vs components
- Error handling patterns
- API interaction patterns

Do's and Don'ts:
- Specific things to always do
- Things to avoid
```

### Test Your CLAUDE.md

Exit and restart to see if it loads:

```bash
exit
claude

# First message - no context needed
Add a new method to filter completed tasks
```

**Observe**: Claude follows conventions from CLAUDE.md without you specifying them!

## 🔍 Understanding Context Priority

Claude prioritizes context in this order:

```
1. Current conversation (recent messages)
   ↓
2. CLAUDE.md (project instructions)
   ↓
3. Recent tool outputs (file reads, command results)
   ↓
4. Earlier conversation (older messages)
```

**What gets summarized first during /compact:**
- Oldest messages
- Large tool outputs
- Repetitive content
- Resolved issues

**What stays:**
- Recent conversation
- CLAUDE.md reference
- Unresolved issues
- Current task context

## 🎓 What You've Learned

By completing this lab, you now understand:

✅ **Context windows** - What they are and why they matter

✅ **Context monitoring** - Using /context to check usage

✅ **Context cleaning** - /clear vs /compact

✅ **Session continuity** - /resume for picking up where you left off

✅ **CLAUDE.md files** - Project-specific persistent instructions

✅ **Model switching** - /handoff for optimal model selection

✅ **Context strategies** - Best practices for long sessions

## 🚀 Key Takeaways

1. **Monitor context regularly** - Don't wait for it to fill up completely

2. **CLAUDE.md is powerful** - Set it up once, benefit every session

3. **Compact, don't clear** - Unless you truly want to forget everything

4. **Handoff strategically** - Match the model to the task complexity

5. **File references > full reads** - Search first, read selectively

6. **Resume is seamless** - Don't lose your progress between sessions

## 📋 Quick Reference Card

```bash
# Check context usage
/context

# Compact context (smart cleanup)
/compact

# Clear all context (fresh start)
/clear

# Resume previous session
/resume

# Initialize CLAUDE.md
/init

# Switch to Opus (most capable)
/handoff opus

# Switch to Sonnet (balanced, default)
/handoff sonnet

# Switch to Haiku (fastest)
/handoff haiku
```

## 📚 Additional Resources

- **Context Management**: [Managing Context](https://code.claude.com/docs/en/context-management)
- **CLAUDE.md Guide**: [Project Instructions](https://code.claude.com/docs/en/claude-md)
- **Model Selection**: [Choosing Models](https://code.claude.com/docs/en/models)
- **Slash Commands**: [Command Reference](https://code.claude.com/docs/en/commands)

## 🔜 Next Steps

In [Lab 5 - Working with Agents](Lab-5-Working-With-Agents.md), you'll learn:
- How to spawn and coordinate multiple subagents
- Parallel execution for complex tasks
- Agent communication and result aggregation
- When to use agents vs. doing it yourself

---

#### You have successfully completed Lab 4! Click [Next Lab →](Lab-5-Working-With-Agents.md) to continue.
