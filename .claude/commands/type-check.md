Run TypeScript type checking on both server and client:

```bash
make typecheck
```

This runs:
1. `npx tsc -p tsconfig.server.json --noEmit` — check server types
2. `npx tsc --noEmit` — check client types

Both must pass with ZERO errors. Fix any type errors by addressing the root cause — do NOT use `any`, `as any`, `@ts-ignore`, or `@ts-expect-error` to suppress them.
