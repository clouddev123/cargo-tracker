export interface CargoTrackItem {
  ydid: string;
  xh: string;
  ch: string;
  hph: string;
  hzpm: string;
  ztgj: string;
  ztgjjc: string;
  fzhzzm: string;
  fjm: string;
  dzhzzm: string;
  djm: string;
  fhdwmc: string;
  fhjbrxm: string;
  fhjbrsj: string;
  shdwmc: string;
  shjbrxm: string;
  shjbrsj: string;
  zcrq: string;
  tyrqdzl: number;
  ysfs: string;
  hwjs: string;
  xqslh: string;
  ifbg: string;
}

export interface TrajectoryEvent {
  operator: string;
  message: string;
  detail: string;
  czdz: string;
  tmism: string;
  czdbm: string;
}

export interface TransitStop {
  operator: string;
  message: string;
  detail: string;
  czdz: string;
  yjddsj: string;
}

export interface TrackResult {
  shipping: CargoTrackItem[];
  receiving: CargoTrackItem[];
  selected: CargoTrackItem | null;
  shippingTotal: number;
  receivingTotal: number;
}

export interface TrajectoryResult {
  fsMain: CargoTrackItem;
  events: TrajectoryEvent[];
  transitStops: TransitStop[];
  gjzt: Record<string, string>;
  estimatedArrival: string;
  estimatedDistance: number;
}

export interface TrackedBoxNumber {
  id: number;
  box_number: string;
  label: string | null;
  shipping_ydid: string | null;
  receiving_ydid: string | null;
  latest_status: string | null;
  last_queried_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface HistoryListResult {
  page: number;
  pageSize: number;
  total: number;
  list: Array<{
    id: number;
    box_number: string;
    type: string;
    result_data: string;
    is_success: number;
    error_message: string | null;
    created_at: string;
  }>;
}
