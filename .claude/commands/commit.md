Commit the current changes after verifying:

1. Run `make typecheck` — must pass
2. Run `make build` — must pass
3. Review the diff: `git diff --stat`
4. Commit with conventional commit format:

```bash
git add -A
git commit -m "type: description

- bullet point of what changed
- another change detail"
```

Use these types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
