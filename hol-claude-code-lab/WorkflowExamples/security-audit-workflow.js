/**
 * Comprehensive Security Audit Workflow
 *
 * This workflow performs a thorough security audit across multiple dimensions:
 * - Static code analysis for vulnerabilities
 * - Dependency security checks
 * - Configuration security review
 * - Authentication/Authorization review
 *
 * Usage:
 *   Ask Claude: "Run the security audit workflow on the current project"
 */

export const meta = {
  name: 'security-audit',
  description: 'Comprehensive security audit with OWASP Top 10 coverage',
  phases: [
    { title: 'Static Analysis', detail: 'Analyzing code for vulnerabilities' },
    { title: 'Dependencies', detail: 'Checking third-party security' },
    { title: 'Configuration', detail: 'Reviewing security settings' },
    { title: 'Report Generation', detail: 'Creating security report' }
  ]
};

// Phase 1: Static Code Analysis (parallel checks)
const staticAnalysis = await parallel([
  // SQL Injection Check
  () => agent(
    `Scan the codebase for SQL injection vulnerabilities:
    - Look for string concatenation in SQL queries
    - Check for unsanitized user input in queries
    - Verify parameterized queries are used
    - Check ORM usage for injection risks
    Report each finding with: file, line, severity, exploit scenario, fix`,
    {
      phase: 'Static Analysis',
      label: 'sql-injection',
      schema: {
        type: 'object',
        properties: {
          vulnerabilities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                file: { type: 'string' },
                line: { type: 'number' },
                severity: { type: 'string' },
                description: { type: 'string' },
                exploitScenario: { type: 'string' },
                remediation: { type: 'string' }
              }
            }
          }
        }
      }
    }
  ),

  // XSS Check
  () => agent(
    `Scan for Cross-Site Scripting (XSS) vulnerabilities:
    - Check for unsanitized user input in HTML output
    - Verify proper encoding of user data
    - Look for dangerouslySetInnerHTML or similar patterns
    - Check for unsafe DOM manipulation
    Report each finding with: file, line, severity, exploit scenario, fix`,
    {
      phase: 'Static Analysis',
      label: 'xss-check',
      schema: {
        type: 'object',
        properties: {
          vulnerabilities: { type: 'array' }
        }
      }
    }
  ),

  // Authentication/Authorization Check
  () => agent(
    `Review authentication and authorization implementation:
    - Check for hardcoded credentials
    - Verify password hashing (not plain text)
    - Look for weak authentication mechanisms
    - Check authorization on sensitive operations
    - Verify session management security
    - Check for missing access controls
    Report each finding with: severity, description, fix`,
    {
      phase: 'Static Analysis',
      label: 'auth-check',
      schema: {
        type: 'object',
        properties: {
          vulnerabilities: { type: 'array' }
        }
      }
    }
  ),

  // Sensitive Data Exposure Check
  () => agent(
    `Scan for sensitive data exposure:
    - Look for API keys or secrets in code
    - Check for sensitive data in logs
    - Verify encryption of sensitive data
    - Check for data exposure in error messages
    - Look for .env files in git
    Report each finding with: severity, exposure risk, fix`,
    {
      phase: 'Static Analysis',
      label: 'data-exposure',
      schema: {
        type: 'object',
        properties: {
          vulnerabilities: { type: 'array' }
        }
      }
    }
  ),

  // Input Validation Check
  () => agent(
    `Review input validation across the application:
    - Check for missing input validation
    - Look for weak validation patterns
    - Verify data type enforcement
    - Check for length/range validation
    - Look for file upload validation
    Report each finding with: location, risk, fix`,
    {
      phase: 'Static Analysis',
      label: 'input-validation',
      schema: {
        type: 'object',
        properties: {
          vulnerabilities: { type: 'array' }
        }
      }
    }
  )
]);

// Phase 2: Dependency Security (parallel)
const dependencyChecks = await parallel([
  // Package vulnerabilities
  () => agent(
    `Check dependencies for known vulnerabilities:
    - Run npm audit / pip audit
    - Check for outdated packages with CVEs
    - Identify packages with known security issues
    - Check for deprecated packages
    Report: package name, vulnerability, CVE if applicable, fix version`,
    {
      phase: 'Dependencies',
      label: 'package-vulnerabilities',
      schema: {
        type: 'object',
        properties: {
          vulnerabilities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                package: { type: 'string' },
                currentVersion: { type: 'string' },
                vulnerability: { type: 'string' },
                cve: { type: 'string' },
                fixVersion: { type: 'string' },
                severity: { type: 'string' }
              }
            }
          }
        }
      }
    }
  ),

  // License compliance
  () => agent(
    `Check dependency licenses for compliance:
    - Identify licenses of all dependencies
    - Flag copyleft licenses (GPL, etc.)
    - Check for license compatibility
    - Identify packages without clear licenses
    Report any concerning licenses`,
    {
      phase: 'Dependencies',
      label: 'license-check',
      schema: {
        type: 'object',
        properties: {
          concerns: { type: 'array' }
        }
      }
    }
  )
]);

// Phase 3: Configuration Security Review
const configReview = await agent(
  `Review security configuration:

  Check:
  1. Environment variables handling:
     - Are secrets in .env files?
     - Are .env files in .gitignore?
     - Is there a .env.example template?

  2. CORS configuration:
     - Is CORS properly restricted?
     - Are origins whitelisted?

  3. HTTP security headers:
     - X-Content-Type-Options
     - X-Frame-Options
     - Content-Security-Policy
     - Strict-Transport-Security

  4. Error handling:
     - Are detailed errors hidden in production?
     - Are stack traces not exposed?

  5. Logging:
     - Is sensitive data not logged?
     - Are logs secure?

  Report findings with recommendations.`,
  {
    phase: 'Configuration',
    label: 'config-review',
    schema: {
      type: 'object',
      properties: {
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              issue: { type: 'string' },
              severity: { type: 'string' },
              recommendation: { type: 'string' }
            }
          }
        }
      }
    }
  }
);

// Phase 4: Generate Comprehensive Report
const securityReport = await agent(
  `Generate a comprehensive security audit report:

  Static Analysis Results:
  - SQL Injection: ${JSON.stringify(staticAnalysis[0])}
  - XSS: ${JSON.stringify(staticAnalysis[1])}
  - Auth/Authz: ${JSON.stringify(staticAnalysis[2])}
  - Data Exposure: ${JSON.stringify(staticAnalysis[3])}
  - Input Validation: ${JSON.stringify(staticAnalysis[4])}

  Dependency Checks:
  - Vulnerabilities: ${JSON.stringify(dependencyChecks[0])}
  - License Issues: ${JSON.stringify(dependencyChecks[1])}

  Configuration Review: ${JSON.stringify(configReview)}

  Create a report with:
  1. Executive Summary
     - Total vulnerabilities found
     - Breakdown by severity (Critical, High, Medium, Low)
     - Overall security posture rating

  2. Critical Issues (must fix before release)
     - List each with details and remediation

  3. High Priority Issues
     - List each with remediation timeline

  4. Medium/Low Priority Issues
     - Grouped by category

  5. OWASP Top 10 Coverage
     - Map findings to OWASP categories

  6. Remediation Roadmap
     - Prioritized action plan
     - Estimated effort for each fix

  7. Compliance Status
     - Note any compliance concerns (GDPR, PCI-DSS, etc.)`,
  {
    phase: 'Report Generation',
    label: 'final-report'
  }
);

// Calculate statistics
const allVulnerabilities = [
  ...(staticAnalysis[0]?.vulnerabilities || []),
  ...(staticAnalysis[1]?.vulnerabilities || []),
  ...(staticAnalysis[2]?.vulnerabilities || []),
  ...(staticAnalysis[3]?.vulnerabilities || []),
  ...(staticAnalysis[4]?.vulnerabilities || []),
  ...(dependencyChecks[0]?.vulnerabilities || [])
];

const criticalCount = allVulnerabilities.filter(
  v => v.severity === 'CRITICAL' || v.severity === 'Critical'
).length;

const highCount = allVulnerabilities.filter(
  v => v.severity === 'HIGH' || v.severity === 'High'
).length;

// Return comprehensive results
return {
  summary: {
    totalVulnerabilities: allVulnerabilities.length,
    critical: criticalCount,
    high: highCount,
    medium:
      allVulnerabilities.length - criticalCount - highCount > 0
        ? allVulnerabilities.length - criticalCount - highCount
        : 0,
    securityPosture:
      criticalCount > 0
        ? '🔴 CRITICAL - Immediate action required'
        : highCount > 5
        ? '🟠 HIGH RISK - Address soon'
        : highCount > 0
        ? '🟡 MODERATE - Plan remediation'
        : '🟢 GOOD - Minor issues only'
  },
  detailedFindings: {
    staticAnalysis: {
      sqlInjection: staticAnalysis[0],
      xss: staticAnalysis[1],
      authAuthz: staticAnalysis[2],
      dataExposure: staticAnalysis[3],
      inputValidation: staticAnalysis[4]
    },
    dependencies: {
      vulnerabilities: dependencyChecks[0],
      licenses: dependencyChecks[1]
    },
    configuration: configReview
  },
  report: securityReport,
  recommendations:
    criticalCount > 0
      ? [
          '⚠️ STOP: Do not release until critical issues are fixed',
          '1. Fix all critical vulnerabilities immediately',
          '2. Conduct re-audit after fixes',
          '3. Consider security code review by expert'
        ]
      : highCount > 0
      ? [
          '📋 Address high priority issues before next release',
          '1. Create tickets for each high severity issue',
          '2. Assign owners and timelines',
          '3. Plan security regression testing'
        ]
      : [
          '✅ Security posture is acceptable',
          '1. Address remaining issues in backlog',
          '2. Schedule regular security audits',
          '3. Consider security training for team'
        ],
  status: '✅ Security audit completed'
};
