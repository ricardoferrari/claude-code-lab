# Advanced Agents and Workflows

This guide provides advanced patterns for using parallel agents and the Workflow tool in Claude Code.

## 🎯 Learning Objectives

- Master advanced parallel agent patterns
- Understand the Workflow tool and when to use it
- Write workflow scripts for complex orchestration
- Handle errors and failures in multi-agent systems
- Optimize performance with proper coordination

---

## 📋 Table of Contents

1. [Advanced Parallel Agent Patterns](#advanced-parallel-agent-patterns)
2. [Introduction to Workflows](#introduction-to-workflows)
3. [Writing Workflow Scripts](#writing-workflow-scripts)
4. [Real-World Workflow Examples](#real-world-workflow-examples)
5. [Best Practices](#best-practices)

---

## 🚀 Advanced Parallel Agent Patterns

### Pattern 1: Fan-Out / Fan-In

Launch multiple agents, wait for all to complete, then aggregate results.

**Use case:** Code review across multiple dimensions

**Prompt to try:**
```
Launch parallel code review agents:

Agent 1: Security review (SQL injection, XSS, auth issues)
Agent 2: Performance review (O(n²) algorithms, database queries, caching)
Agent 3: Code quality review (duplication, complexity, patterns)
Agent 4: Accessibility review (ARIA labels, keyboard nav, contrast)

Wait for all agents to complete, then:
1. Aggregate all findings
2. Remove duplicates
3. Prioritize by severity (Critical > High > Medium > Low)
4. Generate a unified report with recommendations
```

**What happens:**
- 4 agents run simultaneously (fan-out)
- Each produces independent results
- Main coordinator aggregates (fan-in)
- Single prioritized report produced

### Pattern 2: Pipeline

Chain agents where each depends on the previous one's output.

**Use case:** Feature implementation workflow

**Prompt to try:**
```
Execute a feature implementation pipeline:

Stage 1 - Design (Plan agent):
- Design the authentication middleware architecture
- Define interfaces and dependencies
- Output: Design document

Stage 2 - Implementation (waits for Stage 1):
- Implement auth middleware based on design
- Add proper error handling
- Output: Implementation code

Stage 3 - Testing (waits for Stage 2):
- Write comprehensive unit tests
- Add integration tests
- Output: Test suite

Stage 4 - Documentation (waits for Stage 3):
- Generate API documentation
- Add usage examples
- Output: Complete documentation

Report progress at each stage and final results.
```

**Key insight:** Each stage waits for the previous to complete.

### Pattern 3: Map-Reduce

Apply the same operation to multiple items in parallel, then combine.

**Use case:** Refactoring multiple similar files

**Prompt to try:**
```
Refactor all data processing modules using map-reduce:

Map Phase - Launch parallel agents:
For each file matching *_processor.py:
- Agent N: Add type hints to the file
- Add docstrings to all functions
- Ensure proper error handling

Reduce Phase - After all complete:
- Verify consistency across files
- Check for conflicts
- Update shared imports if needed
- Run full test suite

Report: Files processed, changes made, tests status
```

### Pattern 4: Conditional Branching

Different agents based on conditions.

**Use case:** Smart deployment validation

**Prompt to try:**
```
Smart pre-deployment validation:

Agent 1: Quick sanity check
- Lint check
- Type check
- Unit tests

IF Agent 1 passes:
  Launch parallel agents:
  - Agent 2: Integration tests
  - Agent 3: Security scan
  - Agent 4: Performance benchmarks

  IF all pass:
    - Agent 5: Generate deployment report
    - Output: ✅ READY TO DEPLOY
  ELSE:
    - Agent 6: Generate failure analysis
    - Output: ❌ NOT READY - see issues

ELSE:
  Output: ❌ FAILED SANITY CHECK - fix basics first
```

### Pattern 5: Racing Agents

Launch multiple approaches, use the first success.

**Use case:** Finding bugs with different strategies

**Prompt to try:**
```
Race to find the source of a memory leak:

Launch 3 agents with different approaches:

Agent A: Static analysis approach
- Analyze code for circular references
- Check for event listener leaks
- Look for cache growth patterns

Agent B: Pattern matching approach
- Search for known leak patterns
- Check for missing cleanup code
- Identify resource allocation without deallocation

Agent C: Dependency analysis approach
- Check third-party library issues
- Analyze import patterns
- Review lifecycle hooks

Use the first agent that finds the likely cause.
If multiple find issues, aggregate all findings.
```

---

## 🔧 Introduction to Workflows

### What is the Workflow Tool?

The **Workflow tool** provides programmatic control over agent orchestration with JavaScript-based scripts.

### When to Use Workflows vs Simple Agents

**Use Simple Agents When:**
- Task is straightforward
- 1-5 agents needed
- Simple parallel or sequential pattern
- No complex conditional logic

**Use Workflow Tool When:**
- Complex coordination needed (10+ agents)
- Conditional branching based on results
- Need precise control over execution order
- Want to reuse orchestration logic
- Need error recovery strategies

### Workflow vs Agent Tool Comparison

| Feature | Agent Tool | Workflow Tool |
|---------|-----------|---------------|
| **Complexity** | Simple prompts | JavaScript scripts |
| **Scale** | 1-10 agents | 10-100+ agents |
| **Logic** | Natural language | Programmatic |
| **Reusability** | One-time use | Save and reuse |
| **Error Handling** | Basic | Advanced |
| **Performance** | Good | Optimized |

---

## 📝 Writing Workflow Scripts

### Basic Workflow Structure

Every workflow script has three parts:

```javascript
// 1. Metadata (required)
export const meta = {
  name: 'my-workflow',
  description: 'What this workflow does',
  phases: [
    { title: 'Phase 1 Name' },
    { title: 'Phase 2 Name' }
  ]
};

// 2. Workflow logic
async function runWorkflow() {
  // Your orchestration code here
  const results = await agent('Task description', { 
    phase: 'Phase 1 Name' 
  });
  
  return results;
}

// 3. Execute
const output = await runWorkflow();
return output;
```

### Example 1: Simple Parallel Workflow

**File:** `review-codebase.js`

```javascript
export const meta = {
  name: 'review-codebase',
  description: 'Multi-dimensional code review',
  phases: [
    { title: 'Code Review' },
    { title: 'Report Generation' }
  ]
};

// Run parallel reviews
const reviews = await parallel([
  () => agent('Security review: Check for vulnerabilities', {
    phase: 'Code Review',
    label: 'security'
  }),
  () => agent('Performance review: Find bottlenecks', {
    phase: 'Code Review',
    label: 'performance'
  }),
  () => agent('Quality review: Check code smells', {
    phase: 'Code Review',
    label: 'quality'
  })
]);

// Aggregate results
const report = await agent(
  `Aggregate these reviews into a prioritized report: ${JSON.stringify(reviews)}`,
  { phase: 'Report Generation' }
);

return { reviews, report };
```

**Usage:**
```
Run the workflow script at review-codebase.js on the python-data-processor project.
```

### Example 2: Pipeline Workflow

**File:** `feature-pipeline.js`

```javascript
export const meta = {
  name: 'feature-pipeline',
  description: 'Complete feature development pipeline',
  phases: [
    { title: 'Design' },
    { title: 'Implementation' },
    { title: 'Testing' },
    { title: 'Documentation' }
  ]
};

// Stage 1: Design
const design = await agent(
  'Design the caching layer architecture for the data processor',
  { phase: 'Design', label: 'architect' }
);

// Stage 2: Implementation (waits for design)
const implementation = await agent(
  `Implement the caching layer based on this design: ${design}`,
  { phase: 'Implementation', label: 'implement' }
);

// Stage 3: Testing (waits for implementation)
const tests = await agent(
  'Write comprehensive tests for the caching layer',
  { phase: 'Testing', label: 'test' }
);

// Stage 4: Documentation (waits for tests)
const docs = await agent(
  'Generate documentation for the caching layer with usage examples',
  { phase: 'Documentation', label: 'document' }
);

return {
  design,
  implementation,
  tests,
  docs,
  status: '✅ Feature pipeline complete'
};
```

### Example 3: Conditional Workflow

**File:** `smart-deploy-check.js`

```javascript
export const meta = {
  name: 'smart-deploy-check',
  description: 'Validates code is ready for deployment',
  phases: [
    { title: 'Quick Checks' },
    { title: 'Full Validation' },
    { title: 'Decision' }
  ]
};

// Quick sanity checks
const quickCheck = await agent(
  'Run quick checks: lint, type check, unit tests',
  { phase: 'Quick Checks' }
);

// Parse results (simplified)
const quickCheckPassed = !quickCheck.includes('FAILED');

if (!quickCheckPassed) {
  return {
    status: '❌ NOT READY',
    reason: 'Failed quick checks',
    details: quickCheck
  };
}

// Full validation in parallel
const validations = await parallel([
  () => agent('Run integration tests', { 
    phase: 'Full Validation', 
    label: 'integration' 
  }),
  () => agent('Security vulnerability scan', { 
    phase: 'Full Validation', 
    label: 'security' 
  }),
  () => agent('Performance benchmarks', { 
    phase: 'Full Validation', 
    label: 'performance' 
  })
]);

// Check if all passed
const allPassed = validations.every(v => !v.includes('FAILED'));

if (allPassed) {
  const report = await agent(
    'Generate deployment approval report',
    { phase: 'Decision' }
  );
  
  return {
    status: '✅ READY TO DEPLOY',
    validations,
    report
  };
} else {
  return {
    status: '❌ NOT READY',
    reason: 'Validation failures',
    validations
  };
}
```

### Example 4: Map-Reduce Workflow

**File:** `refactor-all-tests.js`

```javascript
export const meta = {
  name: 'refactor-all-tests',
  description: 'Refactor all test files to use async/await',
  phases: [
    { title: 'Discovery' },
    { title: 'Refactoring' },
    { title: 'Verification' }
  ]
};

// Discover all test files
const discovery = await agent(
  'Find all test files matching **/*test*.py',
  { phase: 'Discovery' }
);

// Parse test files (simplified - would use Glob tool in reality)
const testFiles = [
  'tests/test_processor.py',
  'tests/test_validator.py',
  'tests/test_database.py'
];

// Map: Refactor each file in parallel
const refactorResults = await parallel(
  testFiles.map(file => () => 
    agent(
      `Refactor ${file} to use async/await pattern`,
      { phase: 'Refactoring', label: file }
    )
  )
);

// Reduce: Verify all together
const verification = await agent(
  'Run full test suite and verify all tests still pass',
  { phase: 'Verification' }
);

return {
  filesRefactored: testFiles.length,
  results: refactorResults,
  verification,
  status: verification.includes('PASSED') ? '✅ SUCCESS' : '❌ FAILED'
};
```

---

## 🎯 Real-World Workflow Examples

### Workflow 1: Comprehensive Security Audit

**Scenario:** Pre-release security validation

**Prompt to try:**
```
Create and run a comprehensive security audit workflow:

Phase 1 - Static Analysis (parallel):
- Agent: SQL injection vulnerabilities
- Agent: XSS vulnerabilities  
- Agent: Authentication/authorization issues
- Agent: Sensitive data exposure

Phase 2 - Dependency Analysis (parallel):
- Agent: npm audit / pip audit
- Agent: Known CVE checks
- Agent: License compliance

Phase 3 - Configuration Review:
- Agent: Check .env files not in git
- Agent: Verify secure headers
- Agent: Review CORS configuration

Phase 4 - Report:
- Aggregate all findings
- Categorize by OWASP Top 10
- Generate executive summary
- Create remediation plan

Save the workflow script for future releases.
```

### Workflow 2: Database Migration Validation

**Scenario:** Ensure safe database migrations

**Prompt to try:**
```
Create a database migration validation workflow:

Phase 1 - Static Analysis:
- Agent: Review SQL for destructive operations
- Agent: Check for missing rollback scripts
- Agent: Verify foreign key constraints

Phase 2 - Backup Verification:
- Agent: Confirm backup strategy exists
- Agent: Test backup restoration

Phase 3 - Dry Run (parallel):
- Agent: Run migration on test database
- Agent: Verify data integrity
- Agent: Check application still works

Phase 4 - Performance Impact:
- Agent: Estimate migration duration
- Agent: Check for locking issues
- Agent: Verify indexing strategy

Phase 5 - Go/No-Go Decision:
- Aggregate all checks
- Generate decision report
- Provide rollback plan

Output: Migration approval status with evidence.
```

### Workflow 3: Microservices Health Check

**Scenario:** Validate all services in a microservices architecture

**Prompt to try:**
```
Create a microservices health check workflow:

Phase 1 - Discovery:
- Find all service configurations
- Identify dependencies

Phase 2 - Individual Health Checks (parallel):
For each service:
- Agent: Check service is running
- Agent: Verify endpoint responses
- Agent: Check database connections
- Agent: Verify message queue connectivity

Phase 3 - Integration Checks (parallel):
- Agent: Test service-to-service communication
- Agent: Verify API contracts
- Agent: Check authentication flow

Phase 4 - Performance Checks (parallel):
- Agent: Check response times
- Agent: Verify resource usage
- Agent: Check error rates

Phase 5 - Report:
- Service health matrix
- Dependency graph with status
- Alert on any issues
- Trend analysis

Output: System health dashboard data.
```

### Workflow 4: CI/CD Pipeline Validation

**Scenario:** Ensure CI/CD configuration is correct

**Prompt to try:**
```
Create a CI/CD validation workflow:

Phase 1 - Configuration Review (parallel):
- Agent: Review GitHub Actions / GitLab CI config
- Agent: Check build steps
- Agent: Verify test execution
- Agent: Check deployment steps

Phase 2 - Security Checks (parallel):
- Agent: Check for hardcoded secrets
- Agent: Verify secrets management
- Agent: Review access permissions

Phase 3 - Simulation:
- Agent: Simulate build process locally
- Agent: Check for missing dependencies
- Agent: Verify all scripts exist

Phase 4 - Documentation:
- Agent: Verify README has CI badge
- Agent: Check deployment docs are current
- Agent: Verify troubleshooting guide

Output: CI/CD health report with recommendations.
```

---

## 💡 Best Practices

### 1. Design Before Implementation

**❌ Don't:**
```
Launch 20 agents to refactor everything at once!
```

**✅ Do:**
```
First, use a Plan agent to design the refactoring strategy,
then create a workflow based on that plan.
```

### 2. Start Simple, Then Scale

**Progression:**
1. Start with simple Agent tool prompts
2. If >5 agents needed, consider workflow
3. Prototype workflow logic with comments
4. Test with small subset first
5. Scale to full dataset

### 3. Handle Errors Gracefully

**In Workflow Scripts:**
```javascript
try {
  const result = await agent('Risky operation', { phase: 'Execution' });
  return result;
} catch (error) {
  // Fallback strategy
  const recovery = await agent('Alternative approach', { 
    phase: 'Recovery' 
  });
  return { result: recovery, hadError: true };
}
```

### 4. Use Meaningful Labels

**❌ Bad labels:**
```javascript
agent('Review code', { label: 'agent1' })
agent('Review code', { label: 'agent2' })
```

**✅ Good labels:**
```javascript
agent('Security review', { label: 'security-review' })
agent('Performance review', { label: 'performance-review' })
```

### 5. Monitor Progress

For long-running workflows:
```
Show me the current status of the workflow including which phase we're in
and which agents are running.
```

### 6. Save and Reuse Workflows

Common workflows should be saved:
```
Save this workflow as 'pre-deploy-validation' so I can run it
before every deployment.
```

### 7. Document Workflows

Add comments in workflow scripts:
```javascript
// Phase 1: Quick sanity checks
// These run fast (<30s) to fail fast if basics are broken
const quickChecks = await agent(/*...*/);

// Phase 2: Full validation  
// Only runs if quick checks pass (saves time)
if (quickChecks.passed) {
  const fullValidation = await parallel([/*...*/]);
}
```

### 8. Optimize for Parallelization

**❌ Unnecessary sequencing:**
```javascript
const a = await agent('Independent task A');
const b = await agent('Independent task B'); // Waits for A unnecessarily
```

**✅ Parallel execution:**
```javascript
const [a, b] = await parallel([
  () => agent('Independent task A'),
  () => agent('Independent task B')
]);
```

### 9. Keep Agents Focused

**❌ Too broad:**
```javascript
agent('Review the entire codebase for everything')
```

**✅ Focused:**
```javascript
agent('Review authentication code for security vulnerabilities')
```

### 10. Aggregate Results Thoughtfully

After parallel agents complete:
```
Don't just concatenate results. Instead:
1. Remove duplicates
2. Prioritize by severity
3. Group related findings
4. Provide actionable recommendations
```

---

## 🎓 Workflow Development Process

### Step 1: Identify the Need
- Do I have >5 agents?
- Do I need conditional logic?
- Will I reuse this orchestration?

### Step 2: Design the Workflow
```
Use a Plan agent to design the workflow structure:
- What phases are needed?
- What runs in parallel vs sequential?
- What are the dependencies?
- How do we handle failures?
```

### Step 3: Write the Script

Start with the meta block:
```javascript
export const meta = {
  name: 'my-workflow',
  description: 'Clear description',
  phases: [/* ... */]
};
```

### Step 4: Test Incrementally

Test each phase:
```
Test just Phase 1 of the workflow to make sure it works before
adding Phase 2.
```

### Step 5: Run and Refine

```
Run the complete workflow. If any issues arise, help me debug
and refine the script.
```

### Step 6: Save for Reuse

```
Save this workflow so I can run it with a simple command in the future.
```

---

## 📊 Performance Considerations

### Agent Pool Limits

- Default: ~10 concurrent agents
- Too many parallel agents can slow down each one
- Use phases to batch work

### Cost Optimization

**❌ Wasteful:**
```javascript
// Runs 100 agents even if first fails
const results = await parallel(
  allFiles.map(file => () => agent(`Review ${file}`))
);
```

**✅ Efficient:**
```javascript
// Quick check first
const quickCheck = await agent('Quick sanity check');
if (!quickCheck.passed) {
  return 'Failed quick check - not running full review';
}

// Only run expensive work if needed
const results = await parallel(/*...*/);
```

### Caching Strategies

Workflows can leverage prompt caching:
- Keep context windows similar
- Reuse common prompts
- Structure for cache hits

---

## 🔗 Integration with Other Features

### Workflows + MCP

```javascript
// Use MCP tools in workflows
const dbData = await agent(
  'Using SQLite MCP, query recent failed jobs',
  { phase: 'Data Collection' }
);

const uiValidation = await agent(
  'Using Playwright MCP, verify UI displays this data correctly',
  { phase: 'UI Validation' }
);
```

### Workflows + Skills

```
Create a skill '/run-security-audit' that executes the 
comprehensive security audit workflow.
```

### Workflows + Hooks

```
Set up a pre-commit hook that runs a lightweight validation workflow
before allowing commits.
```

---

## 📚 Additional Resources

- **Workflow Documentation**: [Official Workflow Guide](https://code.claude.com/docs/en/workflows)
- **Agent SDK**: [Building Custom Agents](https://code.claude.com/docs/en/agent-sdk)
- **Lab 4**: [Working with Agents](../Instructions/Labs/Lab-4-Working-With-Agents.md)

---

## 🎉 Summary

**Parallel Agents:**
- Use for independent tasks that can run simultaneously
- 5+ patterns: fan-out/fan-in, pipeline, map-reduce, conditional, racing

**Workflows:**
- JavaScript-based scripts for complex orchestration
- Use when >10 agents or complex logic needed
- Support parallel, sequential, and conditional execution

**Best Practices:**
- Design before implementing
- Start simple, scale gradually
- Handle errors gracefully
- Use meaningful labels
- Optimize for parallelization

**Next Steps:**
- Practice the patterns in this guide
- Create your own workflows
- Combine with MCP for powerful integrations
- Share reusable workflows with your team

Happy orchestrating! 🚀
