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

  const shippingList =
    shippingRes.status === 'fulfilled' && shippingRes.value.data?.returnCode === '00200'
      ? (shippingRes.value.data.data.list || [])
      : [];
  const receivingList =
    receivingRes.status === 'fulfilled' && receivingRes.value.data?.returnCode === '00200'
      ? (receivingRes.value.data.data.list || [])
      : [];

  const selected = shippingList[0] || receivingList[0] || null;

  // Store query history
  const db = getDb();
  const t0 = Date.now();
  const insertStmt = db.prepare(`
    INSERT INTO search_queries (box_number, type, result_data, is_success, response_time_ms)
    VALUES (?, ?, ?, 1, ?)
  `);
  if (shippingList.length > 0) {
    insertStmt.run(boxNumber, '1', JSON.stringify(shippingList), Date.now() - t0);
  }
  if (receivingList.length > 0) {
    insertStmt.run(boxNumber, '2', JSON.stringify(receivingList), Date.now() - t0);
  }
  if (shippingList.length === 0 && receivingList.length === 0) {
    insertStmt.run(boxNumber, '1', null, Date.now() - t0);
  }

  return {
    shipping: shippingList,
    receiving: receivingList,
    selected,
    shippingTotal: shippingRes.status === 'fulfilled' ? shippingRes.value.data?.data?.total || 0 : 0,
    receivingTotal: receivingRes.status === 'fulfilled' ? receivingRes.value.data?.data?.total || 0 : 0,
  };
}
