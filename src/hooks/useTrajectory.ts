import { useState, useCallback } from 'react';
import { api } from '../api/client.js';
import type { TrajectoryResult } from '../types/index.js';

export function useTrajectory(ydid: string) {
  const [data, setData] = useState<TrajectoryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.cargo.trajectory(ydid);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ydid]);

  return { data, loading, error, refresh: fetch };
}
