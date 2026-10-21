# Lab 5 - Working with Agents

#### Duration: 30 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Understand what agents are and when to use them
- Spawn subagents for parallel execution
- Coordinate multiple agents working on related tasks
- Learn best practices for agent delegation
- Understand agent communication and result aggregation

## 🤖 What Are Agents?

In Claude Code, an **agent** is a Claude instance that works on a specific task. Think of agents as team members you can delegate work to.

### Agent Hierarchy

```
Main Claude Session (You)
    ├── Agent 1: "Review Python code for bugs"
    ├── Agent 2: "Review Angular code for bugs"
    └── Agent 3: "Generate integration tests"
```

### Why Use Agents?

**Parallel Execution:**
- Multiple tasks complete simultaneously
- Dramatically faster than sequential work

**Task Isolation:**
- Each agent focuses on one specific goal
- Results are easier to review

**Specialized Context:**
- Agents can use different tools or approaches
- Some tasks benefit from fresh perspective

## 🍎 Scenario: Large-Scale Code Review

Your team at DataFlow Analytics is preparing for a release. You need to:

1. **Security audit** - Review code for security vulnerabilities
2. **Performance review** - Identify performance bottlenecks
3. **Test coverage** - Ensure all critical paths are tested
4. **Documentation audit** - Verify all public APIs are documented

Doing these sequentially would take hours. With agents, they can run in parallel!

## 🚀 Step 1: Your First Agent

Let's start simple by spawning a single agent.

### Navigate to the Project

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

### Spawn a Single Agent

**Prompt to try:**
```
Spawn an agent to review data_processor.py for potential security vulnerabilities. The agent should:
- Look for SQL injection risks
- Check for unsafe file operations
- Identify any unsafe deserialization
- Report findings with severity levels
```

**What happens:**
1. Claude spawns a subagent with your instructions
2. The agent works independently
3. When done, results return to you
4. You see a summary of findings

**Key observation**: The agent has its own context and tool access!

### Review Agent Results

The agent will report back. You can then:

```
Based on the agent's findings, fix the highest severity issues.
```

## 🔄 Step 2: Parallel Agents

Now let's run multiple agents simultaneously.

### Launch Parallel Code Reviews

**Prompt to try:**
```
Launch three agents in parallel to review the entire Python project:

Agent 1: Security review
- SQL injection, XSS, unsafe operations
- Report critical issues first

Agent 2: Code quality review  
- Code smells, complexity issues
- Suggest refactoring opportunities

Agent 3: Performance review
- Slow operations, inefficient algorithms
- Database query optimization

Aggregate their findings and prioritize by severity.
```

**What to observe:**
1. Claude spawns all three agents at once
2. Each agent works independently
3. Results come back as each completes
4. Main Claude aggregates and prioritizes findings

**Time savings**: Three reviews in the time of one!

## 🎯 Step 3: Agent Coordination

Sometimes agents need to work on related tasks where one depends on another.

### Sequential Agent Workflow

**Prompt to try:**
```
Coordinate a multi-step workflow using agents:

Step 1: Agent discovers all functions lacking docstrings
Step 2: For each function found, spawn an agent to:
   - Analyze the function
   - Generate appropriate docstring
   - Add it to the code
Step 3: Verify all docstrings were added correctly
```

**What Claude does:**
1. Spawns discovery agent
2. Waits for results
3. Spawns multiple parallel agents for each function
4. Aggregates results
5. Validates completion

**Key learning**: Agents can be coordinated in complex workflows!

## 🔍 Step 4: Agent Specialization

Different agent types excel at different tasks.

### Using Specialized Agents

Claude Code provides different agent types:

| Agent Type | Specialization | Best For |
|------------|----------------|----------|
| **general-purpose** | Versatile, all tools | Most tasks |
| **Explore** | Read-only exploration | Code analysis, searching |
| **Plan** | Architectural planning | Feature design, approach planning |

**Prompt to try:**
```
Use the Plan agent to design an approach for adding caching to the data processor. The plan should include:
- Which functions benefit from caching
- What caching strategy to use
- How to invalidate cache
- Testing strategy
```

**Then implement:**
```
Based on the plan, spawn agents to implement the caching layer:
- Agent 1: Implement cache module
- Agent 2: Integrate caching into data processor  
- Agent 3: Add cache tests
```

## 🧪 Step 5: Real-World Agent Scenarios

Let's practice with realistic development scenarios.

### Scenario 1: Feature Implementation

**Task**: Add CSV export functionality with agents.

**Prompt to try:**
```
Implement CSV export feature using agents:

Agent 1 (Plan): Design the CSV export architecture
- API design
- Required dependencies
- Error handling strategy

Agent 2: Implement export logic based on plan
Agent 3: Write comprehensive tests
Agent 4: Update documentation

Coordinate the agents so each starts when dependencies are ready.
```

### Scenario 2: Bug Hunt

**Task**: Find and fix bugs across the codebase.

**Prompt to try:**
```
Launch an agent hunt for bugs:

Agent 1: Search for potential null pointer issues
Agent 2: Find race conditions or concurrency issues
Agent 3: Identify edge cases that aren't handled

Each agent should:
- Report bugs found with file:line references
- Suggest fixes
- Assess severity (critical/high/medium/low)

Aggregate findings, eliminate duplicates, and prioritize.
```

### Scenario 3: Refactoring Campaign

**Task**: Large-scale refactoring with multiple agents.

**Prompt to try:**
```
Coordinate a refactoring campaign:

Agent 1: Identify code duplication across the project
Agent 2: For each duplication found, extract into reusable functions
Agent 3: Update all call sites to use extracted functions
Agent 4: Run full test suite to verify nothing broke

Report any issues that arise during the process.
```

## 🎨 Step 6: Agents with Angular Application

Switch to the frontend and use agents there.

```bash
exit
cd ../angular-task-app
claude
```

### Frontend Multi-Agent Tasks

**Prompt to try:**
```
Launch parallel agents for frontend improvements:

Agent 1: Accessibility audit
- Find missing ARIA labels
- Check keyboard navigation
- Verify color contrast
- Generate fixes

Agent 2: Performance audit
- Large bundle sizes
- Unused dependencies
- Inefficient renders
- Suggest optimizations

Agent 3: TypeScript strictness
- Add strict type checking
- Fix type any usages
- Add missing return types

Each agent should make actual code changes and test them.
```

## 💡 Best Practices for Using Agents

### 1. Clear Instructions

Give agents specific, actionable tasks:

```
# ❌ Vague
Spawn an agent to look at the code

# ✅ Clear
Spawn an agent to find all functions over 50 lines and suggest how to break them down into smaller, single-purpose functions.
```

### 2. Appropriate Scope

Don't make agents' jobs too big or too small:

**Too small**: "Check if line 42 has a semicolon"
- Just do it yourself!

**Too big**: "Rewrite the entire application"
- Break into multiple coordinated agents

**Just right**: "Review all API endpoints for proper error handling"

### 3. Parallel When Possible

If tasks are independent, run them in parallel:

```
# Independent tasks - PARALLEL ✅
Agent 1: Review Python code
Agent 2: Review Angular code  
Agent 3: Update documentation

# Dependent tasks - SEQUENTIAL ✅
Agent 1: Design API (wait)
Agent 2: Implement API based on design (wait)
Agent 3: Write tests for implementation
```

### 4. Aggregate and Review

Always review agent results:

```
Review all agent findings, eliminate duplicates, and create a prioritized action list.
```

### 5. Handle Failures Gracefully

Agents can encounter issues:

```
If any agent fails, report which one and why, then retry with adjusted instructions.
```

## 🎯 Exercise: Complex Agent Orchestration

Complete this advanced exercise on your own!

### Exercise: Full Code Quality Suite

**Task**: Run a comprehensive code quality check across both projects.

**Prompt suggestion:**
```
Execute a full code quality suite using coordinated agents:

For Python project (python-data-processor):
- Agent 1: Security audit
- Agent 2: Code quality (pylint/flake8 style)
- Agent 3: Test coverage analysis
- Agent 4: Documentation completeness

For Angular project (angular-task-app):
- Agent 5: Security audit (npm audit, CORS, XSS)
- Agent 6: Code quality (ESLint, TypeScript strict)
- Agent 7: Test coverage analysis
- Agent 8: Accessibility audit

Requirements:
- All agents run in parallel where possible
- Generate a unified report with all findings
- Prioritize issues by severity across both projects
- Create GitHub issues for top 5 critical items (markdown format)
```

**What to observe:**
- 8 agents working simultaneously
- Cross-project analysis
- Result aggregation
- Prioritization logic

## 🔍 Understanding Agent Communication

### How Agents Report Back

Agents communicate results through:

1. **Status updates**: "Agent started", "Agent completed"
2. **Progress reports**: What the agent is doing
3. **Final results**: Findings, changes made, recommendations
4. **Errors**: If something went wrong

### Reviewing Agent Work

After agents complete:

```
Show me a detailed breakdown of what each agent found and did.
```

```
Which agent's findings are most critical to address first?
```

```
Are there any conflicts or contradictions in agent recommendations?
```

## 🧠 When NOT to Use Agents

Agents aren't always the answer:

**Don't use agents for:**
- Simple, quick tasks (just do it yourself)
- Tasks requiring continuous back-and-forth
- When you need to learn from the process
- Highly interdependent steps that can't be parallelized

**Do use agents for:**
- Time-consuming reviews or analysis
- Parallel independent tasks
- Large-scale repetitive work
- When you need multiple perspectives

## 🎓 What You've Learned

By completing this lab, you now understand:

✅ **Agent basics** - What they are and how they work

✅ **Parallel execution** - Running multiple tasks simultaneously

✅ **Agent coordination** - Sequential and dependent workflows

✅ **Specialization** - Using the right agent type for the task

✅ **Best practices** - When and how to use agents effectively

✅ **Real-world scenarios** - Practical applications in development

## 🚀 Key Takeaways

1. **Agents multiply productivity** - Parallel execution is powerful

2. **Clear instructions matter** - Specific tasks get better results

3. **Coordination is key** - Plan dependencies carefully

4. **Always review** - Agents are powerful but need oversight

5. **Use judiciously** - Not every task needs an agent

6. **Scale matters** - Agents shine with large, complex projects

## 🚀 Advanced: Workflow Tool (Optional)

For complex orchestration with 10+ agents or conditional logic, Claude Code provides the **Workflow tool**.

### When to Use Workflows

**Use the Workflow tool when:**
- You need 10+ agents with complex coordination
- Conditional branching based on results
- Want to save and reuse orchestration logic
- Need advanced error recovery

**Example workflow script:**
```javascript
export const meta = {
  name: 'code-review',
  description: 'Multi-dimensional code review',
  phases: [
    { title: 'Review' },
    { title: 'Report' }
  ]
};

const reviews = await parallel([
  () => agent('Security review', { phase: 'Review' }),
  () => agent('Performance review', { phase: 'Review' }),
  () => agent('Quality review', { phase: 'Review' })
]);

const report = await agent(
  `Aggregate reviews: ${JSON.stringify(reviews)}`,
  { phase: 'Report' }
);

return { reviews, report };
```

**Try a pre-built workflow:**
```
Run the code review workflow from WorkflowExamples/code-review-workflow.js
```

**Learn more:**
- See `WorkflowExamples/` directory for ready-to-run workflows
- Read `AdditionalLearning/Advanced-Agents-and-Workflows.md` for patterns and best practices

## 📚 Additional Resources

- **Agent Documentation**: [Sub-agents Guide](https://code.claude.com/docs/en/sub-agents)
- **Agent Types**: [Available Agents](https://code.claude.com/docs/en/sub-agents#agent-types)
- **Workflows**: [Dynamic Workflows](https://code.claude.com/docs/en/workflows)
- **Best Practices**: [When to Use Agents](https://code.claude.com/docs/en/best-practices#delegation)
- **Advanced Guide**: [Advanced Agents and Workflows](../../AdditionalLearning/Advanced-Agents-and-Workflows.md)
- **Workflow Examples**: [WorkflowExamples/](../../WorkflowExamples/)

## 🔜 Next Steps

In [Lab 6 - MCP Integration](Lab-6-MCP-Integration.md), you'll learn:
- What Model Context Protocol (MCP) is
- How to connect external tools and data sources
- Setting up MCP servers
- Practical integrations (Slack, GitHub, databases, etc.)

---

#### You have successfully completed Lab 5! Click [Next Lab →](Lab-6-MCP-Integration.md) to continue.
