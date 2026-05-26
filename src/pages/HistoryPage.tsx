import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import type { CargoTrackItem, HistoryListResult } from '../types/index.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';

export function HistoryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<HistoryListResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await api.history.list({ page: 1, pageSize: 50 });
      setData(result);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    await api.history.delete(id);
    load();
  };

  if (loading) return <LoadingSpinner text="加载历史记录..." />;

  return (
    <div className="page">
      <h1 className="page-title">查询历史</h1>

      {!data || data.list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🕐</div>
            暂无查询记录
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-toolbar">
            <span className="table-info">共 {data.total} 条记录</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>箱号</th>
                <th>类型</th>
                <th>结果数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.list.map((row) => {
                let items: CargoTrackItem[] = [];
                try { items = row.result_data ? JSON.parse(row.result_data) : []; }
                catch { /* ignore */ }
                return (
                  <tr key={row.id}>
                    <td>{row.created_at}</td>
                    <td><span className="tag tag-blue">{row.box_number}</span></td>
                    <td>
                      <span className={`tag ${row.type === '1' ? 'tag-orange' : 'tag-green'}`}>
                        {row.type === '1' ? '发货' : '收货'}
                      </span>
                    </td>
                    <td>{Array.isArray(items) ? items.length : 0}</td>
                    <td>
                      <div className="cell-actions">
                        <span
                          className="link-text"
                          onClick={() => {
                            if (Array.isArray(items) && items.length > 0) {
                              navigate(`/trajectory/${items[0].ydid}`);
                            }
                          }}
                        >
                          查看
                        </span>
                        <span className="link-text link-danger" onClick={() => handleDelete(row.id)}>
                          删除
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
