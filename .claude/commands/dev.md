Start the development server using the Makefile:

```bash
make dev
```

This starts both the Express API (port 3001) and Vite dev server (port 5173) with hot reload.
The frontend is available at http://localhost:5173 and proxies /api requests to the backend.
After starting, verify both services are running with `make status`.
