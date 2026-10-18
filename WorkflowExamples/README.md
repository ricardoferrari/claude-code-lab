# Workflow Examples

This directory contains practical workflow scripts demonstrating advanced agent orchestration patterns in Claude Code.

## 📋 Available Workflows

### 1. Code Review Workflow
**File:** `code-review-workflow.js`

Multi-dimensional code review with parallel agent execution.

**What it does:**
- Security review (SQL injection, XSS, auth issues)
- Performance review (algorithms, DB queries, caching)
- Code quality review (duplication, complexity, patterns)
- Test coverage review (missing tests, edge cases)
- Aggregates findings into prioritized report

**Usage:**
```
Run the workflow at WorkflowExamples/code-review-workflow.js
```

**Best for:** Pre-release code reviews, comprehensive audits

---

### 2. Feature Pipeline Workflow
**File:** `feature-pipeline-workflow.js`

Complete feature development pipeline from design to documentation.

**What it does:**
- Phase 1: Architecture design
- Phase 2: Implementation
- Phase 3: Comprehensive testing
- Phase 4: Documentation generation
- Phase 5: Final verification

**Usage:**
```
Run the feature pipeline workflow for adding CSV export functionality
```

**With custom requirements:**
```
Run WorkflowExamples/feature-pipeline-workflow.js with args:
"Add user authentication with JWT tokens"
```

**Best for:** New feature implementation, ensuring nothing is forgotten

---

### 3. Security Audit Workflow
**File:** `security-audit-workflow.js`

Comprehensive security audit covering OWASP Top 10.

**What it does:**
- Static analysis (SQL injection, XSS, auth, data exposure, input validation)
- Dependency security checks (vulnerabilities, licenses)
- Configuration review (CORS, headers, secrets)
- Generates detailed security report with remediation roadmap

**Usage:**
```
Run the security audit workflow on the current project
```

**Best for:** Pre-deployment security validation, compliance audits

---

## 🚀 Getting Started

### Running a Workflow

**Option 1: Simple command**
```
Run the code review workflow
```

**Option 2: Explicit path**
```
Run the workflow at WorkflowExamples/code-review-workflow.js
```

**Option 3: With arguments**
```
Run the feature pipeline workflow with args describing the feature to implement
```

### Creating Your Own Workflow

1. **Start with the template:**
```javascript
export const meta = {
  name: 'my-workflow',
  description: 'What this workflow does',
  phases: [
    { title: 'Phase 1', detail: 'Description' },
    { title: 'Phase 2', detail: 'Description' }
  ]
};

// Your workflow logic here
const result = await agent('Task', { phase: 'Phase 1' });

return result;
```

2. **Test incrementally:**
```
Test just the first phase of my workflow to make sure it works
```

3. **Add more phases as you validate**

4. **Save for reuse**

---

## 📊 Workflow Patterns

### Pattern 1: Fan-Out / Fan-In (Parallel)
Used in: `code-review-workflow.js`

```javascript
const results = await parallel([
  () => agent('Task 1', { label: 'task1' }),
  () => agent('Task 2', { label: 'task2' }),
  () => agent('Task 3', { label: 'task3' })
]);
// Aggregate results
```

**Use when:** Independent tasks that can run simultaneously

### Pattern 2: Pipeline (Sequential)
Used in: `feature-pipeline-workflow.js`

```javascript
const design = await agent('Design', { phase: 'Design' });
const impl = await agent('Implement based on: ' + design, { phase: 'Implementation' });
const tests = await agent('Test: ' + impl, { phase: 'Testing' });
```

**Use when:** Each step depends on the previous

### Pattern 3: Conditional
Used in: `security-audit-workflow.js`

```javascript
const quickCheck = await agent('Quick check');
if (quickCheck.passed) {
  const fullAudit = await parallel([/* extensive checks */]);
}
```

**Use when:** Expensive operations should only run if conditions are met

---

## 💡 Best Practices

### 1. Clear Phase Names
```javascript
// ❌ Vague
phases: [{ title: 'Step 1' }, { title: 'Step 2' }]

// ✅ Clear
phases: [
  { title: 'Static Analysis', detail: 'Analyzing code for vulnerabilities' },
  { title: 'Report Generation', detail: 'Creating security report' }
]
```

### 2. Meaningful Labels
```javascript
// ❌ Generic
agent('Review', { label: 'agent1' })

// ✅ Descriptive
agent('Security review', { label: 'security-review' })
```

### 3. Use Schemas for Structured Output
```javascript
agent('Find bugs', {
  schema: {
    type: 'object',
    properties: {
      bugs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            severity: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    }
  }
})
```

### 4. Parallelize When Possible
```javascript
// ❌ Unnecessary waiting
const a = await agent('Independent task A');
const b = await agent('Independent task B'); // Waits for A

// ✅ Parallel execution
const [a, b] = await parallel([
  () => agent('Independent task A'),
  () => agent('Independent task B')
]);
```

### 5. Provide Context
```javascript
// ❌ Vague
agent('Check the code')

// ✅ Specific
agent(`Review ${fileName} for SQL injection vulnerabilities:
- Check for string concatenation in queries
- Verify parameterized queries are used
- Report findings with line numbers`)
```

---

## 🎯 Use Cases by Workflow

| Scenario | Workflow | Why |
|----------|----------|-----|
| Pre-release code review | `code-review-workflow.js` | Comprehensive multi-dimensional analysis |
| Implementing new feature | `feature-pipeline-workflow.js` | Ensures complete implementation |
| Security compliance | `security-audit-workflow.js` | OWASP Top 10 coverage |
| Refactoring | Create custom | Map-reduce pattern for consistency |
| Bug hunting | Create custom | Racing pattern with different strategies |

---

## 🔧 Customizing Workflows

### Modify an Existing Workflow

1. **Copy the workflow:**
```bash
cp code-review-workflow.js my-custom-review.js
```

2. **Edit the meta block:**
```javascript
export const meta = {
  name: 'my-custom-review',
  description: 'My custom review workflow',
  // ...
};
```

3. **Modify the agent tasks to fit your needs**

4. **Test it:**
```
Run the workflow at WorkflowExamples/my-custom-review.js
```

### Add New Dimensions to Code Review

Add a new parallel agent to `code-review-workflow.js`:

```javascript
const reviews = await parallel([
  // ... existing agents ...
  
  // New agent
  () => agent(
    `Accessibility review:
    - Check ARIA labels
    - Verify keyboard navigation
    - Check color contrast
    - Report findings with WCAG level`,
    {
      phase: 'Parallel Review',
      label: 'accessibility-review'
    }
  )
]);
```

---

## 📚 Learning Resources

- **Lab 4:** [Working with Agents](../Instructions/Labs/Lab-4-Working-With-Agents.md)
- **Advanced Guide:** [Advanced Agents and Workflows](../AdditionalLearning/Advanced-Agents-and-Workflows.md)
- **Official Docs:** [Workflows Documentation](https://code.claude.com/docs/en/workflows)

---

## 🎓 Next Steps

1. **Run each example workflow** to see how they work
2. **Modify an existing workflow** to fit your needs
3. **Create your own workflow** for a common task
4. **Share workflows** with your team

---

## 🐛 Troubleshooting

### Workflow fails to start
```
Help me debug why the workflow won't start. Check the meta block
and verify the file structure.
```

### Agent times out
```
The workflow is timing out. Help me optimize it by:
1. Reducing agent scope
2. Adding better parallelization
3. Breaking into smaller phases
```

### Results not aggregating correctly
```
The aggregation phase isn't working. Help me debug the result
parsing and ensure consistent output formats.
```

---

## 📝 Contributing

Have a useful workflow pattern? Add it to this directory!

1. Create a new workflow file
2. Follow the naming convention: `purpose-workflow.js`
3. Add comprehensive comments
4. Update this README with your workflow
5. Test it thoroughly

---

Happy orchestrating! 🚀
