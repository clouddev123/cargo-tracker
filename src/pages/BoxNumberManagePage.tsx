import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import type { TrackedBoxNumber } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorAlert } from '../components/ErrorAlert.js';

export function BoxNumberManagePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<TrackedBoxNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<Set<number>>(new Set());
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boxNumber, setBoxNumber] = useState('');
  const [label, setLabel] = useState('');
  const [adding, setAdding] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBoxNumber, setEditBoxNumber] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.boxNumbers.list();
      setItems(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!boxNumber.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await api.boxNumbers.add(boxNumber.trim(), label.trim() || undefined);
      setBoxNumber('');
      setLabel('');
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (item: TrackedBoxNumber) => {
    setEditingId(item.id);
    setEditBoxNumber(item.box_number);
    setEditLabel(item.label || '');
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBoxNumber('');
    setEditLabel('');
  };

  const saveEdit = async () => {
    if (!editingId || !editBoxNumber.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await api.boxNumbers.update(editingId, {
        boxNumber: editBoxNumber.trim(),
        label: editLabel.trim() || undefined,
      });
      setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      cancelEdit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.boxNumbers.remove(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRefresh = async (id: number) => {
    setRefreshing((prev) => new Set(prev).add(id));
    try {
      const updated = await api.boxNumbers.refresh(id);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch { /* keep old data */ }
    finally {
      setRefreshing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleRefreshAll = async () => {
    setRefreshingAll(true);
    setError(null);
    try {
      const result = await api.boxNumbers.refreshAll();
      setItems(result.list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshingAll(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return d.replace('T', ' ').substring(0, 16);
  };

  if (loading) return <LoadingSpinner text="加载箱号列表..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title" style={{ margin: 0 }}>箱号管理</h1>
        <button
          className="btn btn-primary"
          onClick={handleRefreshAll}
          disabled={refreshingAll || items.length === 0}
        >
          {refreshingAll ? '刷新中...' : '批量刷新'}
        </button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="search-box">
        <div className="search-box-header">添加箱号</div>
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="输入箱号，例如: TRHU8340834"
            value={boxNumber}
            onChange={(e) => setBoxNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            disabled={adding}
          />
          <input
            type="text"
            className="search-input"
            style={{ maxWidth: 240 }}
            placeholder="备注（可选）"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            disabled={adding}
          />
          <button className="btn btn-primary" onClick={handleAdd} disabled={adding || !boxNumber.trim()}>
            {adding ? '添加中...' : '添加'}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            暂无管理的箱号，请添加
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-toolbar">
            <span className="table-info">共 {items.length} 个箱号</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>箱号</th>
                  <th>备注</th>
                  <th>发货需求号</th>
                  <th>收货需求号</th>
                  <th>最新状态</th>
                  <th>最近查询</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id}>
                      <td>
                        {isEditing ? (
                          <input
                            className="search-input"
                            style={{ width: 160, padding: '4px 8px', fontSize: 13 }}
                            value={editBoxNumber}
                            onChange={(e) => setEditBoxNumber(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                            autoFocus
                          />
                        ) : (
                          <span className="tag tag-blue">{item.box_number}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="search-input"
                            style={{ width: 140, padding: '4px 8px', fontSize: 13 }}
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                            placeholder="备注"
                          />
                        ) : (
                          <span
                            style={{ cursor: 'pointer', minWidth: 40, display: 'inline-block' }}
                            onClick={() => startEdit(item)}
                            title="点击编辑"
                          >
                            {item.label || <span className="text-muted">-</span>}
                          </span>
                        )}
                      </td>
                      <td className="cell-mono" title={item.shipping_ydid || undefined}>{item.shipping_ydid || '-'}</td>
                      <td className="cell-mono" title={item.receiving_ydid || undefined}>{item.receiving_ydid || '-'}</td>
                      <td>
                        {item.latest_status ? (
                          <StatusBadge code={item.latest_status} label={item.latest_status} />
                        ) : '-'}
                      </td>
                      <td>{formatDate(item.last_queried_at)}</td>
                      <td>
                        <div className="cell-actions">
                          {isEditing ? (
                            <>
                              <span className="link-text" onClick={saveEdit}>
                                {saving ? '保存中...' : '保存'}
                              </span>
                              <span className="link-text" onClick={cancelEdit}>取消</span>
                            </>
                          ) : (
                            <>
                              <span className="link-text" onClick={() => startEdit(item)}>编辑</span>
                              <span className="link-text" onClick={() => handleRefresh(item.id)}>
                                {refreshing.has(item.id) ? '刷新中...' : '刷新'}
                              </span>
                              {item.shipping_ydid && (
                                <span className="link-text" onClick={() => navigate(`/trajectory/${item.shipping_ydid}`)}>
                                  轨迹
                                </span>
                              )}
                              <span className="link-text link-danger" onClick={() => handleDelete(item.id)}>
                                删除
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
