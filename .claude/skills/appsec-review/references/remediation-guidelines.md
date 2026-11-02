# Security Remediation Guidelines

## Purpose

This document provides specific remediation patterns and code examples for
common security vulnerabilities. Use these guidelines to provide actionable
fix recommendations during security reviews.

---

## Authentication and Session Management

### Password Storage

**Vulnerability**: Plain text or weakly hashed passwords

**Remediation**:

**Node.js (bcrypt)**:
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Hashing
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Verification
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
```

**Python (Argon2)**:
```python
from argon2 import PasswordHasher

ph = PasswordHasher()

# Hashing
hashed = ph.hash("password")

# Verification
try:
    ph.verify(hashed, "password")
    # Password is correct
except:
    # Password is incorrect
    pass
```

**Testing**: Verify that:
- Same password produces different hashes (salt is random)
- Hash verification succeeds for correct password
- Hash verification fails for incorrect password
- Old algorithm hashes are migrated

---

### Session Token Generation

**Vulnerability**: Weak or predictable session tokens

**Remediation**:

**Node.js**:
```javascript
const crypto = require('crypto');

function generateSessionToken() {
  // 32 bytes = 256 bits of entropy
  return crypto.randomBytes(32).toString('hex');
}

// With express-session
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET, // Load from env
  genid: () => crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    sameSite: 'strict',
    maxAge: 3600000    // 1 hour
  }
}));
```

**Testing**: Verify that:
- Tokens have sufficient entropy (128+ bits)
- Tokens are unpredictable
- Token generation doesn't use Math.random()

---

### Cookie Security

**Vulnerability**: Missing security flags on cookies

**Remediation**:

**HTTP Response Header**:
```
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600
```

**Node.js (Express)**:
```javascript
res.cookie('sessionId', token, {
  secure: true,       // HTTPS only
  httpOnly: true,     // No JavaScript access
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000,    // 1 hour
  path: '/',
  domain: '.example.com' // Limit to domain
});
```

**Testing**: Verify in browser DevTools that:
- Secure flag is present (cookie only sent over HTTPS)
- HttpOnly flag is present (document.cookie doesn't show it)
- SameSite is set appropriately

---

### JWT Security

**Vulnerability**: Weak JWT secrets or algorithm confusion

**Remediation**:

**Node.js (jsonwebtoken)**:
```javascript
const jwt = require('jsonwebtoken');

// Use strong secret from environment
const JWT_SECRET = process.env.JWT_SECRET; // Min 256 bits
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Signing (short-lived access token)
function generateAccessToken(userId) {
  return jwt.sign(
    { userId, type: 'access' },
    JWT_SECRET,
    { 
      algorithm: 'HS256',
      expiresIn: '15m',
      issuer: 'myapp',
      audience: 'myapp-api'
    }
  );
}

// Verification
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Prevent algorithm confusion
      issuer: 'myapp',
      audience: 'myapp-api'
    });
  } catch (err) {
    // Token invalid, expired, or tampered
    return null;
  }
}

// Refresh token (long-lived, stored in DB)
function generateRefreshToken(userId) {
  const token = jwt.sign(
    { userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { algorithm: 'HS256', expiresIn: '7d' }
  );
  // Store token hash in database for revocation
  return token;
}
```

**Testing**: Verify that:
- Tokens expire as expected
- Modified tokens are rejected
- Algorithm cannot be changed to 'none'
- Tokens from wrong issuer are rejected

---

## Authorization

### IDOR (Insecure Direct Object Reference) Prevention

**Vulnerability**: Users can access other users' resources

**Remediation**:

**Before (Vulnerable)**:
```javascript
// Anyone can access any user's profile by changing the ID
app.get('/api/users/:userId/profile', async (req, res) => {
  const profile = await db.getProfile(req.params.userId);
  res.json(profile);
});
```

**After (Secure)**:
```javascript
// Verify the requested resource belongs to the authenticated user
app.get('/api/users/:userId/profile', authenticateUser, async (req, res) => {
  const requestedUserId = req.params.userId;
  const authenticatedUserId = req.user.id;
  
  // Authorization check
  if (requestedUserId !== authenticatedUserId && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const profile = await db.getProfile(requestedUserId);
  res.json(profile);
});
```

**Alternative: Use indirect references**:
```javascript
// Don't expose database IDs, use UUIDs or lookup by session
app.get('/api/profile', authenticateUser, async (req, res) => {
  // Only access current user's profile
  const profile = await db.getProfile(req.user.id);
  res.json(profile);
});
```

**Testing**: Verify that:
- User A cannot access User B's resources
- Changing IDs in URL/API returns 403 Forbidden
- Admin users can access resources with proper elevation

---

### Role-Based Access Control (RBAC)

**Vulnerability**: Missing or inconsistent authorization checks

**Remediation**:

**Middleware approach (Node.js)**:
```javascript
// Authorization middleware
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Usage
app.delete('/api/users/:id', 
  authenticateUser, 
  requireRole('admin'), 
  async (req, res) => {
    await db.deleteUser(req.params.id);
    res.json({ success: true });
  }
);
```

**Decorator approach (NestJS/TypeScript)**:
```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// Usage
@Delete(':id')
@Roles('admin')
async deleteUser(@Param('id') id: string) {
  return await this.userService.delete(id);
}
```

**Testing**: Verify that:
- Endpoints without roles are accessible to authenticated users
- Endpoints with role requirements reject unauthorized users
- Role checks happen on the server side

---

## Injection Prevention

### SQL Injection Prevention

**Vulnerability**: User input concatenated into SQL queries

**Remediation**:

**Before (Vulnerable)**:
```javascript
// NEVER DO THIS
const userId = req.params.id;
const query = `SELECT * FROM users WHERE id = ${userId}`;
const result = await db.query(query);
```

**After (Parameterized Queries)**:

**Node.js (pg)**:
```javascript
const userId = req.params.id;
const query = 'SELECT * FROM users WHERE id = $1';
const result = await db.query(query, [userId]);
```

**Node.js (mysql2)**:
```javascript
const userId = req.params.id;
const query = 'SELECT * FROM users WHERE id = ?';
const [rows] = await db.execute(query, [userId]);
```

**Python (psycopg2)**:
```python
user_id = request.args.get('id')
cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
```

**ORM (Sequelize)**:
```javascript
// Safe by default
const user = await User.findOne({ where: { id: userId } });
```

**Dynamic ORDER BY (Allow-list approach)**:
```javascript
const allowedSortFields = ['name', 'created_at', 'email'];
const sortField = req.query.sort;

if (!allowedSortFields.includes(sortField)) {
  return res.status(400).json({ error: 'Invalid sort field' });
}

// Now safe to use
const query = `SELECT * FROM users ORDER BY ${sortField}`;
```

**Testing**: Verify that:
- Payloads like `' OR '1'='1` are treated as literal strings
- SQL syntax characters are properly escaped
- Parameterized queries are used throughout

---

### Command Injection Prevention

**Vulnerability**: User input passed to shell commands

**Remediation**:

**Before (Vulnerable)**:
```javascript
const filename = req.body.filename;
exec(`convert ${filename}.png ${filename}.jpg`, callback); // DANGEROUS
```

**After (Use libraries instead of shell)**:
```javascript
// Use a library that doesn't invoke shell
const sharp = require('sharp');
const filename = req.body.filename;

// Validate filename first
if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
  return res.status(400).json({ error: 'Invalid filename' });
}

await sharp(`${filename}.png`).toFile(`${filename}.jpg`);
```

**If shell is unavoidable (use execFile with array)**:
```javascript
const { execFile } = require('child_process');

// execFile doesn't invoke shell, passes args directly
execFile('convert', [`${filename}.png`, `${filename}.jpg`], (error, stdout) => {
  // Still validate filename!
});
```

**Testing**: Verify that:
- Payloads like `; rm -rf /` don't execute
- Shell metacharacters are not interpreted
- Libraries are preferred over shell commands

---

### Cross-Site Scripting (XSS) Prevention

**Vulnerability**: User input rendered without encoding

**Remediation**:

**React (safe by default)**:
```jsx
// Safe - automatically escaped
function UserProfile({ username }) {
  return <div>{username}</div>;
}

// UNSAFE - don't use unless absolutely necessary and input is sanitized
function UnsafeHTML({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

**Node.js (Template engine with auto-escaping)**:
```javascript
// EJS - use <%= %> for escaped output
<p>Welcome, <%= username %></p>

// NOT <%- %> which is unescaped
```

**Manual encoding (if needed)**:
```javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

**Content Security Policy (CSP)**:
```javascript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " + // Try to avoid unsafe-inline
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  );
  next();
});
```

**Testing**: Verify that:
- Payloads like `<script>alert(1)</script>` are escaped
- User input in HTML attributes is properly quoted
- CSP blocks inline scripts

---

### NoSQL Injection Prevention

**Vulnerability**: User input in MongoDB query operators

**Remediation**:

**Before (Vulnerable)**:
```javascript
// User can inject: {"$gt": ""}
const user = await User.findOne({ username: req.body.username });
```

**After (Sanitize input)**:
```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Removes $ and . from user input

// Or manually validate
function sanitizeUsername(username) {
  if (typeof username !== 'string') {
    throw new Error('Username must be a string');
  }
  return username;
}

const user = await User.findOne({ 
  username: sanitizeUsername(req.body.username) 
});
```

**Testing**: Verify that:
- Objects with `$` operators are rejected or sanitized
- Type validation is enforced
- ORM/ODM usage is consistent

---

## Cryptography

### Strong Encryption

**Vulnerability**: Weak or deprecated encryption algorithms

**Remediation**:

**Node.js (AES-256-GCM)**:
```javascript
const crypto = require('crypto');

function encrypt(plaintext, key) {
  // Generate random IV for each encryption
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return IV + authTag + ciphertext (all needed for decryption)
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    ciphertext: ciphertext
  };
}

function decrypt(encrypted, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  
  let plaintext = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  
  return plaintext;
}

// Key should be 32 bytes for AES-256
const key = crypto.scryptSync(process.env.ENCRYPTION_PASSWORD, 'salt', 32);
```

**Testing**: Verify that:
- Modern algorithms are used (AES-256-GCM, ChaCha20-Poly1305)
- IV is random and never reused
- Authenticated encryption is used
- Decryption fails if ciphertext is modified

---

### Secure Random Number Generation

**Vulnerability**: Using weak random number generators for security

**Remediation**:

**Before (Vulnerable)**:
```javascript
// NEVER use for security purposes
const token = Math.random().toString(36).substring(2);
```

**After (Cryptographically secure)**:
```javascript
const crypto = require('crypto');

// Secure random token
const token = crypto.randomBytes(32).toString('hex');

// Secure random UUID
const { v4: uuidv4 } = require('uuid');
const id = uuidv4(); // Uses crypto.randomBytes internally
```

**Testing**: Verify that:
- crypto.randomBytes or equivalent is used
- Math.random is not used for security purposes
- Sufficient entropy (128+ bits for tokens)

---

## Configuration Security

### Environment Variables and Secrets

**Vulnerability**: Hardcoded secrets in code

**Remediation**:

**Environment variables (.env file)**:
```bash
# .env (NEVER commit this file)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=<long-random-string>
ENCRYPTION_KEY=<32-byte-key>
API_KEY=<api-key>
```

**.gitignore**:
```
.env
.env.local
.env.*.local
secrets/
*.key
*.pem
```

**Loading in application**:
```javascript
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

// Validate required secrets on startup
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

**Secrets management (production)**:
- AWS Secrets Manager
- Azure Key Vault
- Google Cloud Secret Manager
- HashiCorp Vault

**Testing**: Verify that:
- No secrets are committed to git
- Application fails fast if required secrets are missing
- Secrets are loaded from environment, not hardcoded

---

### Security Headers

**Vulnerability**: Missing security headers

**Remediation**:

**Node.js (helmet middleware)**:
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Avoid unsafe-inline if possible
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny' // Prevent clickjacking
  },
  noSniff: true, // Prevent MIME sniffing
  xssFilter: false, // Deprecated, use CSP instead
}));

// Additional headers
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

**Testing**: Verify headers in response:
```bash
curl -I https://example.com
```
Should see:
- Strict-Transport-Security
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY

---

### CORS Configuration

**Vulnerability**: Permissive CORS allowing any origin

**Remediation**:

**Before (Vulnerable)**:
```javascript
// DANGEROUS - allows any origin with credentials
app.use(cors({
  origin: '*',
  credentials: true
}));
```

**After (Restrictive)**:
```javascript
const cors = require('cors');

const allowedOrigins = [
  'https://example.com',
  'https://app.example.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600 // 10 minutes
}));
```

**Testing**: Verify that:
- Requests from unauthorized origins are blocked
- Preflight requests are handled correctly
- Credentials are only allowed for trusted origins

---

## Input Validation

### Allow-list Validation

**Vulnerability**: Insufficient input validation

**Remediation**:

**Using validation library (joi, express-validator)**:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  // Validation rules
  body('email').isEmail().normalizeEmail(),
  body('username').isAlphanumeric().isLength({ min: 3, max: 20 }),
  body('age').isInt({ min: 18, max: 120 }),
  body('role').isIn(['user', 'moderator']), // Allow-list
  
  // Handler
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Input is validated
    createUser(req.body);
  }
);
```

**Testing**: Verify that:
- Invalid input is rejected
- Validation happens on server side
- Error messages don't leak sensitive information

---

### File Upload Security

**Vulnerability**: Unrestricted file upload

**Remediation**:

**Node.js (multer)**:
```javascript
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store outside web root
    cb(null, '/var/app/uploads');
  },
  filename: (req, file, cb) => {
    // Generate random filename to prevent overwrites and path traversal
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Additional validation: check file content, not just extension
  // Can use libraries like 'file-type' to verify actual file type
  
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});
```

**Testing**: Verify that:
- File size limits are enforced
- File type is validated by content, not extension
- Malicious files (exe, php, jsp) are rejected
- Filenames don't cause path traversal

---

## SSRF Prevention

**Vulnerability**: Fetching user-provided URLs

**Remediation**:

**Before (Vulnerable)**:
```javascript
// DANGEROUS
app.post('/api/fetch', async (req, res) => {
  const url = req.body.url;
  const response = await axios.get(url);
  res.json(response.data);
});
```

**After (Validated)**:
```javascript
const axios = require('axios');
const { URL } = require('url');

const ALLOWED_DOMAINS = [
  'api.example.com',
  'cdn.example.com'
];

// Block private IP ranges
const BLOCKED_IPS = [
  /^127\./,                    // Loopback
  /^10\./,                     // Private
  /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private
  /^192\.168\./,               // Private
  /^169\.254\./,               // Link-local
  /^::1$/,                     // IPv6 loopback
  /^fc00:/,                    // IPv6 private
];

function isAllowedUrl(urlString) {
  try {
    const url = new URL(urlString);
    
    // Only allow HTTPS
    if (url.protocol !== 'https:') {
      return false;
    }
    
    // Check domain allow-list
    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      return false;
    }
    
    // Check for IP addresses in hostname
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(url.hostname);
    if (isIP) {
      for (const blocked of BLOCKED_IPS) {
        if (blocked.test(url.hostname)) {
          return false;
        }
      }
    }
    
    return true;
  } catch (err) {
    return false;
  }
}

app.post('/api/fetch', async (req, res) => {
  const url = req.body.url;
  
  if (!isAllowedUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      maxRedirects: 0, // Prevent redirect to blocked URL
      maxContentLength: 1024 * 1024 // 1MB limit
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});
```

**Testing**: Verify that:
- Internal URLs (127.0.0.1, localhost, 169.254.169.254) are blocked
- Only allowed domains are accessible
- Redirects don't bypass restrictions

---

## Logging and Monitoring

### Secure Logging

**Vulnerability**: Logging sensitive data

**Remediation**:

```javascript
const winston = require('winston');

// Sanitization function
function sanitizeLogData(data) {
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = [
    'password', 'token', 'authorization', 'cookie',
    'creditCard', 'ssn', 'secret', 'apiKey'
  ];
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
function loginUser(req) {
  const loginData = sanitizeLogData({
    username: req.body.username,
    password: req.body.password, // Will be redacted
    ip: req.ip
  });
  
  logger.info('Login attempt', loginData);
}
```

**What to log**:
- Authentication events (success/failure)
- Authorization failures
- Input validation failures
- Application errors
- Administrative actions
- Data access and modifications

**What NOT to log**:
- Passwords (plain or hashed)
- Session tokens
- API keys
- Credit card numbers
- Social security numbers
- Personal identifiable information (unless required for audit)

**Testing**: Verify that:
- Sensitive data is redacted from logs
- Security events are logged
- Logs include sufficient context (timestamp, user, action, outcome)

---

## Rate Limiting

**Vulnerability**: No rate limiting on sensitive endpoints

**Remediation**:

**Node.js (express-rate-limit)**:
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Stricter limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 failed login attempts
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful logins
});

app.post('/api/login', authLimiter, loginHandler);

// Very strict for password reset
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
});

app.post('/api/reset-password', resetLimiter, resetHandler);
```

**Testing**: Verify that:
- Rate limits are enforced
- 429 status code is returned when limit exceeded
- Limits are appropriate for endpoint sensitivity

---

## Testing Recommendations

For each remediation, implement these test types:

### Unit Tests
- Test that security controls work as expected
- Test with malicious input
- Test edge cases

### Integration Tests
- Test authentication flows end-to-end
- Test authorization across different roles
- Test with multiple concurrent requests

### Security Tests
- Run SAST (Static Application Security Testing)
- Run DAST (Dynamic Application Security Testing)
- Perform manual penetration testing
- Use tools: OWASP ZAP, Burp Suite, npm audit, Snyk

### Regression Tests
- Ensure fixes don't break existing functionality
- Test backwards compatibility if needed

---

## Deployment Checklist

Before deploying security fixes:

- [ ] All tests pass (unit, integration, security)
- [ ] Code review completed
- [ ] Security scan (SAST) completed with no high/critical issues
- [ ] Dependency vulnerabilities resolved
- [ ] Configuration reviewed (secrets, headers, CORS)
- [ ] Logging and monitoring in place
- [ ] Incident response plan updated
- [ ] Documentation updated
- [ ] Rollback plan prepared

---

**Document Version**: 1.0  
**Last Updated**: 2026-11-02  
**Compatible With**: OWASP Top 10 2025, OWASP ASVS 5.0.0
