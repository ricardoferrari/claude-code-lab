# Lab 7 - Customizing Claude Code

#### Duration: 30 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Create and use CLAUDE.md files for project instructions
- Build custom skills for repeatable workflows
- Set up automation hooks for common tasks
- Understand the memory system
- Configure Claude Code for your team's needs

## 🎨 Why Customize?

Out of the box, Claude Code is powerful. But customization makes it **your** tool:

- **CLAUDE.md**: Teach Claude your project's conventions
- **Skills**: Package workflows as slash commands
- **Hooks**: Automate actions (format on save, run tests before commit)
- **Memory**: Claude learns and remembers across sessions
- **Settings**: Fine-tune behavior and permissions

## 📝 Part 1: CLAUDE.md Files

CLAUDE.md is like a "README for Claude"—instructions Claude reads at the start of every session.

### What to Put in CLAUDE.md

- **Coding standards** - Style guides, naming conventions
- **Architecture decisions** - Why things are structured this way
- **Preferred libraries** - What to use (and avoid)
- **Workflows** - How to test, build, deploy
- **Review checklists** - What to check before committing
- **Project context** - Goals, constraints, team norms

### Create Your First CLAUDE.md

Navigate to your Python project:

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

**Prompt to try:**
```
Create a CLAUDE.md file for this project with these instructions:

# Coding Standards
- Use type hints for all function parameters and returns
- Maximum line length: 100 characters
- Use Google-style docstrings
- Prefer pathlib over os.path
- Use logging, not print statements

# Testing
- Write pytest tests for all new functions
- Aim for 90%+ coverage
- Test both happy path and edge cases

# Error Handling
- Always validate input parameters
- Raise ValueError with descriptive messages
- Log errors before raising

# Before Committing
- Run pytest
- Run mypy for type checking
- Run black for formatting
- Ensure no print() statements remain
```

### Test Your CLAUDE.md

Restart Claude to load the file:

```bash
exit
claude
```

Now ask Claude to add a new function:

```
Add a function to process JSON data. It should validate the input and transform it to our standard format.
```

**Observe**: Claude automatically follows the standards from CLAUDE.md!
- Type hints included
- Google-style docstring
- Input validation
- Proper logging

### Advanced CLAUDE.md

Add context and constraints:

```
Add these sections to CLAUDE.md:

# Project Context
This is a data processing pipeline for analytics. Performance is critical—we process millions of records. Prefer streaming over loading entire datasets into memory.

# Dependencies
- pandas: Data manipulation (already included)
- sqlalchemy: Database (already included)
- DO NOT add new heavy dependencies without discussion

# Architecture
- data_processor.py: Core processing logic
- validators.py: Input validation
- database.py: DB operations
- Use dependency injection, not global state
```

## 🚀 Part 2: Custom Skills

Skills are reusable workflows packaged as slash commands. Like `/test` or `/review`.

### Understanding Skills

**Skills are stored in:** `.claude/skills/`

**Skill structure:**
```markdown
---
name: test
description: Run tests and report results
---

# Instructions for Claude

1. Run the full test suite
2. If any tests fail, analyze why
3. Show coverage report
4. Suggest tests for uncovered code
```

### Create Your First Skill

**Prompt to try:**
```
Create a custom skill called '/review-pr' that:
1. Shows the current git diff
2. Reviews the changes for:
   - Code quality issues
   - Missing tests
   - Security concerns
   - Documentation needs
3. Runs tests to verify nothing broke
4. Provides a summary with thumbs up/down

Save it as a skill I can reuse.
```

Claude will create `.claude/skills/review-pr.md`

### Use Your Skill

Restart Claude, then:

```bash
/review-pr
```

**The skill runs automatically!** Claude follows the instructions you defined.

### Create More Useful Skills

**Skill: Deploy Check**

```
Create a skill '/deploy-check' that verifies:
- All tests pass
- No TODO or FIXME comments
- Version number was bumped
- CHANGELOG updated
- No console.log or print() statements
- Dependencies are up to date
```

**Skill: New Feature**

```
Create a skill '/new-feature' that guides through:
1. Ask what feature to build
2. Create a plan
3. Implement with tests
4. Update documentation
5. Create a git branch and commit
```

**Skill: Bug Fix**

```
Create a skill '/fix-bug' that:
1. Asks for bug description or error message
2. Searches codebase for related code
3. Identifies root cause
4. Fixes the bug
5. Adds test to prevent regression
6. Creates a commit
```

## ⚡ Part 3: Automation Hooks

Hooks run automatically when certain events happen.

### Types of Hooks

| Hook | When It Runs | Common Uses |
|------|--------------|-------------|
| `beforeToolCall` | Before any tool | Backup, logging |
| `afterToolCall` | After any tool | Cleanup, validation |
| `beforeEdit` | Before editing a file | Backup |
| `afterEdit` | After editing a file | Format, lint |
| `beforeBash` | Before shell command | Safety checks |
| `afterBash` | After shell command | Log output |

### Configure Hooks

Hooks are in `settings.json`. Let's set some up:

**Prompt to try:**
```
Configure these automation hooks in .claude/settings.json:

1. After editing any Python file, run black formatter
2. After editing any TypeScript file, run prettier  
3. Before any git commit, run the test suite
4. After reading any file, log the filename and timestamp to .claude/access.log
```

Example configuration:

```json
{
  "hooks": {
    "afterEdit": {
      "**/*.py": "black {file}",
      "**/*.ts": "prettier --write {file}"
    },
    "beforeBash": {
      "git commit": "pytest && echo 'Tests passed'"
    }
  }
}
```

### Test Your Hooks

Make an edit:

```
Add a comment to data_processor.py
```

**Watch**: Black formatter runs automatically after the edit!

### Advanced Hook Examples

**Auto-generate type stubs:**
```json
{
  "hooks": {
    "afterEdit": {
      "**/*.py": "mypy --install-types --non-interactive {file}"
    }
  }
}
```

**Safety check before destructive commands:**
```json
{
  "hooks": {
    "beforeBash": {
      "rm -rf*": "echo 'Prevented potentially dangerous rm -rf command'"
    }
  }
}
```

## 🧠 Part 4: Memory System

Claude Code has a built-in memory system that learns across sessions.

### Auto Memory

Claude automatically saves memories in `~/.claude/projects/YOUR_PROJECT/memory/`

**Memory types:**
- **user**: Info about you (role, preferences)
- **feedback**: How you like Claude to work
- **project**: Goals, constraints, ongoing work
- **reference**: Where to find things

### View Your Memories

**Prompt to try:**
```
Show me what you've learned about this project and how I like to work.
```

**Prompt to try:**
```
List all memories you have saved about this project.
```

### Manually Save Memories

**Prompt to try:**
```
Remember: I prefer detailed error messages over generic ones. When something fails, always show the full traceback and suggest specific fixes.
```

Claude saves this as a feedback memory!

**Prompt to try:**
```
Remember: The data_processor module is the core of the system. Changes here require extra careful testing and a review from the team lead before merging.
```

Claude saves this as project context!

### Using Memories

In future sessions:

```
Based on what you know about my preferences, review this error handling.
```

Claude will recall your preference for detailed error messages!

### Managing Memories

**Update a memory:**
```
Actually, I changed my mind about error messages. Brief, actionable errors are better than full tracebacks.
```

**Remove a memory:**
```
Forget the constraint about team lead reviews for data_processor. We've streamlined the process.
```

## 🎯 Part 5: Settings and Configuration

Fine-tune Claude Code behavior with settings.

### Settings Hierarchy

1. **User settings**: `~/.claude/settings.json` - Global defaults
2. **Project settings**: `.claude/settings.json` - Project-specific
3. **Runtime**: Command-line flags override both

### Key Settings

Open your settings:

```bash
code ~/.claude/settings.json
```

**Prompt to try:**
```
Help me configure these settings:

1. Set default model to Claude Opus for complex tasks
2. Set auto-update to stable channel (not latest)
3. Configure permission mode to 'ask' for file edits
4. Set maximum session token usage alert
5. Configure prettier formatting options
```

Example `settings.json`:

```json
{
  "model": "claude-opus-5-5",
  "autoUpdatesChannel": "stable",
  "permissions": {
    "mode": "ask",
    "allowed": [
      "read:**/*",
      "glob:**/*",
      "grep:**/*"
    ]
  },
  "hooks": {
    "afterEdit": {
      "**/*.{js,ts,tsx}": "prettier --write {file}"
    }
  },
  "env": {
    "PYTHONPATH": "./src"
  }
}
```

### Project-Specific Settings

For team-shared settings:

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
```

**Prompt to try:**
```
Create project settings in .claude/settings.json that all team members should use:

- Require explicit permission for file writes
- Auto-run black and mypy after Python edits
- Set PYTHONPATH to ./src
- Configure test command: pytest -v --cov
```

Commit this file so the team shares settings!

## 🎯 Exercise: Build Your Ideal Setup

Now create a complete customization stack!

### Exercise: Complete Project Setup

**Prompt suggestion:**
```
Set up a complete customized environment for this project:

1. CLAUDE.md with:
   - Coding standards for Python and TypeScript
   - Testing requirements
   - Review checklist
   - Deployment process
   - Common gotchas and how to avoid them

2. Skills:
   - /quick-test: Run tests for changed files only
   - /full-review: Complete code review workflow
   - /prepare-pr: Prepare code for pull request
   - /deploy-staging: Deploy to staging environment

3. Hooks:
   - Auto-format on file save
   - Run affected tests after edits
   - Prevent commits with failing tests
   - Log all bash commands to audit.log

4. Memory:
   - Save project architecture decisions
   - Save my coding preferences
   - Document ongoing refactoring plan

Walk me through creating each piece and testing it.
```

## 💡 Best Practices for Customization

### 1. Start Simple

Don't customize everything at once:
1. Begin with CLAUDE.md basics
2. Add one useful skill
3. Add hooks as needs arise
4. Let memory build naturally

### 2. Document for Team

If sharing configs:
```
Create a CUSTOMIZATION.md file documenting:
- What's been customized and why
- How to use custom skills
- What hooks are active
- How to modify settings
```

### 3. Version Control

**Do commit:**
- `.claude/settings.json` (project settings)
- `CLAUDE.md`
- `.claude/skills/`

**Don't commit:**
- `~/.claude/` (user settings)
- API keys or tokens
- Personal preferences

### 4. Test Customizations

After adding hooks or skills:
```
Test my new configuration by running through a typical development workflow.
```

### 5. Iterate Based on Usage

Adjust as you learn what's helpful:
```
The auto-formatting hook is triggering too often. Adjust it to only run for files I've explicitly edited, not files Claude reads.
```

## 🔧 Advanced Customization

### Conditional Logic in CLAUDE.md

```markdown
# CLAUDE.md

# When working on backend (Python files)
- Focus on performance and database efficiency
- Always add comprehensive logging

# When working on frontend (TypeScript files)
- Focus on user experience and accessibility
- Keep bundle size in mind
- Test on multiple screen sizes
```

### Skill Composition

Skills can call other skills:

```markdown
---
name: full-cycle
description: Complete feature development cycle
---

1. Run /new-feature to implement
2. Run /full-review to check quality
3. Run /prepare-pr to get ready for review
```

### Environment-Specific Settings

Different settings for dev vs prod:

```json
{
  "environments": {
    "development": {
      "permissions": "allow-all",
      "hooks": { "afterEdit": "..." }
    },
    "production": {
      "permissions": "ask",
      "hooks": { "beforeBash": "..." }
    }
  }
}
```

## 🎓 What You've Learned

By completing this lab, you now understand:

✅ **CLAUDE.md** - Project instructions Claude always follows

✅ **Custom Skills** - Reusable workflows as slash commands

✅ **Automation Hooks** - Actions that run automatically

✅ **Memory System** - Persistent learning across sessions

✅ **Settings** - Fine-tuning behavior and permissions

✅ **Team Sharing** - Configurations that work for everyone

## 🚀 Key Takeaways

1. **Customization is powerful** - Make Claude work your way

2. **CLAUDE.md is essential** - Every project should have one

3. **Skills save time** - Package common workflows

4. **Hooks automate grunt work** - Format, lint, test automatically

5. **Memory builds over time** - Claude gets better as you work together

6. **Share with team** - Consistent tooling for everyone

## 📚 Additional Resources

- **CLAUDE.md Guide**: [Memory and Instructions](https://code.claude.com/docs/en/memory)
- **Skills Documentation**: [Custom Skills](https://code.claude.com/docs/en/skills)
- **Hooks Reference**: [Automation Hooks](https://code.claude.com/docs/en/hooks)
- **Settings Reference**: [Configuration](https://code.claude.com/docs/en/settings)

## 🎉 Congratulations!

You've completed all 6 labs of the Claude Code Hands-On Lab!

### What You've Mastered

Over these labs, you've learned:

1. **Lab 1**: Installation, setup, and basics
2. **Lab 2**: Code exploration with Read, Grep, Glob
3. **Lab 3**: Code editing, testing, and refactoring
4. **Lab 4**: Working with multiple agents
5. **Lab 5**: MCP integration with external services
6. **Lab 6**: Customization for your workflow

### You're Now Ready To

- ✅ Use Claude Code effectively in real projects
- ✅ Navigate and understand any codebase quickly
- ✅ Write and maintain high-quality code with AI assistance
- ✅ Orchestrate complex multi-agent workflows
- ✅ Integrate external tools and services via MCP
- ✅ Customize Claude Code for your team's needs

## 🔜 Next Steps

In [Lab 8 - Parallel Agents and Multi-Sessions](Lab-8-Parallel-Agents-Multi-Sessions.md), you'll learn:
- Launch and manage multiple Claude sessions simultaneously
- Use cross-session messaging to coordinate work
- Master session naming and discovery
- Apply best practices for multi-session coordination

---

#### You have successfully completed Lab 7! Click [Next Lab →](Lab-8-Parallel-Agents-Multi-Sessions.md) to continue.

---

## 📝 Continue Learning

**Apply your skills:**
- Use Claude Code in your daily work
- Share knowledge with your team
- Build custom integrations for your workflow
- Contribute to the community

**Additional resources:**
- [Claude Academy](https://academy.claude.com/)
- [Claude Code Blog](https://claude.com/blog)
- [API Documentation](https://docs.anthropic.com/)
- [Community Examples](https://github.com/topics/claude-code)

**Stay updated:**
- Follow [@AnthropicAI](https://twitter.com/AnthropicAI)
- Subscribe to the Anthropic newsletter
- Check the docs for new features
