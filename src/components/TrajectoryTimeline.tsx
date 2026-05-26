import type { TrajectoryEvent } from '../types/index.js';

interface Props {
  events: TrajectoryEvent[];
}

const STATUS_ICONS: Record<string, string> = {
  '已发车': '🚂',
  '已到达': '🏁',
  '已装车': '📦',
  '已卸车': '📤',
  '在途': '🛤️',
  '发出': '📮',
  '到达': '📍',
};

function getIcon(msg: string): string {
  for (const [key, icon] of Object.entries(STATUS_ICONS)) {
    if (msg.includes(key)) return icon;
  }
  return '●';
}

export function TrajectoryTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          暂无轨迹数据
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">轨迹时间轴</h3>
      <div className="timeline">
        {events.map((event, i) => {
          const isFirst = i === 0;
          const isLast = i === events.length - 1;
          return (
            <div
              key={i}
              className={`timeline-item${isFirst ? ' timeline-first' : ''}${isLast ? ' timeline-last' : ''}`}
            >
              <div className="timeline-marker">
                <div className="timeline-dot" />
                {!isLast && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-message">
                    <span style={{ marginRight: 6 }}>{getIcon(event.message)}</span>
                    {event.message}
                  </span>
                  <span className="timeline-time">{event.detail}</span>
                </div>
                <div className="timeline-station">{event.operator}</div>
                {event.czdz && <div className="timeline-address">{event.czdz}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
