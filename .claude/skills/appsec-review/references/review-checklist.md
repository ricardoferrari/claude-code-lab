# Application Security Review Checklist

## Purpose

This checklist provides a systematic approach to reviewing application code
for security vulnerabilities. Use it to ensure comprehensive coverage during
security audits and code reviews.

## Pre-Review Preparation

- [ ] Identify the scope of the review (files, modules, commits, branches)
- [ ] Understand the application architecture and data flow
- [ ] Identify the technology stack (languages, frameworks, libraries)
- [ ] Locate configuration files and environment setup
- [ ] Identify external dependencies and third-party integrations
- [ ] Review existing security documentation (if any)
- [ ] Check for existing SAST/DAST tool reports
- [ ] Identify sensitive data handled by the application
- [ ] Map trust boundaries and attack surface

---

## 1. Authentication Weaknesses (OWASP A07)

### User Authentication

- [ ] **Password policies**
  - Check for minimum complexity requirements
  - Verify maximum length is not artificially limited (max should be 64+ chars)
  - Look for blacklists of common passwords
  - Search: `password`, `authenticate`, `login`

- [ ] **Password storage**
  - Verify passwords are hashed, not encrypted or plain text
  - Check for modern hashing algorithms (Argon2, scrypt, bcrypt, PBKDF2)
  - Verify salt is unique per password
  - Search: `bcrypt`, `hash`, `createHash`, `pbkdf2`, `argon2`

- [ ] **Brute force protection**
  - Check for rate limiting on login endpoints
  - Look for account lockout mechanisms
  - Verify CAPTCHA or similar after failed attempts
  - Search: `rateLimit`, `lockout`, `attempt`, `throttle`

- [ ] **Multi-factor authentication**
  - Check if MFA is available and enforced for sensitive operations
  - Verify TOTP/SMS/backup codes are properly implemented
  - Search: `2fa`, `mfa`, `totp`, `authenticator`

- [ ] **Credential recovery**
  - Review password reset flows for vulnerabilities
  - Check for account enumeration during recovery
  - Verify reset tokens are cryptographically random and short-lived
  - Search: `reset`, `forgot`, `recover`

### Session Management

- [ ] **Session token generation**
  - Verify tokens are cryptographically random
  - Check token length (128+ bits of entropy)
  - Search: `session`, `token`, `randomBytes`, `uuid`

- [ ] **Session storage**
  - Verify sessions are stored server-side (not just in JWT)
  - Check for secure session storage (Redis, database, etc.)
  - Look for hardcoded session secrets
  - Search: `sessionStore`, `SESSION_SECRET`, `jwt.sign`

- [ ] **Session lifecycle**
  - Check for session expiration/timeout
  - Verify sessions are invalidated on logout
  - Check for session regeneration after privilege change
  - Search: `logout`, `expire`, `maxAge`, `invalidate`

- [ ] **Cookie security**
  - Verify `Secure` flag is set (HTTPS only)
  - Verify `HttpOnly` flag is set (no JavaScript access)
  - Verify `SameSite` is set (Strict or Lax)
  - Check cookie expiration is reasonable
  - Search: `Set-Cookie`, `cookie`, `httpOnly`, `secure`

### JWT Security

- [ ] **JWT implementation**
  - Check for strong signing keys (not "secret" or default)
  - Verify algorithm is not set to "none"
  - Check for RS256 vs HS256 confusion attacks
  - Verify token expiration is short-lived
  - Check if refresh tokens are used properly
  - Search: `jwt.sign`, `jwt.verify`, `jsonwebtoken`

- [ ] **JWT validation**
  - Verify signature is always validated
  - Check for algorithm confusion attacks
  - Verify issuer and audience claims
  - Search: `verify`, `decode`, `algorithm`

---

## 2. Authorization Flaws (OWASP A01)

### Access Control

- [ ] **Vertical privilege escalation**
  - Check if regular users can access admin functions
  - Verify role/permission checks on sensitive operations
  - Search: `admin`, `role`, `permission`, `isAdmin`, `hasRole`

- [ ] **Horizontal privilege escalation**
  - Check for IDOR vulnerabilities (accessing other users' data)
  - Verify user IDs in requests are validated against session
  - Look for exposed object IDs in URLs or APIs
  - Search: `userId`, `accountId`, `findById`, `getUser`

- [ ] **Insecure direct object references (IDOR)**
  - Check if sequential IDs are used without authorization
  - Verify GUIDs/UUIDs are used where appropriate
  - Check for authorization checks before data access
  - Search: `params.id`, `query.id`, `req.params`, `WHERE id =`

- [ ] **Missing function level access control**
  - Verify all endpoints have authorization checks
  - Check for client-side only authorization
  - Look for conditional rendering without server-side checks
  - Search: `router.post`, `router.put`, `router.delete`, `@Post`, `@Put`, `@Delete`

- [ ] **Path traversal / forced browsing**
  - Check if authenticated pages are accessible without login
  - Verify deep links require proper authorization
  - Search: `redirect`, `returnUrl`, `next`

### API Authorization

- [ ] **REST API security**
  - Verify all endpoints require authentication
  - Check for proper HTTP method restrictions
  - Verify OPTIONS method doesn't leak sensitive info
  - Search: `router.`, `app.get`, `app.post`, `app.put`, `app.delete`

- [ ] **GraphQL security**
  - Check for query depth limiting
  - Verify introspection is disabled in production
  - Check authorization at resolver level
  - Search: `GraphQL`, `resolver`, `@Query`, `@Mutation`

---

## 3. Injection Vulnerabilities (OWASP A03)

### SQL Injection

- [ ] **Parameterized queries**
  - Verify all SQL queries use parameterization
  - Check for string concatenation in queries
  - Look for ORM usage (Sequelize, TypeORM, Prisma, etc.)
  - Search: `query(`, `execute(`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE`, `ORDER BY`

- [ ] **Dynamic query building**
  - Check for user input in ORDER BY, table names, or column names
  - Verify allow-listing if dynamic queries are necessary
  - Search: `ORDER BY ${`, `FROM ${`, `SELECT ${`

- [ ] **NoSQL injection**
  - Check MongoDB queries for user input in operators
  - Verify proper input validation for NoSQL queries
  - Search: `$where`, `find(`, `$gt`, `$lt`, `$regex`

### Command Injection

- [ ] **OS command execution**
  - Check for `exec`, `spawn`, `system` calls with user input
  - Verify input sanitization if shell commands are necessary
  - Look for safer alternatives (use libraries instead of shell)
  - Search: `exec`, `spawn`, `child_process`, `system(`, `shell_exec`, `eval`, `subprocess`

- [ ] **Code injection**
  - Check for `eval()` or similar dynamic code execution
  - Verify template engines don't allow code execution
  - Search: `eval(`, `Function(`, `vm.runInContext`, `exec(`, `compile(`

### Cross-Site Scripting (XSS)

- [ ] **Output encoding**
  - Verify all user input is encoded before output
  - Check template engine auto-escaping is enabled
  - Look for `dangerouslySetInnerHTML` or similar
  - Search: `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, `[innerHtml]`, `${`, `<%=`

- [ ] **Content Security Policy (CSP)**
  - Verify CSP header is set
  - Check for `unsafe-inline` and `unsafe-eval` (should be avoided)
  - Search: `Content-Security-Policy`, `csp`

- [ ] **DOM-based XSS**
  - Check for `document.write`, `eval` with DOM sources
  - Verify URL parameters are not reflected unsafely
  - Search: `document.write`, `window.location`, `document.location`, `innerHTML`

### Server-Side Template Injection (SSTI)

- [ ] **Template engines**
  - Check if user input is passed to template rendering
  - Verify templates are pre-compiled and not dynamically created
  - Search: `render(`, `compile(`, `template`, `jade`, `pug`, `ejs`, `handlebars`

### XML External Entity (XXE)

- [ ] **XML parsing**
  - Check if XML parsing disables external entities
  - Verify DTD processing is disabled
  - Search: `parseXML`, `DOMParser`, `xmlParser`, `libxml`

### LDAP/XPath Injection

- [ ] **LDAP queries**
  - Check for user input in LDAP filters
  - Verify proper escaping of LDAP special characters
  - Search: `ldap`, `search(`, `filter`

---

## 4. Cryptographic Failures (OWASP A02)

### Encryption

- [ ] **Algorithms**
  - Verify modern algorithms are used (AES-256-GCM, ChaCha20-Poly1305)
  - Check for deprecated algorithms (DES, 3DES, RC4, MD5, SHA1)
  - Search: `createCipher`, `encrypt`, `crypto`, `des`, `rc4`, `md5`

- [ ] **Key management**
  - Verify encryption keys are not hardcoded
  - Check for proper key storage (environment variables, key management service)
  - Verify key rotation mechanisms exist
  - Search: `encryptionKey`, `secretKey`, `privateKey`, `AES_KEY`

- [ ] **Initialization vectors (IV)**
  - Verify IVs are randomly generated for each encryption
  - Check IV is not reused
  - Search: `iv`, `initializationVector`

- [ ] **Authenticated encryption**
  - Verify MAC or authenticated encryption is used (GCM mode)
  - Check for encrypt-then-MAC if using separate primitives
  - Search: `gcm`, `hmac`, `authTag`

### TLS/SSL

- [ ] **HTTPS enforcement**
  - Verify all sensitive communications use HTTPS
  - Check for HSTS header
  - Look for mixed content issues
  - Search: `http://`, `Strict-Transport-Security`

- [ ] **TLS configuration**
  - Verify TLS 1.2+ is required (1.3 preferred)
  - Check for weak cipher suites
  - Search: `tls`, `ssl`, `minVersion`, `ciphers`

- [ ] **Certificate validation**
  - Verify certificate validation is not disabled
  - Check for proper hostname verification
  - Search: `rejectUnauthorized`, `verify`, `strictSSL`

### Random Number Generation

- [ ] **Cryptographic randomness**
  - Verify cryptographically secure RNG is used
  - Check for weak random functions (Math.random, rand())
  - Search: `random`, `randomBytes`, `uuid`, `Math.random`, `rand(`

### Sensitive Data Storage

- [ ] **Data at rest**
  - Verify sensitive data is encrypted in databases
  - Check for plaintext storage of PII, passwords, tokens
  - Search: `password`, `ssn`, `credit`, `token`, `secret`

- [ ] **Secrets in code**
  - Check for hardcoded credentials, API keys, tokens
  - Verify .env files are not committed
  - Search: `password =`, `apiKey =`, `secret =`, `token =`, `Bearer `

- [ ] **Logging sensitive data**
  - Verify passwords and tokens are not logged
  - Check for PII in logs
  - Search: `console.log`, `logger.`, `log.`, `print(`, `echo`

---

## 5. Insecure Design (OWASP A04)

### Business Logic Flaws

- [ ] **Rate limiting**
  - Check for rate limiting on expensive operations
  - Verify anti-automation for sensitive functions
  - Search: `rateLimit`, `throttle`

- [ ] **Transaction limits**
  - Verify business transaction limits exist
  - Check for integer overflow in financial calculations
  - Search: `transfer`, `withdraw`, `payment`

- [ ] **Workflow bypasses**
  - Check if steps in multi-step processes can be skipped
  - Verify state is properly validated at each step
  - Search: `step`, `status`, `state`

- [ ] **Race conditions**
  - Check for TOCTOU (Time-of-Check-Time-of-Use) issues
  - Verify atomic operations for critical transactions
  - Search: `transaction`, `lock`, `mutex`

### Threat Modeling

- [ ] **Trust boundaries**
  - Identify where untrusted data enters the system
  - Verify validation at trust boundaries
  - Document assumptions about data sources

- [ ] **Defense in depth**
  - Check for multiple layers of security controls
  - Verify fallback mechanisms exist

---

## 6. Security Misconfiguration (OWASP A05)

### Application Configuration

- [ ] **Debug mode**
  - Verify debug mode is disabled in production
  - Check for verbose error messages
  - Search: `DEBUG`, `NODE_ENV`, `FLASK_ENV`, `Rails.env`, `debug: true`

- [ ] **Default credentials**
  - Check for default usernames and passwords
  - Verify initial setup requires credential change
  - Search: `admin`, `root`, `default`, `password`

- [ ] **Unnecessary features**
  - Check for enabled development endpoints in production
  - Verify unused routes are removed
  - Search: `/debug`, `/test`, `/swagger`, `/graphql`

- [ ] **Error handling**
  - Verify stack traces are not exposed
  - Check for information disclosure in errors
  - Search: `stack`, `trace`, `error`, `exception`

### Security Headers

- [ ] **HTTP security headers**
  - `Strict-Transport-Security` (HSTS)
  - `Content-Security-Policy` (CSP)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` or `SAMEORIGIN`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - Search: `setHeader`, `header(`, `headers:`

- [ ] **Remove info-leaking headers**
  - Check for `X-Powered-By`, `Server` headers
  - Verify framework version is not exposed
  - Search: `X-Powered-By`, `Server:`

### CORS Configuration

- [ ] **CORS policy**
  - Verify `Access-Control-Allow-Origin` is not set to `*` for authenticated endpoints
  - Check credentials are properly handled
  - Verify only trusted origins are allowed
  - Search: `cors`, `Access-Control-Allow-Origin`, `credentials: true`

### Cloud Configuration

- [ ] **Storage permissions**
  - Check S3/Azure Blob/GCS bucket permissions
  - Verify no public read/write access unless intended
  - Search: `s3`, `bucket`, `blob`, `storage`

- [ ] **Environment variables**
  - Verify secrets are not logged or exposed
  - Check for proper environment-specific configs
  - Search: `process.env`, `os.getenv`, `ENV[`

---

## 7. Vulnerable Components (OWASP A06)

### Dependency Management

- [ ] **Outdated dependencies**
  - Check package.json, requirements.txt, pom.xml, etc. for old versions
  - Run dependency vulnerability scanners
  - Search: package files

- [ ] **Known vulnerabilities**
  - Check for CVEs in dependencies
  - Run: `npm audit`, `pip-audit`, `snyk test`
  - Review GitHub security alerts

- [ ] **Unused dependencies**
  - Check for unnecessary packages
  - Verify dependencies are actively maintained

- [ ] **Dependency integrity**
  - Verify lock files exist and are used
  - Check for subresource integrity (SRI) for CDN resources
  - Search: `package-lock.json`, `yarn.lock`, `Pipfile.lock`

---

## 8. Data Validation (OWASP A03)

### Input Validation

- [ ] **Validation approach**
  - Verify allow-list validation is used
  - Check for validation on all input sources (forms, APIs, files, URLs)
  - Search: `validate`, `sanitize`, `validator`

- [ ] **Type checking**
  - Verify data types are enforced (especially in dynamic languages)
  - Check for type coercion vulnerabilities
  - Search: `typeof`, `instanceof`, `type:`

- [ ] **Length restrictions**
  - Check for maximum length validation
  - Verify protection against DoS via large inputs
  - Search: `maxLength`, `maxSize`, `limit`

- [ ] **Format validation**
  - Verify regex patterns are not vulnerable to ReDoS
  - Check email, URL, and other format validations
  - Search: `regex`, `pattern`, `match`, `/^`

### File Uploads

- [ ] **File type validation**
  - Verify file type is checked by content, not just extension
  - Check for magic byte validation
  - Search: `upload`, `file`, `mimetype`, `contentType`

- [ ] **File size limits**
  - Verify maximum file size is enforced
  - Check for DoS protection
  - Search: `maxSize`, `fileSize`, `limit`

- [ ] **File storage**
  - Verify uploaded files are stored outside web root
  - Check for access controls on uploaded files
  - Verify filenames are sanitized
  - Search: `destination`, `diskStorage`, `upload`

- [ ] **Malware scanning**
  - Check if files are scanned for malware
  - Verify quarantine mechanisms exist
  - Search: `scan`, `antivirus`, `malware`

---

## 9. Logging and Monitoring (OWASP A09)

### Logging

- [ ] **Security events logged**
  - Authentication attempts (success and failure)
  - Authorization failures
  - Input validation failures
  - Administrative actions
  - Search: `log`, `logger`, `audit`

- [ ] **Log content**
  - Verify no sensitive data in logs (passwords, tokens, PII)
  - Check for sufficient context for incident response
  - Search: `logger.info`, `console.log`, `log.debug`

- [ ] **Log injection**
  - Verify log messages sanitize user input
  - Check for newline characters in log messages
  - Search: `log(`, `print(`

### Monitoring

- [ ] **Alerting**
  - Check for alerts on security events
  - Verify incident response procedures exist
  - Search: `alert`, `notify`, `sns`, `email`

- [ ] **Audit trails**
  - Verify audit logs cannot be tampered with
  - Check for log integrity mechanisms
  - Search: `audit`, `immutable`

---

## 10. API Security

### REST API

- [ ] **Authentication**
  - Verify all endpoints require authentication (unless public)
  - Check for consistent authentication mechanisms
  - Search: route definitions

- [ ] **Authorization**
  - Verify resource-level authorization
  - Check for BOLA/IDOR in API endpoints
  - Search: `/:id`, `/api/`

- [ ] **Rate limiting**
  - Check for rate limiting on APIs
  - Verify abuse prevention mechanisms
  - Search: `rateLimit`, `throttle`

- [ ] **Input validation**
  - Verify JSON schema validation
  - Check for mass assignment vulnerabilities
  - Search: `req.body`, `request.data`, `@Body()`

- [ ] **Output encoding**
  - Verify proper serialization
  - Check for information disclosure
  - Search: `res.json`, `response.json`, `return`

### GraphQL

- [ ] **Query complexity**
  - Check for depth limiting
  - Verify query cost analysis
  - Search: `maxDepth`, `complexity`

- [ ] **Introspection**
  - Verify introspection is disabled in production
  - Search: `introspection`

- [ ] **Authorization**
  - Check for field-level authorization
  - Verify resolvers implement access control
  - Search: `@Authorized`, `isAuthenticated`

---

## 11. Server-Side Request Forgery (OWASP A10)

- [ ] **URL validation**
  - Check if user-provided URLs are fetched
  - Verify allow-list of permitted domains
  - Check for IP address validation (block 127.0.0.1, 169.254.169.254, private IPs)
  - Search: `fetch(`, `axios.get(`, `http.get(`, `requests.get(`, `curl`, `wget`

- [ ] **Webhook security**
  - Verify webhook URLs are validated
  - Check for SSRF in webhook handlers
  - Search: `webhook`, `callback`

- [ ] **Redirect validation**
  - Check for open redirect vulnerabilities
  - Verify redirect URLs are validated
  - Search: `redirect(`, `Location:`, `returnUrl`

---

## 12. Additional Security Checks

### Cross-Site Request Forgery (CSRF)

- [ ] **CSRF tokens**
  - Verify CSRF protection for state-changing operations
  - Check for SameSite cookie attribute
  - Search: `csrf`, `xsrf`, `sameSite`

### Denial of Service

- [ ] **Resource limits**
  - Check for timeouts on operations
  - Verify request size limits
  - Check for algorithmic complexity attacks
  - Search: `timeout`, `limit`, `maxSize`

- [ ] **Regular expression DoS (ReDoS)**
  - Check for vulnerable regex patterns
  - Search: `regex`, `/^`, `match(`, `test(`

### Privilege Management

- [ ] **Principle of least privilege**
  - Verify database connections use minimal privileges
  - Check for over-permissioned service accounts
  - Search: `root`, `admin`, `GRANT ALL`

### Container Security

- [ ] **Dockerfile review**
  - Check for secrets in Dockerfile
  - Verify minimal base images are used
  - Check for `USER` directive (don't run as root)
  - Search: `FROM`, `USER`, `ARG`, `ENV`

---

## Post-Review Actions

- [ ] Compile findings into report
- [ ] Classify findings by severity
- [ ] Create remediation plan
- [ ] Verify no false positives in final report
- [ ] Document any assumptions or limitations
- [ ] Provide testing guidance for fixes
- [ ] Schedule follow-up review date

---

## Search Patterns Reference

Quick grep patterns for common vulnerability indicators:

```bash
# Authentication
grep -rE "(password|pwd|passwd|secret|auth|login)" --include="*.js" --include="*.py"

# SQL Injection
grep -rE "(SELECT|INSERT|UPDATE|DELETE|WHERE|FROM).*\$\{|query\(.*\+|execute\(.*\+" --include="*.js"

# Command Injection
grep -rE "(exec|spawn|system|shell_exec|eval|subprocess)" --include="*.js" --include="*.py"

# XSS
grep -rE "(innerHTML|dangerouslySetInnerHTML|v-html|document.write)" --include="*.js" --include="*.jsx"

# Hardcoded Secrets
grep -rE "(password|secret|api_key|apikey|token|bearer)\s*=\s*['\"][^'\"]+['\"]" --include="*.js" --include="*.py"

# Weak Crypto
grep -rE "(md5|sha1|des|rc4|ECB)" --include="*.js" --include="*.py"

# Debug Mode
grep -rE "(DEBUG\s*=\s*True|NODE_ENV\s*=\s*['\"]development)" --include="*.env" --include="*.config*"
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-11-02  
**Based On**: OWASP Top 10 2025, OWASP ASVS 5.0.0, CWE Top 25
