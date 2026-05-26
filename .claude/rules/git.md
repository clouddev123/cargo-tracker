# Git Workflow Rules

## Branch Naming
- `feat/short-description` — new features
- `fix/short-description` — bug fixes
- `refactor/short-description` — code restructuring
- `chore/short-description` — tooling, deps, config

## Commit Messages
Use conventional commits:

```
type(scope): short description

- bullet point of change
- another change detail
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`

## Before Committing
1. Run `make typecheck` — must pass
2. Run `make build` — must pass  
3. Review `git diff --stat` — confirm only intended files changed
4. No `console.log` or debug code left behind

## After Committing
- Push with `git push origin main`
- If CI exists, verify it passes
