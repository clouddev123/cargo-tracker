import { create95306Client } from './api95306.js';
import { retry } from '../utils/retry.js';
import { getDb } from '../database/connection.js';
import type { CargoTrackRawItem, CargoTrackListResponse } from '../types/cargo.types.js';

export interface TrackResult {
  shipping: CargoTrackRawItem[];
  receiving: CargoTrackRawItem[];
  selected: CargoTrackRawItem | null;
  shippingTotal: number;
  receivingTotal: number;
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function queryByBoxNumber(boxNumber: string): Promise<TrackResult> {
  const client = create95306Client();
  const today = dateStr(new Date());
  const lastMonth = dateStr(new Date(Date.now() - 30 * 86400000));

  const baseBody = {
    xh: boxNumber,
    ch: '',
    cxlx: '1',
    xqslh: '',
    ydid: '',
    hph: '',
    dzsfh: '',
    qsrq: lastMonth,
    zzrq: today,
    tbrqStart: '',
    tbrqEnd: '',
    ysfs: '',
    pl: '',
    shdwmc: '',
    shdwdm: '',
    djdm: '',
    ztgj: '',
    pageNum: 1,
    pageSize: 20,
  };

  const t0 = Date.now();

  const [shippingRes, receivingRes] = await Promise.allSettled([
    retry(() =>
      client.post<CargoTrackListResponse>('/api/scjh/track/queryCargoTrackWayBill', {
        ...baseBody,
        type: '1',
      }),
    ),
    retry(() =>
      client.post<CargoTrackListResponse>('/api/scjh/track/queryCargoTrackWayBill', {
        ...baseBody,
        type: '2',
      }),
    ),
  ]);

  const shippingOk = shippingRes.status === 'fulfilled' && shippingRes.value.data?.returnCode === '00200';
  const receivingOk = receivingRes.status === 'fulfilled' && receivingRes.value.data?.returnCode === '00200';

  const shippingList = shippingOk ? (shippingRes.value.data.data.list || []) : [];
  const receivingList = receivingOk ? (receivingRes.value.data.data.list || []) : [];

  const selected = shippingList[0] || receivingList[0] || null;

  function settleError(r: PromiseSettledResult<unknown>): string | null {
    if (r.status === 'rejected') {
      const reason: unknown = r.reason;
      return reason instanceof Error ? reason.message : 'Request failed';
    }
    return null;
  }

  const db = getDb();
  const elapsed = Date.now() - t0;
  const insertStmt = db.prepare(`
    INSERT INTO search_queries (box_number, type, result_data, is_success, error_message, response_time_ms)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertStmt.run(boxNumber, '1', JSON.stringify(shippingList), shippingOk ? 1 : 0, settleError(shippingRes), elapsed);
  insertStmt.run(boxNumber, '2', JSON.stringify(receivingList), receivingOk ? 1 : 0, settleError(receivingRes), elapsed);

  return {
    shipping: shippingList,
    receiving: receivingList,
    selected,
    shippingTotal: shippingRes.status === 'fulfilled' ? shippingRes.value.data?.data?.total || 0 : 0,
    receivingTotal: receivingRes.status === 'fulfilled' ? receivingRes.value.data?.data?.total || 0 : 0,
  };
}
