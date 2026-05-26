# TypeScript Rules

When writing TypeScript in this project:

## Do
- Use explicit types on all function parameters and return types
- Use `interface` for object shapes, `type` for unions/intersections
- Use `unknown` for truly unknown inputs, narrow with type guards
- Use `import type` for type-only imports
- Follow the existing file structure conventions

## Don't
- NEVER use `any` — use `unknown` + narrowing instead
- NEVER use `@ts-ignore` or `@ts-expect-error`
- Don't use default exports (prefer named exports)
- Don't mutate function parameters

## Naming
- Files: kebab-case (`box-number.service.ts`)
- Functions/variables: camelCase
- Types/Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE

## Server vs Client
- Server code uses `.js` extensions in imports (ESM)
- Client code uses `.js` extensions in imports (Vite bundler mode)
- Server has `tsconfig.server.json`, client uses root `tsconfig.json`
