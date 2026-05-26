# Security Rules

## Hard Rules (NEVER VIOLATE)
- NEVER hardcode secrets, API keys, tokens, or passwords
- NEVER log sensitive data (credentials, tokens, PII)
- NEVER use string interpolation in SQL queries — always parameterized with `?`
- NEVER use `eval()`, `new Function()`, or dynamic code execution with user input
- NEVER trust user input without Zod validation

## API Security
- All POST/PUT routes MUST validate request body with Zod
- All route params MUST be validated (check `isNaN` for numeric IDs)
- Rate limiting: consider adding for auth endpoints
- CORS is configured for development only — tighten for production

## Database
- SQLite queries use `db.prepare(...).run(val1, val2)` with `?` placeholders
- Never: `` db.prepare(`SELECT * FROM x WHERE id = ${id}`) ``
- Soft-delete pattern: `is_active = 0` instead of DELETE

## 95306 Integration
- Access tokens are stored in SQLite (single-user tool)
- Never expose credentials in API responses or logs
- The `api95306.ts` client injects auth headers automatically
