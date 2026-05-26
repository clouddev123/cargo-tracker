import { create95306Client } from './api95306.js';
import { getDb } from '../database/connection.js';
import { encodeYdid6x } from '../utils/ydidEncoder.js';
import type { TrajectoryResponse, CargoTrackRawItem, TrajectoryEvent, TransitStop } from '../types/cargo.types.js';

export interface TrajectoryResult {
  fsMain: CargoTrackRawItem;
  events: TrajectoryEvent[];
  transitStops: TransitStop[];
  gjzt: Record<string, string>;
  estimatedArrival: string;
  estimatedDistance: number;
}

export async function getTrajectory(ydid: string): Promise<TrajectoryResult> {
  // Check cache
  const db = getDb();
  const cached = db
    .prepare(
      `SELECT * FROM trajectory_cache WHERE ydid = ? AND expires_at > datetime('now')`,
    )
    .get(ydid) as {
      fs_main: string;
      events: string;
      transit_stops: string;
      full_response: string;
      gjzt: string | null;
      estimated_arrival: string | null;
      estimated_distance: number | null;
    } | undefined;

  if (cached) {
    return {
      fsMain: JSON.parse(cached.fs_main),
      events: JSON.parse(cached.events),
      transitStops: JSON.parse(cached.transit_stops),
      gjzt: cached.gjzt ? JSON.parse(cached.gjzt) : {},
      estimatedArrival: cached.estimated_arrival || '',
      estimatedDistance: cached.estimated_distance || 0,
    };
  }

  const client = create95306Client();
  const encoded = encodeYdid6x(ydid);

  const resp = await client.post<TrajectoryResponse>('/api/scjh/track/qeryYdgjNew', {
    ydid: encoded,
  });

  if (resp.data.returnCode !== '00200') {
    throw new Error(resp.data.msg || 'Trajectory query failed');
  }

  const { fsMain, gj, jlzc, gjzt, yjddsj, yjddlc } = resp.data.data;

  const expiresAt = new Date(Date.now() + 24 * 3600000).toISOString();

  db.prepare(
    `INSERT OR REPLACE INTO trajectory_cache
       (ydid, fs_main, events, transit_stops, full_response, gjzt, estimated_arrival, estimated_distance, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    ydid,
    JSON.stringify(fsMain),
    JSON.stringify(gj),
    JSON.stringify(jlzc),
    JSON.stringify(resp.data.data),
    JSON.stringify(gjzt),
    yjddsj,
    yjddlc,
    expiresAt,
  );

  return {
    fsMain,
    events: gj,
    transitStops: jlzc,
    gjzt,
    estimatedArrival: yjddsj,
    estimatedDistance: yjddlc,
  };
}
