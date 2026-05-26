# React Component Development

When asked to create or modify React components or pages:

## Rules
- React 19 + TypeScript + Vite 6
- State management: Zustand stores in `src/stores/`
- Routing: React Router 7 in `src/App.tsx`
- Styling: pure CSS in `index.css` (no UI framework)
- Import with `.js` extension: `import { Foo } from './Foo.js'`
- NEVER use `any` — use `unknown` + type guards for unknown shapes
- NEVER use `// @ts-ignore` or `// @ts-expect-error`

## Component Pattern
```tsx
import { useState } from 'react';
import type { SomeType } from '../types/index.js';

interface Props {
  title: string;
  onAction: (id: number) => void;
}

export function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState<string>('');
  
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {/* ... */}
    </div>
  );
}
```

## Store Pattern (Zustand)
```ts
import { create } from 'zustand';
import { api } from '../api/client.js';

interface MyState {
  data: Item[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useMyStore = create<MyState>((set) => ({
  data: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.myEndpoint();
      set({ data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
```

## Pages & Routes
- `/` → `TrackSearchPage` — box number search
- `/trajectory/:ydid` → `TrajectoryPage` — trajectory timeline
- `/history` → `HistoryPage` — search history
- `/box-numbers` → `BoxNumberManagePage` — box number CRUD
- `/credentials` → `CredentialsPage` — 95306 cookie config

## API Client
Always use `api` from `src/api/client.js`:
```tsx
import { api } from '../api/client.js';

// Fetch
const data = await api.cargo.track(boxNumber);
const trajectory = await api.cargo.trajectory(ydid);
const history = await api.history.list({ page: 1 });
```
