# Security Standards Reference

## Overview

This document provides references to current security standards, frameworks,
and guidelines used in application security reviews. Always consult the
official sources for the most current information.

## OWASP Top 10 (2025)

**Official Source**: https://owasp.org/projects/top-ten/

**Version**: 2025

The OWASP Top 10 is a standard awareness document for developers and web
application security. It represents a broad consensus about the most critical
security risks to web applications.

### A01:2021 - Broken Access Control

**Risk**: Users can act outside of their intended permissions.

**Common Weaknesses**:
- Violation of principle of least privilege
- Bypassing access control checks by modifying the URL, internal state, or HTML
- Viewing or editing someone else's account (IDOR)
- Missing access controls for POST, PUT, DELETE
- Elevation of privilege (acting as a user without being logged in, or as admin when logged in as a user)
- API access control weaknesses for PUT/POST/DELETE
- Force browsing to authenticated pages as an unauthenticated user
- CORS misconfiguration allowing unauthorized API access

**CWE Mappings**: CWE-200, CWE-201, CWE-352, CWE-425, CWE-639

### A02:2021 - Cryptographic Failures

**Risk**: Exposure of sensitive data due to lack of encryption or weak cryptography.

**Common Weaknesses**:
- Transmitting data in clear text (HTTP, FTP, SMTP)
- Using old or weak cryptographic algorithms or protocols (MD5, SHA1, DES, RC4, SSL, TLS 1.0)
- Using default crypto keys or weak generated keys
- Not enforcing encryption (missing security headers, certificates)
- Not validating received server certificates
- Using weak password hashing (MD5, SHA1, bcrypt with low rounds)
- Storing sensitive data unnecessarily
- Not using authenticated encryption (AES-GCM, ChaCha20-Poly1305)

**CWE Mappings**: CWE-259, CWE-327, CWE-331, CWE-798

### A03:2021 - Injection

**Risk**: Untrusted data sent to an interpreter as part of a command or query.

**Common Injection Types**:
- **SQL Injection** (CWE-89): Malicious SQL statements inserted into queries
- **NoSQL Injection** (CWE-943): Injection into NoSQL database queries
- **OS Command Injection** (CWE-78): Executing OS commands via the application
- **LDAP Injection** (CWE-90): Manipulating LDAP queries
- **Expression Language Injection** (CWE-917): Template injection attacks
- **Log Injection** (CWE-117): Injecting malicious content into logs
- **XML Injection / XXE** (CWE-611): XML External Entity attacks

**Prevention**:
- Use parameterized queries (prepared statements)
- Use ORM frameworks properly
- Input validation with allow-lists
- Escape special characters
- Use LIMIT and other SQL controls to prevent mass disclosure

**CWE Mappings**: CWE-73, CWE-74, CWE-77, CWE-78, CWE-79, CWE-89, CWE-91, CWE-917

### A04:2021 - Insecure Design

**Risk**: Missing or ineffective security controls in the design phase.

**Focus Areas**:
- Threat modeling
- Secure design patterns and principles
- Reference architectures
- Security requirements gathering
- Defense in depth
- Secure by default configurations
- Security controls testing

**Common Issues**:
- Missing rate limiting on sensitive operations
- Insufficient transaction limits
- Business logic flaws
- Credential stuffing protections missing
- Weak password recovery flows
- Insecure direct object references by design

**CWE Mappings**: CWE-73, CWE-183, CWE-209, CWE-213, CWE-235, CWE-256, CWE-257, CWE-266, CWE-269, CWE-280, CWE-311, CWE-522, CWE-766

### A05:2021 - Security Misconfiguration

**Risk**: Improperly configured security settings.

**Common Misconfigurations**:
- Missing appropriate security hardening
- Unnecessary features enabled (ports, services, pages, accounts, privileges)
- Default accounts and passwords still enabled
- Error handling reveals stack traces or overly informative errors
- Security features disabled or insecurely configured
- Security headers missing or misconfigured
- Software out of date or vulnerable
- Verbose error messages leak sensitive information

**Key Areas to Check**:
- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- CORS policies
- Cookie security (Secure, HttpOnly, SameSite flags)
- TLS configuration
- Cloud storage permissions (S3 buckets, Azure Blobs)
- Container configurations
- Default credentials

**CWE Mappings**: CWE-2, CWE-11, CWE-13, CWE-15, CWE-16, CWE-260, CWE-315, CWE-520, CWE-526, CWE-537

### A06:2021 - Vulnerable and Outdated Components

**Risk**: Using components with known vulnerabilities.

**Common Issues**:
- Unknown versions of all components used (client and server-side)
- Software is vulnerable, unsupported, or out of date
- Not scanning for vulnerabilities regularly
- Not fixing or upgrading underlying platform, frameworks, dependencies
- Developers not testing compatibility of updated libraries
- Not securing components' configurations

**Tools to Identify**:
- npm audit (Node.js)
- pip-audit (Python)
- OWASP Dependency-Check
- Snyk
- GitHub Dependabot
- Trivy (containers)

**CWE Mappings**: CWE-1035, CWE-1104

### A07:2021 - Identification and Authentication Failures

**Risk**: Compromised authentication and session management.

**Common Weaknesses**:
- Permits automated attacks (credential stuffing, brute force)
- Permits default, weak, or well-known passwords
- Weak or ineffective credential recovery (answers to "secret questions")
- Plain text, encrypted, or weakly hashed passwords
- Missing or ineffective multi-factor authentication
- Exposes session IDs in the URL
- Session IDs not invalidated after logout
- Sessions not properly reused after successful login

**Prevention**:
- Implement MFA
- Use strong password requirements
- Implement rate limiting and account lockout
- Use secure session management
- Regenerate session IDs on authentication state changes
- Use secure password storage (Argon2, scrypt, bcrypt, PBKDF2)

**CWE Mappings**: CWE-255, CWE-259, CWE-287, CWE-288, CWE-290, CWE-294, CWE-295, CWE-297, CWE-306, CWE-307, CWE-521, CWE-522, CWE-640, CWE-798, CWE-940

### A08:2021 - Software and Data Integrity Failures

**Risk**: Code and infrastructure that does not protect against integrity violations.

**Common Issues**:
- Applications rely on plugins, libraries from untrusted sources
- Insecure CI/CD pipeline
- Auto-update functionality without sufficient integrity verification
- Objects or data encoded or serialized in a structure that an attacker can see and modify
- Insecure deserialization

**Examples**:
- Java deserialization vulnerabilities
- Python pickle vulnerabilities
- Unsigned or unverified packages
- SolarWinds supply chain attack
- Compromised npm packages

**CWE Mappings**: CWE-345, CWE-353, CWE-426, CWE-494, CWE-502, CWE-565, CWE-784, CWE-829

### A09:2021 - Security Logging and Monitoring Failures

**Risk**: Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response.

**Common Issues**:
- Auditable events not logged (logins, failed logins, high-value transactions)
- Warnings and errors generate no, inadequate, or unclear log messages
- Logs only stored locally
- Appropriate alerting thresholds and response escalation processes not in place
- Penetration testing and DAST scans don't trigger alerts
- Unable to detect, escalate, or alert for active attacks in real-time or near real-time

**What to Log**:
- Authentication attempts (success and failure)
- Authorization failures
- Input validation failures
- Application errors and exceptions
- High-value transactions
- Administrative actions
- Data access and modifications
- Session lifecycle events

**What NOT to Log**:
- Session tokens or passwords
- Credit card numbers or PII in plain text
- Unnecessary sensitive data

**CWE Mappings**: CWE-117, CWE-223, CWE-532, CWE-778

### A10:2021 - Server-Side Request Forgery (SSRF)

**Risk**: Web application fetches a remote resource without validating the user-supplied URL.

**Common Scenarios**:
- Fetching remote URLs based on user input
- Webhooks that accept user-provided URLs
- PDF generators that fetch external resources
- Image import from URLs
- Accessing cloud metadata services (169.254.169.254)

**Prevention**:
- Deny by default; allow-list of permitted resources
- Sanitize and validate all client-supplied input data
- Enforce URL schema, port, and destination with positive allow-list
- Disable HTTP redirections
- Network segmentation and firewall rules

**CWE Mappings**: CWE-918

---

## OWASP API Security Top 10

**Official Source**: https://api-security.owasp.org/

**Version**: Verify the latest published release before each audit.

APIs have unique security challenges. Review these when assessing API endpoints:

### API1:2023 - Broken Object Level Authorization (BOLA/IDOR)

APIs tend to expose endpoints that handle object identifiers, creating a wide attack surface of Object Level Access Control issues.

### API2:2023 - Broken Authentication

Authentication mechanisms are often implemented incorrectly, allowing attackers to compromise authentication tokens or exploit implementation flaws.

### API3:2023 - Broken Object Property Level Authorization

Lack of or improper authorization validation at the object property level, leading to information disclosure or manipulation.

### API4:2023 - Unrestricted Resource Consumption

APIs are vulnerable to various resource exhaustion attacks like DoS, but also rate limiting issues.

### API5:2023 - Broken Function Level Authorization

Complex access control policies with hierarchies, groups, and roles often lead to authorization flaws.

### API6:2023 - Unrestricted Access to Sensitive Business Flows

APIs vulnerable to automated threat abuse (credential stuffing, spam, scalping).

### API7:2023 - Server Side Request Forgery

SSRF flaws can occur when an API fetches a remote resource without validating the user-supplied URI.

### API8:2023 - Security Misconfiguration

Same as OWASP Top 10 A05, but particularly relevant for API configurations, CORS, etc.

### API9:2023 - Improper Inventory Management

APIs tend to expose more endpoints than traditional web applications, making proper documentation and inventory important.

### API10:2023 - Unsafe Consumption of APIs

Developers tend to trust data received from third-party APIs more than user input, leading to weaker security standards.

---

## Common Weakness Enumeration (CWE)

**Official Source**: https://cwe.mitre.org/

CWE is a community-developed list of software and hardware weakness types. Use CWE IDs to precisely identify vulnerability types.

### Top 25 Most Dangerous Software Weaknesses (2023)

1. **CWE-787**: Out-of-bounds Write
2. **CWE-79**: Cross-site Scripting (XSS)
3. **CWE-89**: SQL Injection
4. **CWE-20**: Improper Input Validation
5. **CWE-78**: OS Command Injection
6. **CWE-352**: Cross-Site Request Forgery (CSRF)
7. **CWE-434**: Unrestricted Upload of File with Dangerous Type
8. **CWE-862**: Missing Authorization
9. **CWE-476**: NULL Pointer Dereference
10. **CWE-287**: Improper Authentication
11. **CWE-22**: Path Traversal
12. **CWE-502**: Deserialization of Untrusted Data
13. **CWE-918**: Server-Side Request Forgery (SSRF)
14. **CWE-77**: Command Injection
15. **CWE-119**: Buffer Errors
16. **CWE-798**: Hard-coded Credentials
17. **CWE-190**: Integer Overflow
18. **CWE-125**: Out-of-bounds Read
19. **CWE-863**: Incorrect Authorization
20. **CWE-276**: Incorrect Default Permissions
21. **CWE-94**: Code Injection
22. **CWE-269**: Improper Privilege Management
23. **CWE-843**: Type Confusion
24. **CWE-400**: Uncontrolled Resource Consumption
25. **CWE-611**: XML External Entity (XXE)

---

## OWASP Application Security Verification Standard (ASVS)

**Official Source**: https://asvs.owasp.org/

**Version**: 5.0.0

ASVS provides a basis for testing technical security controls and provides developers with a list of requirements for secure development.

### Verification Levels

- **Level 1**: Opportunistic - Basic security for all applications
- **Level 2**: Standard - Applications that handle significant business-to-business transactions
- **Level 3**: Advanced - Most critical applications requiring the highest level of trust

### Key Verification Categories

1. **V1**: Architecture, Design and Threat Modeling
2. **V2**: Authentication
3. **V3**: Session Management
4. **V4**: Access Control
5. **V5**: Validation, Sanitization and Encoding
6. **V6**: Stored Cryptography
7. **V7**: Error Handling and Logging
8. **V8**: Data Protection
9. **V9**: Communication
10. **V10**: Malicious Code
11. **V11**: Business Logic
12. **V12**: Files and Resources
13. **V13**: API and Web Service
14. **V14**: Configuration

---

## NIST Secure Software Development Framework (SSDF)

**Official Source**: https://csrc.nist.gov/Projects/ssdf

**Document**: NIST SP 800-218

Four practice areas:
1. **PO**: Prepare the Organization
2. **PS**: Protect the Software
3. **PW**: Produce Well-Secured Software
4. **RV**: Respond to Vulnerabilities

---

## SANS Top 25 Software Errors

**Official Source**: https://www.sans.org/top25-software-errors/

Closely aligned with CWE Top 25, provides narrative descriptions and mitigation strategies.

---

## Technology-Specific Security Standards

### JavaScript/Node.js
- OWASP Node.js Security Cheat Sheet
- npm Security Best Practices

### Python
- OWASP Python Security Project
- Python Security Best Practices (PyPA)

### Java
- OWASP Java Security Cheat Sheet
- Oracle Secure Coding Guidelines for Java SE

### .NET/C#
- OWASP .NET Security Cheat Sheet
- Microsoft Security Development Lifecycle

### Cloud Security
- AWS Security Best Practices
- Azure Security Best Practices
- GCP Security Best Practices
- OWASP Cloud-Native Application Security Top 10

### Container Security
- CIS Docker Benchmark
- CIS Kubernetes Benchmark
- NIST Application Container Security Guide (SP 800-190)

---

## Security Testing Standards

### OWASP Testing Guide
**Official Source**: https://owasp.org/www-project-web-security-testing-guide/

Comprehensive methodology for web application security testing.

### PTES (Penetration Testing Execution Standard)
**Official Source**: http://www.pentest-standard.org/

Standard for penetration testing methodology.

---

## Compliance and Regulatory Standards

### PCI DSS (Payment Card Industry Data Security Standard)
Requirements for systems handling credit card data.

### GDPR (General Data Protection Regulation)
EU regulation on data protection and privacy.

### HIPAA (Health Insurance Portability and Accountability Act)
US regulation for healthcare data protection.

### SOC 2
Trust service criteria for security, availability, processing integrity, confidentiality, and privacy.

---

## Reference Security Headers

### Recommended HTTP Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Cookie Security Flags

```
Set-Cookie: sessionid=...; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600
```

---

## Version Control

**Document Version**: 1.0  
**Last Updated**: 2026-11-02  
**Standards Referenced**:
- OWASP Top 10 2025
- OWASP API Security Top 10 (verify latest before each audit)
- CWE Top 25 2023
- OWASP ASVS 5.0.0
- NIST SSDF SP 800-218

**Note**: Always verify you are using the most current version of these standards by checking the official sources listed above.
