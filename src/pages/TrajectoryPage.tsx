import { useParams, useNavigate } from 'react-router-dom';
import { useTrajectory } from '../hooks/useTrajectory.js';
import { useEffect } from 'react';
import { ShipmentInfo } from '../components/ShipmentInfo.js';
import { TrajectoryTimeline } from '../components/TrajectoryTimeline.js';
import { TransitStationList } from '../components/TransitStationList.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorAlert } from '../components/ErrorAlert.js';

export function TrajectoryPage() {
  const { ydid } = useParams<{ ydid: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useTrajectory(ydid || '');

  useEffect(() => {
    if (ydid) refresh();
  }, [ydid, refresh]);

  if (loading) return <LoadingSpinner text="加载轨迹详情..." />;
  if (error) return <ErrorAlert message={error} />;
  if (!data) return <div className="empty-state">无轨迹数据</div>;

  const { fsMain, events, transitStops } = data;
  const eventCount = events.length;
  const lastEvent = events[0];
  const startStation = fsMain.fzhzzm;
  const endStation = fsMain.dzhzzm;

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('/')}>运踪查询</span>
        <span className="breadcrumb-sep">/</span>
        <span>轨迹详情</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>货物轨迹详情</h1>
        </div>
        <div className="btn-group">
          <span className="tag tag-blue">箱号: {fsMain.xh}</span>
          <span className="tag tag-green">车号: {fsMain.ch}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="progress-steps">
          <div className={`progress-step ${startStation ? 'done' : ''}`}>
            <div className="progress-step-node">
              <div className={`progress-dot ${startStation ? 'done' : ''}`}>1</div>
              <span className="progress-label">发站{startStation ? ` (${startStation})` : ''}</span>
            </div>
          </div>
          <div className={`progress-connector ${eventCount > 0 ? 'done' : ''}`} />
          <div className={`progress-step ${eventCount > 0 ? 'active' : ''}`}>
            <div className="progress-step-node">
              <div className={`progress-dot ${eventCount > 0 ? 'active' : ''}`}>2</div>
              <span className="progress-label">在途运输</span>
            </div>
          </div>
          <div className={`progress-connector ${eventCount > 1 ? 'done' : ''}`} />
          <div className={`progress-step ${eventCount > 1 ? 'done' : ''}`}>
            <div className="progress-step-node">
              <div className={`progress-dot ${eventCount > 1 ? 'done' : ''}`}>3</div>
              <span className="progress-label">到站{endStation ? ` (${endStation})` : ''}</span>
            </div>
          </div>
        </div>
        {lastEvent && (
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            最新状态: <strong style={{ color: 'var(--primary)' }}>{lastEvent.message}</strong>
            {lastEvent.detail && <span className="text-muted"> · {lastEvent.detail}</span>}
          </div>
        )}
      </div>

      <ShipmentInfo data={fsMain} />
      <TrajectoryTimeline events={events} />
      <TransitStationList stops={transitStops} />
    </div>
  );
}
