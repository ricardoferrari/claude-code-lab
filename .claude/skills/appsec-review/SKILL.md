---
name: appsec-review
description: >
  Perform comprehensive Application Security review following OWASP,
  CWE, and SAST best practices. Analyzes code for vulnerabilities,
  security misconfigurations, and provides prioritized remediation plans.
triggers:
  - security review
  - security audit
  - appsec
  - vulnerability scan
  - OWASP review
  - security assessment
  - pen test preparation
---

# Application Security Review Skill

## Purpose

This skill performs comprehensive security reviews of application code,
identifying vulnerabilities, security misconfigurations, and security-relevant
code quality issues. It produces actionable, prioritized remediation plans
based on industry standards.

## When to Use

Invoke this skill when:
- The user requests a security review or audit
- Preparing for a penetration test or security assessment
- Analyzing code for OWASP Top 10 vulnerabilities
- Reviewing code before production deployment
- Investigating security incidents or potential vulnerabilities
- Evaluating third-party code or dependencies
- Compliance requirements mandate security review

## Skill Workflow

### Phase 1: Discovery and Scoping

1. **Identify the target scope**
   - Ask the user which files, directories, or branches to review
   - Default to reviewing uncommitted changes if no scope specified
   - Read `references/review-checklist.md` for scope guidance

2. **Understand the technology stack**
   - Identify languages, frameworks, and libraries in use
   - Check package managers (package.json, requirements.txt, pom.xml, etc.)
   - Review configuration files (Dockerfile, kubernetes manifests, etc.)
   - Map the application architecture

3. **Identify security-critical components**
   - Authentication and authorization mechanisms
   - Data validation and sanitization points
   - API endpoints and their handlers
   - Database queries and data access layers
   - File operations and external system integrations
   - Cryptographic operations
   - Session management

### Phase 2: Security Analysis

1. **Read security standards reference**
   - Load `references/security-standards.md` to understand applicable standards
   - Note relevant OWASP, CWE, and ASVS requirements for this tech stack

2. **Execute systematic review**
   - Follow the checklist in `references/review-checklist.md`
   - Search for common vulnerability patterns using Grep
   - Read and analyze identified files with Read tool
   - Document findings with file paths and line numbers
   - Capture code snippets as evidence

3. **Vulnerability categories to examine** (see checklist for details):
   - A01: Broken Access Control
   - A02: Cryptographic Failures
   - A03: Injection
   - A04: Insecure Design
   - A05: Security Misconfiguration
   - A06: Vulnerable and Outdated Components
   - A07: Identification and Authentication Failures
   - A08: Software and Data Integrity Failures
   - A09: Security Logging and Monitoring Failures
   - A10: Server-Side Request Forgery (SSRF)

4. **Check for security tooling integration**
   - Look for SonarQube configuration (.sonarqube, sonar-project.properties)
   - Check for other SAST tools in CI/CD pipelines
   - Review existing security scan results if available
   - Note: DO NOT run external scanners without permission

### Phase 3: Finding Classification

For each potential issue identified:

1. **Verify the finding**
   - Is this a true vulnerability or a false positive?
   - Can you trace a complete attack path?
   - Are there compensating controls?
   - What is the exploitability?

2. **Assess severity** using:
   - Technical severity
   - Exploitability
   - Business impact
   - Data sensitivity
   - Exposure level

3. **Classify as**:
   - **Critical**: Immediate exploitation possible, high impact
   - **High**: Likely exploitable, significant impact
   - **Medium**: Requires specific conditions, moderate impact
   - **Low**: Difficult to exploit or minimal impact
   - **Informational**: Security best practice, no direct vulnerability

### Phase 4: Remediation Planning

1. **Load remediation guidelines**
   - Read `references/remediation-guidelines.md`
   - Match findings to remediation patterns

2. **Create remediation plan** for each finding:
   - Finding ID and title
   - Affected files and line numbers
   - Evidence (code snippet)
   - Vulnerability category and CWE/OWASP reference
   - Severity with justification
   - Detailed description of the risk
   - Specific remediation steps
   - Code examples for the fix
   - Testing recommendations
   - Acceptance criteria

3. **Prioritize findings**:
   - Group by severity
   - Consider fix complexity and dependencies
   - Identify quick wins (high impact, low effort)
   - Flag items requiring architectural changes

### Phase 5: Reporting

Produce a structured security review report:

```markdown
# Application Security Review Report

## Executive Summary
[1-2 paragraphs: scope, methodology, key findings count by severity]

## Scope and Methodology
- **Scope**: [files, directories, or commits reviewed]
- **Technology Stack**: [languages, frameworks identified]
- **Standards Applied**: [OWASP version, ASVS level, CWEs referenced]
- **Review Date**: [date]
- **Tools Used**: [manual review, tools consulted]

## Findings Summary
- Critical: [count]
- High: [count]
- Medium: [count]
- Low: [count]
- Informational: [count]

## Critical Findings
[For each critical finding:]

### [ID]: [Title]
**Severity**: Critical  
**Category**: [OWASP category] / [CWE-XXX]  
**File**: `[file path]:[line number]`

**Evidence**:
```[language]
[code snippet]
```

**Description**: [What is the vulnerability and why is it dangerous?]

**Impact**: [Specific consequences of exploitation]

**Recommendation**: [Specific fix steps]

**Example Fix**:
```[language]
[secure code example]
```

**Testing**: [How to verify the fix]

**References**: [URLs to OWASP, CWE, documentation]

---

[Repeat for all findings, grouped by severity]

## Remediation Roadmap

### Phase 1: Immediate (Critical/High)
1. [Finding ID]: [Title] - [Estimated effort]
2. ...

### Phase 2: Near-term (Medium)
1. [Finding ID]: [Title] - [Estimated effort]
2. ...

### Phase 3: Future (Low/Informational)
1. [Finding ID]: [Title] - [Estimated effort]
2. ...

## Security Recommendations

### General Improvements
- [Recommendation 1]
- [Recommendation 2]
- ...

### Security Testing
- [Test types needed]
- [Tools to integrate]

### Security Monitoring
- [Logging improvements]
- [Detection capabilities]

## False Positives and Exceptions
[Document any potential findings that were investigated and determined to be false positives or accepted risks, with justification]

## Limitations
[List any areas not covered, tools not available, or constraints on the review]

## Next Steps
1. [Immediate action 1]
2. [Immediate action 2]
3. [Follow-up review criteria]
```

## Important Guidelines

### DO:
- Base findings on verifiable evidence
- Include file paths and line numbers
- Provide specific, actionable remediation steps
- Reference official security standards
- Explain the risk in business terms
- Differentiate between confirmed and suspected issues
- Document false positives investigated
- Note limitations of the review

### DO NOT:
- Claim the application is secure based on absence of findings
- Expose secrets, credentials, or tokens in the report
- Run destructive tests or tests against production
- Modify code during a read-only security review
- Invent scanner results that weren't actually run
- Dismiss findings without technical justification
- Make assumptions without verification
- Skip verification of suspicious patterns

## Tools and Permissions

- Use **Read** to examine source code
- Use **Grep** to search for vulnerability patterns
- Use **Glob** to find relevant files
- Use **Bash** only for read-only operations (git log, ls, cat)
- DO NOT modify files without explicit permission
- DO NOT run external security scanners without authorization
- DO NOT execute code that hasn't been reviewed

## Continuous Improvement

After completing the review:
1. Note any patterns that could be automated
2. Suggest security tooling integration
3. Recommend developer security training topics
4. Propose secure coding standards for the project

## Related Resources

- `references/security-standards.md` - Detailed security standards reference
- `references/review-checklist.md` - Comprehensive security review checklist
- `references/remediation-guidelines.md` - Fix patterns and examples
- `.claude/agents/security-reviewer.md` - Security reviewer agent for complex audits

## Usage Example

```
User: /appsec-review
User: Review the authentication module for security issues
User: Audit the API endpoints in src/api/ for OWASP Top 10
```

## Notes for Effective Reviews

1. **Context matters**: A pattern that looks vulnerable might be safe in context
2. **Defense in depth**: Multiple weak controls may combine to create security
3. **Business logic flaws**: These often can't be found by pattern matching alone
4. **Framework defaults**: Know what the framework provides automatically
5. **Trust boundaries**: Map where untrusted data enters the system
6. **Privilege levels**: Consider what each component runs as
7. **Attack surface**: Public APIs have different risk than internal services
