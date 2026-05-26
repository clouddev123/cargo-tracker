export interface CargoTrackRawItem {
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
  dj: string;
  fj: string;
  ysfs: string;
  hwjs: string;
  xqslh: string;
  crcbs: string;
  ifbg: string;
}

export interface CargoTrackListResponse {
  msg: string;
  returnCode: string;
  data: {
    total: number;
    list: CargoTrackRawItem[];
    pageNum: number;
    pageSize: number;
    pages: number;
  };
}

export interface TrajectoryEvent {
  operator: string;
  message: string;
  detail: string;
  czdz: string;
  tmism: string;
  czdbm: string;
  rptid: string | null;
}

export interface TransitStop {
  operator: string;
  message: string;
  detail: string;
  czdz: string;
  yjddsj: string;
}

export interface TrajectoryResponse {
  msg: string;
  returnCode: string;
  data: {
    fsMain: CargoTrackRawItem;
    gj: TrajectoryEvent[];
    jlzc: TransitStop[];
    gjzt: Record<string, string>;
    dtgjDetailVoList: unknown[];
    yjddsj: string;
    yjddlc: number;
    useHour: number;
  };
}

export interface UserdoPayload {
  userName: string;
  unitName: string;
  unitTag: string;
  userId: string;
  bureauId: string;
  bureauDm: string;
  userType: string;
  unitId: string;
  type: string;
  unitPropertiesList: unknown[];
}
