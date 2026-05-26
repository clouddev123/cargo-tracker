import { useNavigate } from 'react-router-dom';
import type { CargoTrackItem } from '../types/index.js';
import { StatusBadge } from './StatusBadge.js';

interface Props {
  items: CargoTrackItem[];
  total: number;
}

const COLUMNS: { key: keyof CargoTrackItem | 'action'; label: string; mono?: boolean; ellipsis?: boolean }[] = [
  { key: 'xh', label: '箱号' },
  { key: 'ch', label: '车号' },
  { key: 'hph', label: '货票号' },
  { key: 'hzpm', label: '货物品名', ellipsis: true },
  { key: 'ztgjjc', label: '状态' },
  { key: 'fzhzzm', label: '发站' },
  { key: 'dzhzzm', label: '到站' },
  { key: 'fhdwmc', label: '发货单位', ellipsis: true },
  { key: 'shdwmc', label: '收货单位', ellipsis: true },
  { key: 'zcrq', label: '装车日期' },
  { key: 'ydid', label: '需求号', mono: true },
  { key: 'action', label: '操作' },
];

export function CargoTrackTable({ items, total }: Props) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          暂无数据
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <span className="table-info">共 {total} 条记录</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.ydid || i}
                className="table-row-clickable"
                onClick={() => navigate(`/trajectory/${item.ydid}`)}
              >
                {COLUMNS.map((col) => {
                  if (col.key === 'action') {
                    return (
                      <td key="action" onClick={(e) => e.stopPropagation()}>
                        <span
                          className="link-text"
                          onClick={() => navigate(`/trajectory/${item.ydid}`)}
                        >
                          轨迹
                        </span>
                      </td>
                    );
                  }
                  if (col.key === 'ztgjjc') {
                    return (
                      <td key={col.key}>
                        <StatusBadge code={item.ztgj} label={item.ztgjjc} />
                      </td>
                    );
                  }
                  const val = item[col.key] ?? '-';
                  let cls = '';
                  if (col.mono) cls = 'cell-mono';
                  if (col.ellipsis) cls = `${cls} cell-ellipsis`.trim();
                  return (
                    <td key={col.key} className={cls || undefined} title={String(val)}>
                      {String(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
