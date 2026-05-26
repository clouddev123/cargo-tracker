Build the project for production:

```bash
make build
```

This runs:
1. `tsc -p tsconfig.server.json` — compile server TypeScript to `server/dist/`
2. `vite build` — bundle client to `dist/`

If TypeScript errors appear, fix them before proceeding. Never use `any` or `@ts-ignore` to bypass errors.
After a successful build, the production server can be started with `make start`.
