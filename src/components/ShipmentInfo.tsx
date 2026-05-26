import type { CargoTrackItem } from '../types/index.js';
import { StatusBadge } from './StatusBadge.js';

interface Props {
  data: CargoTrackItem;
}

interface InfoField {
  label: string;
  value: string | [string, string?];
  mono?: boolean;
  span?: 2;
}

export function ShipmentInfo({ data }: Props) {
  const fields: InfoField[] = [
    { label: '需求号', value: data.ydid, mono: true },
    { label: '箱号', value: data.xh },
    { label: '车号', value: data.ch },
    { label: '货票号', value: data.hph },
    { label: '货物品名', value: data.hzpm },
    { label: '运输方式', value: data.ysfs || '-' },
    { label: '发站', value: [data.fzhzzm, data.fjm] },
    { label: '到站', value: [data.dzhzzm, data.djm] },
    { label: '发货单位', value: data.fhdwmc },
    { label: '发货经办人', value: data.fhjbrxm ? `${data.fhjbrxm}  ${data.fhjbrsj || ''}` : '-' },
    { label: '收货单位', value: data.shdwmc },
    { label: '收货经办人', value: data.shjbrxm ? `${data.shjbrxm}  ${data.shjbrsj || ''}` : '-' },
    { label: '装车日期', value: data.zcrq },
    { label: '货物重量', value: data.tyrqdzl ? `${data.tyrqdzl} kg` : '-' },
    { label: '需求受理号', value: data.xqslh || '-', mono: true },
  ];

  return (
    <div className="card">
      <h3 className="card-title">运单信息</h3>
      <div className="info-grid">
        {fields.map((f) => (
          <div key={f.label} className="info-item" style={f.span ? { gridColumn: `span ${f.span}` } : undefined}>
            <span className="info-item-label">{f.label}</span>
            {Array.isArray(f.value) ? (
              <span className="info-item-value">
                {f.value[0]}
                {f.value[1] && <span className="text-muted" style={{ marginLeft: 8 }}>({f.value[1]})</span>}
              </span>
            ) : f.label === '状态' ? (
              <span>
                <StatusBadge code={data.ztgj} label={data.ztgjjc} />
              </span>
            ) : (
              <span className={`info-item-value${f.mono ? ' mono' : ''}`}>{f.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
