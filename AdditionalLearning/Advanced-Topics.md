# Advanced Topics for Claude Code

This document provides additional learning materials for advanced Claude Code users who have completed the main lab exercises.

## 🚀 Advanced Features

### 1. Advanced Agents and Workflows

Master parallel agent patterns and workflow orchestration for complex multi-agent systems.

**Topics:**
- Advanced parallel agent patterns (fan-out/fan-in, pipeline, map-reduce, conditional, racing)
- Workflow tool and script authoring
- Complex agent coordination strategies
- Error handling in multi-agent workflows
- Real-world workflow examples (security audits, feature pipelines, code reviews)

**Comprehensive Guide:**
- **[Advanced Agents and Workflows Guide](Advanced-Agents-and-Workflows.md)** - Complete guide with patterns and examples

**Ready-to-Run Examples:**
- **[Workflow Examples Directory](../WorkflowExamples/)** - Production-ready workflow scripts:
  - `code-review-workflow.js` - Multi-dimensional code review
  - `feature-pipeline-workflow.js` - Complete feature development pipeline
  - `security-audit-workflow.js` - OWASP Top 10 security audit

**Official Resources:**
- [Workflows Documentation](https://code.claude.com/docs/en/workflows)
- [A Harness for Every Task](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)

**Quick Start:**
```
Run the code review workflow from WorkflowExamples/code-review-workflow.js
```

### 2. Remote Control

Access Claude Code sessions from anywhere.

**Topics:**
- Setting up Remote Control
- Mobile access via Claude app
- Session handoff between devices
- Dispatch for remote task initiation

**Resources:**
- [Remote Control Guide](https://code.claude.com/docs/en/remote-control)
- [Mobile App Usage](https://code.claude.com/docs/en/mobile)

### 3. Browser Automation with Playwright MCP

Automate UI testing and validation using real browsers.

**Topics:**
- Setting up Playwright MCP server
- Automated browser testing
- Visual regression testing
- Performance measurement
- Accessibility audits
- Cross-browser testing
- Responsive design validation

**Resources:**
- [Playwright MCP Guide](playwright-mcp-guide.md) - Comprehensive guide in this directory
- [Playwright Documentation](https://playwright.dev/)
- Lab 5, Step 7 - Hands-on Playwright integration

**Example use cases:**
- Validate UI implementations in real browsers
- Test user interactions (forms, navigation, workflows)
- Measure Core Web Vitals (FCP, LCP, TTI)
- Check WCAG accessibility compliance
- Test responsive design across viewports
- Generate visual documentation with screenshots

### 4. CI/CD Integration

Automate code review and quality checks in your pipeline.

**Topics:**
- GitHub Actions integration
- GitLab CI/CD workflows
- Automated PR reviews
- Security scanning in CI
- Playwright tests in CI/CD

**Resources:**
- [GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd)

### 4. Custom Agent Development

Build your own agents with the Agent SDK.

**Topics:**
- Agent SDK fundamentals
- Custom tool development
- Agent orchestration patterns
- Deployment strategies

**Resources:**
- [Agent SDK Overview](https://code.claude.com/docs/en/agent-sdk/overview)

### 5. Scheduled Tasks & Routines

Automate recurring development tasks.

**Topics:**
- Cron-based scheduling
- Cloud routines
- Event-driven triggers
- Loop commands for polling

**Resources:**
- [Routines](https://code.claude.com/docs/en/routines)
- [Desktop Scheduled Tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks)

## 💼 Real-World Use Cases

### Code Migration Projects

**Scenario:** Migrating a large codebase to a new framework or language.

**Approach:**
1. Use Explore agent to map the codebase structure
2. Create migration strategy with Plan agent
3. Spawn multiple agents to handle different modules
4. Validate with comprehensive test generation
5. Review and refine iteratively

### Legacy Code Modernization

**Scenario:** Updating old code to modern standards.

**Tasks:**
- Add type hints to Python
- Convert callbacks to async/await
- Replace deprecated APIs
- Add comprehensive tests
- Update documentation

### Security Audits

**Scenario:** Comprehensive security review before production.

**Workflow:**
1. Agent 1: OWASP Top 10 check
2. Agent 2: Dependency vulnerability scan
3. Agent 3: Authentication/authorization review
4. Agent 4: Data validation audit
5. Aggregate findings and prioritize

### Documentation Generation

**Scenario:** Generate comprehensive project documentation.

**Tasks:**
- API documentation from code
- Architecture diagrams
- Setup guides
- Troubleshooting guides
- Contributing guidelines

## 🔧 Advanced Customization Patterns

### Team-Wide Standards

Create shared CLAUDE.md files that enforce team conventions:

```markdown
# Team Standards (Enforced)

## Git Workflow
- Always create feature branches
- Require PR reviews before merging
- Run tests before pushing
- Use conventional commits

## Code Quality Gates
- Test coverage must be > 80%
- No TODO comments in main branch
- All public APIs must have docstrings
- Type hints required for Python
```

### Context-Aware Skills

Skills that adapt based on current state:

```markdown
---
name: smart-commit
description: Intelligent commit based on changes
---

1. Analyze git diff to understand changes
2. Run tests if code changed
3. Update docs if API changed
4. Choose commit type (feat/fix/docs/refactor)
5. Generate conventional commit message
6. Create commit and suggest PR if needed
```

### Chained Hooks

Complex automation with multiple hooks:

```json
{
  "hooks": {
    "beforeEdit": {
      "**/*": "git stash"
    },
    "afterEdit": {
      "**/*.py": "black {file} && mypy {file}",
      "**/*.ts": "prettier --write {file} && eslint {file}"
    },
    "beforeBash": {
      "git commit*": "pytest && echo 'Tests passed'"
    }
  }
}
```

## 📊 Performance Optimization

### Token Usage Optimization

**Strategies:**
- Use specific file references instead of workspace search
- Limit agent context to relevant files only
- Use caching effectively with prompt design
- Choose appropriate models for tasks

### Efficient Agent Coordination

**Patterns:**
- Spawn agents for truly parallel work
- Use single-session for sequential tasks
- Aggregate results at appropriate levels
- Avoid over-delegation (overhead cost)

## 🎓 Learning Resources

### Official Resources

- [Claude Code Documentation](https://code.claude.com/docs/en/)
- [Claude Academy](https://academy.claude.com/)
- [Anthropic API Documentation](https://docs.anthropic.com/)

### Community

- [GitHub Discussions](https://github.com/anthropics/claude-code/discussions)
- [Example Projects](https://github.com/topics/claude-code)

### Courses

- [Claude Code 101](https://academy.claude.com/courses/claude-code-101)
- [Claude Code in Action](https://academy.claude.com/courses/claude-code-in-action)

## 🔬 Experimental Features

Stay updated on beta features and experiments:

- Auto model selection
- Enhanced context windows
- New MCP integrations
- Collaborative sessions

Check the [changelog](https://code.claude.com/changelog) regularly for updates.

## 💡 Tips from Power Users

### Prompt Engineering

**Be specific with context:**
```
# ❌ Generic
Fix the bug

# ✅ Specific
Fix the null pointer exception in UserService.authenticate() at line 45.
The error occurs when the email field is empty. Add validation and return
an appropriate error message.
```

**Use incremental refinement:**
1. Start with working code
2. Test it
3. Refine based on results
4. Repeat until perfect

### Workflow Optimization

**Morning routine:**
```
/loop 1h check for PR reviews, failed CI builds, and new issues.
Prioritize and report top 3 items needing attention.
```

**Before merge:**
```
/prepare-pr - custom skill that:
- Runs full test suite
- Checks coverage
- Lints all changed files
- Updates CHANGELOG
- Verifies branch is up to date
```

## 🎯 Practice Challenges

### Challenge 1: Multi-Service Refactor

Refactor a microservices architecture to use shared types.

**Requirements:**
- 3+ services with duplicate interfaces
- Extract to shared library
- Update all services
- Maintain backward compatibility
- Add tests

### Challenge 2: Internationalization

Add i18n to an existing application.

**Requirements:**
- Extract all strings
- Create translation files
- Update components to use i18n
- Add language switching
- Test in multiple locales

### Challenge 3: Performance Optimization

Optimize a slow application.

**Requirements:**
- Profile to find bottlenecks
- Implement caching
- Optimize database queries
- Add lazy loading
- Measure improvements

## 📚 Further Reading

- **Prompt Engineering:** [Best Practices](https://docs.anthropic.com/claude/docs/prompt-engineering)
- **AI Safety:** [Responsible AI Development](https://www.anthropic.com/index/core-views-on-ai-safety)
- **API Limits:** [Rate Limits and Pricing](https://docs.anthropic.com/claude/reference/rate-limits)

---

**Continue your learning journey and push the boundaries of AI-assisted development!**
