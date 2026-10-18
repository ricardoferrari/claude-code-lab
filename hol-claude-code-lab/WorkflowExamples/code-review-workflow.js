/**
 * Multi-Dimensional Code Review Workflow
 *
 * This workflow reviews code across multiple dimensions in parallel,
 * then aggregates the findings into a prioritized report.
 *
 * Usage:
 *   Ask Claude: "Run the workflow at WorkflowExamples/code-review-workflow.js"
 */

export const meta = {
  name: 'code-review-workflow',
  description: 'Comprehensive multi-dimensional code review',
  phases: [
    { title: 'Parallel Review', detail: 'Running reviews across multiple dimensions' },
    { title: 'Aggregation', detail: 'Combining and prioritizing findings' }
  ]
};

// Phase 1: Launch parallel reviews across different dimensions
const reviews = await parallel([
  // Security Review Agent
  () => agent(
    `Security review of the codebase:
    - Check for SQL injection vulnerabilities
    - Look for XSS vulnerabilities
    - Verify authentication and authorization
    - Check for sensitive data exposure
    - Identify insecure cryptographic storage
    Report findings with severity: CRITICAL, HIGH, MEDIUM, LOW`,
    {
      phase: 'Parallel Review',
      label: 'security-review',
      schema: {
        type: 'object',
        properties: {
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                severity: { type: 'string' },
                issue: { type: 'string' },
                location: { type: 'string' },
                recommendation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  ),

  // Performance Review Agent
  () => agent(
    `Performance review of the codebase:
    - Identify O(n²) or worse algorithms
    - Check for inefficient database queries
    - Look for missing caching opportunities
    - Find memory leaks or excessive allocations
    - Identify blocking operations that could be async
    Report findings with performance impact: HIGH, MEDIUM, LOW`,
    {
      phase: 'Parallel Review',
      label: 'performance-review',
      schema: {
        type: 'object',
        properties: {
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                impact: { type: 'string' },
                issue: { type: 'string' },
                location: { type: 'string' },
                recommendation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  ),

  // Code Quality Review Agent
  () => agent(
    `Code quality review of the codebase:
    - Identify code duplication
    - Find overly complex functions (cyclomatic complexity)
    - Check for proper error handling
    - Verify consistent coding style
    - Look for code smells and anti-patterns
    Report findings with priority: HIGH, MEDIUM, LOW`,
    {
      phase: 'Parallel Review',
      label: 'quality-review',
      schema: {
        type: 'object',
        properties: {
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                priority: { type: 'string' },
                issue: { type: 'string' },
                location: { type: 'string' },
                recommendation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  ),

  // Test Coverage Review Agent
  () => agent(
    `Test coverage review of the codebase:
    - Identify functions without tests
    - Find edge cases that aren't tested
    - Check test quality (not just coverage percentage)
    - Look for brittle or flaky tests
    - Verify error cases are tested
    Report findings with risk: HIGH, MEDIUM, LOW`,
    {
      phase: 'Parallel Review',
      label: 'test-review',
      schema: {
        type: 'object',
        properties: {
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                risk: { type: 'string' },
                issue: { type: 'string' },
                location: { type: 'string' },
                recommendation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  )
]);

// Phase 2: Aggregate and prioritize findings
const aggregatedReport = await agent(
  `Aggregate these code review findings into a prioritized report:

Security Review: ${JSON.stringify(reviews[0])}
Performance Review: ${JSON.stringify(reviews[1])}
Quality Review: ${JSON.stringify(reviews[2])}
Test Coverage Review: ${JSON.stringify(reviews[3])}

Create a comprehensive report that:
1. Lists all findings sorted by severity/priority
2. Removes any duplicates
3. Groups related issues
4. Provides a summary with:
   - Total issues found
   - Breakdown by category
   - Top 5 most critical items to address
5. Suggests a remediation roadmap`,
  {
    phase: 'Aggregation',
    label: 'aggregate-report'
  }
);

// Return results
return {
  summary: {
    securityFindings: reviews[0]?.findings?.length || 0,
    performanceFindings: reviews[1]?.findings?.length || 0,
    qualityFindings: reviews[2]?.findings?.length || 0,
    testCoverageFindings: reviews[3]?.findings?.length || 0,
    totalFindings:
      (reviews[0]?.findings?.length || 0) +
      (reviews[1]?.findings?.length || 0) +
      (reviews[2]?.findings?.length || 0) +
      (reviews[3]?.findings?.length || 0)
  },
  detailedReviews: {
    security: reviews[0],
    performance: reviews[1],
    quality: reviews[2],
    testCoverage: reviews[3]
  },
  aggregatedReport,
  status: '✅ Code review workflow completed'
};
