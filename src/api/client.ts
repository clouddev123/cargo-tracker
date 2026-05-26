import type { TrackResult, TrajectoryResult, TrackedBoxNumber, HistoryListResult } from '../types/index.js';

const BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
  return data as T;
}

export const api = {
  auth: {
    status: (): Promise<{ hasCredentials: boolean; username?: string; unitname?: string }> =>
      fetchJson(`${BASE}/auth/status`),
    save: (cookie: string): Promise<{ success: boolean; username: string; unitname: string }> =>
      fetchJson(`${BASE}/auth/credentials`, {
        method: 'POST',
        body: JSON.stringify({ cookie }),
      }),
  },
  cargo: {
    track: (boxNumber: string): Promise<TrackResult> =>
      fetchJson(`${BASE}/cargo/track`, {
        method: 'POST',
        body: JSON.stringify({ boxNumber }),
      }),
    trajectory: (ydid: string): Promise<TrajectoryResult> =>
      fetchJson(`${BASE}/cargo/trajectory/${encodeURIComponent(ydid)}`),
  },
  boxNumbers: {
    list: (): Promise<TrackedBoxNumber[]> =>
      fetchJson(`${BASE}/box-numbers`),
    add: (boxNumber: string, label?: string): Promise<TrackedBoxNumber> =>
      fetchJson(`${BASE}/box-numbers`, {
        method: 'POST',
        body: JSON.stringify({ boxNumber, label }),
      }),
    update: (id: number, data: { boxNumber?: string; label?: string }): Promise<TrackedBoxNumber> =>
      fetchJson(`${BASE}/box-numbers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number): Promise<{ success: boolean }> =>
      fetchJson(`${BASE}/box-numbers/${id}`, { method: 'DELETE' }),
    refresh: (id: number): Promise<TrackedBoxNumber> =>
      fetchJson(`${BASE}/box-numbers/${id}/refresh`, { method: 'POST' }),
    refreshAll: (): Promise<{ count: number; list: TrackedBoxNumber[] }> =>
      fetchJson(`${BASE}/box-numbers/refresh-all`, { method: 'POST' }),
  },
  history: {
    list: (params?: { page?: number; pageSize?: number; boxNumber?: string }): Promise<HistoryListResult> => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
      if (params?.boxNumber) qs.set('boxNumber', params.boxNumber);
      return fetchJson(`${BASE}/cargo/history?${qs.toString()}`);
    },
    delete: (id: number): Promise<{ success: boolean }> =>
      fetchJson(`${BASE}/cargo/history/${id}`, { method: 'DELETE' }),
  },
};
