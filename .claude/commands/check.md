Run the full quality gate:

```bash
make check
```

This runs typecheck + full build. Equivalent to `make typecheck && make build`.
All steps must pass before the change is considered done.
