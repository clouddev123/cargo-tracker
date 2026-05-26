import { create } from 'zustand';
import { api } from '../api/client.js';

interface AuthState {
  hasCredentials: boolean;
  username: string;
  unitname: string;
  error: string | null;
  checkStatus: () => Promise<void>;
  saveCredentials: (cookie: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  hasCredentials: false,
  username: '',
  unitname: '',
  error: null,
  checkStatus: async () => {
    try {
      const status = await api.auth.status();
      set({
        hasCredentials: status.hasCredentials,
        username: status.username || '',
        unitname: status.unitname || '',
        error: null,
      });
    } catch {
      set({ hasCredentials: false });
    }
  },
  saveCredentials: async (cookie) => {
    try {
      const result = await api.auth.save(cookie);
      set({
        hasCredentials: true,
        username: result.username,
        unitname: result.unitname,
        error: null,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save credentials';
      set({ error: message });
      return false;
    }
  },
}));
